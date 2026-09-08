import MessageThread from "@/components/message-thread";
import { mockConversations } from "@/data/mockConversations";
import { getConversations, sendMessage } from "@/lib/messaging";

export default async function UserMessagesPage() {
  const { conversations, live } = await getConversations("user");

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-slate-400">
        Chat with your coaches.
        {!live && " • preview data (connect Supabase for live chat)"}
      </p>
      <div className="mt-6">
        <MessageThread
          me="user"
          conversations={live ? conversations : mockConversations}
          emptyHint="No conversations yet — your coach will reach out."
          onSend={live ? sendMessage : undefined}
        />
      </div>
    </div>
  );
}
