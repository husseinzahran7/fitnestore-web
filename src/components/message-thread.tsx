"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import type { Conversation } from "@/data/mockConversations";
import type { Dict } from "@/lib/locale";

export default function MessageThread({
  conversations,
  emptyHint,
  me = "user",
  onSend,
  t,
}: {
  conversations: Conversation[];
  emptyHint: string;
  me?: "user" | "coach";
  onSend?: (conversationId: string, content: string) => Promise<{ error?: string }>;
  t: Dict;
}) {
  const [list, setList] = useState(conversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const active = list.find((c) => c.id === activeId) ?? null;

  const select = (id: string) => {
    setList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) => ({ ...m, isRead: true })),
            }
          : c
      )
    );
    setActiveId(id);
  };

  /* eslint-disable react-hooks/purity -- send is an event handler; ids and timestamps must be fresh per tap */
  const send = async () => {
    const text = draft.trim();
    if (!text || !active || sending) return;
    setSendError(null);
    if (onSend) {
      setSending(true);
      const res = await onSend(active.id, text);
      setSending(false);
      if (res?.error) {
        setSendError(res.error);
        return;
      }
    }
    const now = Date.now();
    const msg = {
      id: `local-${now}`,
      senderId: "me",
      senderName: "You",
      senderRole: me,
      content: text,
      timestamp: new Date(now),
      isRead: true,
    };
    setList((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: msg.timestamp,
              messages: [...c.messages, msg],
            }
          : c
      )
    );
    setDraft("");
  };
  /* eslint-enable react-hooks/purity */

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:col-span-1">
        {list.map((c) => (
          <button
            key={c.id}
            onClick={() => select(c.id)}
            className={`flex w-full items-center gap-3 border-b border-white/5 p-4 text-start transition-colors hover:bg-white/5 ${
              c.id === activeId ? "bg-white/5" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-400">
              {c.participantName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                {c.participantName}
              </div>
              <div className="truncate text-xs text-slate-400">{c.lastMessage}</div>
            </div>
            {c.unreadCount > 0 && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                {c.unreadCount}
              </span>
            )}
          </button>
        ))}
        {list.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-400">{emptyHint}</p>
        )}
      </div>

      <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:col-span-2">
        {active ? (
          <>
            <div className="flex items-center gap-2 border-b border-white/10 p-3">
              <button
                onClick={() => setActiveId(null)}
                aria-label={t.msgs.back}
                className="rounded-lg p-2 hover:bg-white/10 md:hidden"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm font-bold">{active.participantName}</span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {active.messages.map((m) => {
                const mine = m.senderRole === me;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        mine ? "bg-brand-500 text-white" : "bg-white/10"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 border-t border-white/10 p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder={t.common.typeMessage}
                aria-label={t.common.typeMessage}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
              />
              <button
                onClick={send}
                disabled={!draft.trim() || sending}
                aria-label={t.common.sendMessage}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white transition-all hover:bg-brand-400 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
            {sendError && (
              <p role="alert" className="border-t border-white/10 px-4 py-2 text-xs text-red-400">
                {sendError}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <p className="font-semibold">{t.msgs.noSelection}</p>
            <p className="mt-1 text-sm text-slate-400">{emptyHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
