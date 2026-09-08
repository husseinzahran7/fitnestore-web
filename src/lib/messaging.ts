"use server";

import { createClient } from "@/lib/supabase/server";
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

    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .in("conversation_id", ids)
      .order("created_at", { ascending: true });
    if (msgError || !messages || messages.length === 0) {
      return { conversations: [], live: false };
    }

    const senderIds = [...new Set(messages.map((m) => m.sender_id))];
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
        const otherId = other?.sender_id ?? user.id;
        const info = who.get(otherId) ?? { name: "Coach", role: "coach" as const };
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
  if (!conversationId || !text) return { error: "Empty message." };
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — message not sent." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };

  // RLS enforces sender_id = auth.uid() + membership; no extra checks here.
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: text,
  });
  if (error) return { error: "Couldn't send. Try again." };
  return { ok: true };
}
