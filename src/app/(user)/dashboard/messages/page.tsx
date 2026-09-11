import MessageThread from "@/components/message-thread";
import { getConversations, sendMessage } from "@/lib/messaging";
import { getDict } from "@/lib/i18n";

export default async function UserMessagesPage() {
  const [{ conversations, live }, t] = await Promise.all([
    getConversations("user"),
    getDict(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.messages}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.pages.chatWithCoaches}
      </p>
      <div className="mt-6">
        <MessageThread
          me="user"
          conversations={conversations}
          emptyHint={t.pages.emptyThreads}
          onSend={live ? sendMessage : undefined}
          t={t}
        />
      </div>
    </div>
  );
}
