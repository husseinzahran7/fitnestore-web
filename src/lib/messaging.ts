"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";
import type { Conversation } from "@/data/mockConversations";

// Live conversations mapped onto the shared Conversation shape.
// Real columns only: conversations(id), conversation_participants(
// conversation_id, profile_id), messages(id, conversation_id, sender_id,
// content, created_at), profiles(id, name, role). No read/unread flags
// exist — unreadCount is always 0 for live threads.
export async function getConversations(
  myRole: "user" | "coach"
): Promise<{ conversations: Conversation[]; live: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { conversations: [], live: false };

    const { data: parts, error: partsError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("profile_id", user.id);
    if (partsError || !parts || parts.length === 0) {
      return { conversations: [], live: false };
    }
    const ids = parts.map((p) => p.conversation_id);

    // Other participant per thread from membership rows — message senders
    // alone mislabel threads where one side hasn't written yet.
    const { data: convParts } = await supabase
      .from("conversation_participants")
      .select("conversation_id, profile_id")
      .in("conversation_id", ids);
    const otherByConv = new Map<string, string>();
    for (const cp of convParts ?? []) {
      if (cp.profile_id !== user.id && !otherByConv.has(cp.conversation_id)) {
        otherByConv.set(cp.conversation_id, cp.profile_id);
      }
    }
    // Pending consult threads hold one member only — counterpart comes
    // from the request row so headers never show self.
    const { data: reqs } = await supabase
      .from("consult_requests")
      .select("conversation_id, coach_id, user_id")
      .in("conversation_id", ids);
    for (const r of reqs ?? []) {
      if (!otherByConv.has(r.conversation_id)) {
        const counterpart =
          myRole === "coach" ? r.user_id : r.coach_id;
        if (counterpart && counterpart !== user.id) {
          otherByConv.set(r.conversation_id, counterpart);
        }
      }
    }

    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .in("conversation_id", ids)
      .order("created_at", { ascending: true });
    if (msgError || !messages || messages.length === 0) {
      return { conversations: [], live: false };
    }

    const senderIds = [
      ...new Set([
        ...messages.map((m) => m.sender_id),
        ...otherByConv.values(),
      ]),
    ];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, role")
      .in("id", senderIds);
    const who = new Map(
      (profiles ?? []).map((p) => [
        p.id,
        {
          name: (p.name as string) ?? "Member",
          role: ((p.role as string) === "coach" ? "coach" : "user") as
            | "user"
            | "coach",
        },
      ])
    );

    const byConv = new Map<string, typeof messages>();
    for (const m of messages) {
      const arr = byConv.get(m.conversation_id) ?? [];
      arr.push(m);
      byConv.set(m.conversation_id, arr);
    }

    const conversations: Conversation[] = [...byConv.entries()].map(
      ([convId, msgs]) => {
        const other = msgs.find((m) => m.sender_id !== user.id);
        const rawOther =
          otherByConv.get(convId) ?? other?.sender_id;
        const otherId = rawOther ?? user.id;
        // No counterpart anywhere (orphan seed thread) → generic role
        // word, never self.
        const fallbackRole = (myRole === "coach" ? "user" : "coach") as
          | "user"
          | "coach";
        const info = (rawOther && who.get(rawOther)) ?? {
          name: myRole === "coach" ? "Client" : "Coach",
          role: fallbackRole,
        };
        const last = msgs[msgs.length - 1];
        return {
          id: convId,
          participantId: otherId,
          participantName: info.name,
          participantRole: myRole === "coach" ? "user" : info.role,
          lastMessage: last.content,
          lastMessageTime: new Date(last.created_at),
          unreadCount: 0,
          messages: msgs.map((m) => {
            const s = who.get(m.sender_id) ?? { name: "You", role: myRole };
            const mine = m.sender_id === user.id;
            return {
              id: m.id,
              senderId: mine ? "me" : m.sender_id,
              senderName: mine ? "You" : s.name,
              senderRole: mine ? myRole : s.role,
              content: m.content,
              timestamp: new Date(m.created_at),
              isRead: true,
            };
          }),
        };
      }
    );
    return { conversations, live: true };
  } catch {
    return { conversations: [], live: false };
  }
}

export type SendState = { error?: string; ok?: boolean };

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<SendState> {
  const text = content.trim();
  if (!conversationId || !text) return { error: (await getDict()).errors.emptyMessage };
  const t = await getDict();
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: t.errors.noSupabase };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.errors.signedOut };
  if (!(await requireActive())) return { error: t.errors.suspended };

  // RLS enforces sender_id = auth.uid() + membership; no extra checks here.
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: text,
  });
  if (error) return { error: t.errors.cantSend };
  revalidatePath("/dashboard/messages");
  revalidatePath("/coach/messages");
  return { ok: true };
}
