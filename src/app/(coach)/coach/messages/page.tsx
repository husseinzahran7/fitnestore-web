import MessageThread from "@/components/message-thread";
import type { Conversation } from "@/data/mockConversations";
import { getConversations, sendMessage } from "@/lib/messaging";

// Preview roster mapped from legacy coach dummy threads (string timestamps
// normalized; realtime + exact history land with Supabase).
const ago = (h: number) => new Date(Date.now() - h * 3_600_000);

const coachConversations: Conversation[] = [
  {
    id: "1",
    participantId: "client-1",
    participantName: "John Doe",
    participantRole: "user",
    lastMessage: "Thank you for the workout plan!",
    lastMessageTime: ago(0.5),
    unreadCount: 1,
    messages: [
      { id: "1-1", senderId: "client-1", senderName: "John Doe", senderRole: "user", content: "Hi, I have a question about my diet plan", timestamp: ago(2), isRead: true },
      { id: "1-2", senderId: "me", senderName: "You", senderRole: "coach", content: "Sure, what would you like to know?", timestamp: ago(1.5), isRead: true },
      { id: "1-3", senderId: "client-1", senderName: "John Doe", senderRole: "user", content: "Thank you for the workout plan!", timestamp: ago(0.5), isRead: false },
    ],
  },
  {
    id: "2",
    participantId: "client-2",
    participantName: "Emily Johnson",
    participantRole: "user",
    lastMessage: "I completed today's workout",
    lastMessageTime: ago(26),
    unreadCount: 0,
    messages: [
      { id: "2-1", senderId: "me", senderName: "You", senderRole: "coach", content: "How are you feeling after yesterday's session?", timestamp: ago(27), isRead: true },
      { id: "2-2", senderId: "client-2", senderName: "Emily Johnson", senderRole: "user", content: "A bit sore but good!", timestamp: ago(26.5), isRead: true },
      { id: "2-3", senderId: "client-2", senderName: "Emily Johnson", senderRole: "user", content: "I completed today's workout", timestamp: ago(26), isRead: true },
    ],
  },
  {
    id: "3",
    participantId: "client-3",
    participantName: "Michael Smith",
    participantRole: "user",
    lastMessage: "Can we reschedule tomorrow's session?",
    lastMessageTime: ago(50),
    unreadCount: 0,
    messages: [
      { id: "3-1", senderId: "me", senderName: "You", senderRole: "coach", content: "How's your progress with the new routine?", timestamp: ago(52), isRead: true },
      { id: "3-2", senderId: "client-3", senderName: "Michael Smith", senderRole: "user", content: "It's challenging but I'm managing", timestamp: ago(51), isRead: true },
      { id: "3-3", senderId: "client-3", senderName: "Michael Smith", senderRole: "user", content: "Can we reschedule tomorrow's session?", timestamp: ago(50), isRead: true },
    ],
  },
];

export default async function CoachMessagesPage() {
  // Preview roster until live threads exist; live query needs at least
  // one conversation row for the viewer (empty inbox falls back cleanly).
  const { conversations: liveConversations, live } =
    await getConversations("coach");
  const conversations = live ? liveConversations : coachConversations;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-slate-400">
        Conversations with your clients.
        {!live && " • preview data (live chat activates with your first client thread)"}
      </p>
      <div className="mt-6">
        <MessageThread
          me="coach"
          conversations={conversations}
          emptyHint="No client conversations yet."
          onSend={live ? sendMessage : undefined}
        />
      </div>
    </div>
  );
}
