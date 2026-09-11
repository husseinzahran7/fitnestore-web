import MessageThread from "@/components/message-thread";
import ConsultInbox from "@/components/consult-inbox";
import { getConversations, sendMessage } from "@/lib/messaging";
import { getConsultRequests } from "@/lib/coaches";
import { getDict } from "@/lib/i18n";

export default async function CoachMessagesPage() {
  // Empty inbox until live threads exist; live query needs at least
  // one conversation row for the viewer.
  const [{ conversations: liveConversations, live }, t] =
    await Promise.all([getConversations("coach"), getDict()]);
  const conversations = liveConversations;
  const requests = await getConsultRequests();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.messagesTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.messagesDesc}
      </p>
      <div className="mt-6">
        <ConsultInbox requests={requests} t={t} />
        <MessageThread
          me="coach"
          conversations={conversations}
          emptyHint={t.coach.noClientConv}
          onSend={live ? sendMessage : undefined}
          t={t}
        />
      </div>
    </div>
  );
}
