// User-side messaging types + data (moved from components/dashboard/Messages.tsx).
// NOTE: coach MessagesPage uses a DIFFERENT Conversation/Message shape
// (string timestamps, clientName/avatar). Queued for Turn 2 / P0-3 unify.

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'coach';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'user' | 'coach';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantId: 'coach1',
    participantName: 'Coach Sarah',
    participantRole: 'coach',
    lastMessage: 'Looking forward to our session tomorrow!',
    lastMessageTime: new Date(),
    unreadCount: 2,
    messages: [
      {
        id: 'msg1',
        senderId: 'coach1',
        senderName: 'Coach Sarah',
        senderRole: 'coach',
        content: 'Hi there! How are you feeling after yesterday\'s workout?',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isRead: true,
      },
      {
        id: 'msg2',
        senderId: 'user1',
        senderName: 'You',
        senderRole: 'user',
        content: 'I\'m feeling great! The leg exercises were challenging but I managed to complete them all.',
        timestamp: new Date(Date.now() - 82800000), // 23 hours ago
        isRead: true,
      },
      {
        id: 'msg3',
        senderId: 'coach1',
        senderName: 'Coach Sarah',
        senderRole: 'coach',
        content: 'That\'s excellent progress! I\'ve updated your workout plan for next week with slightly higher weights.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: true,
      },
      {
        id: 'msg4',
        senderId: 'coach1',
        senderName: 'Coach Sarah',
        senderRole: 'coach',
        content: 'Looking forward to our session tomorrow!',
        timestamp: new Date(),
        isRead: false,
      },
    ],
  },
  {
    id: 'conv2',
    participantId: 'coach2',
    participantName: 'Coach Mike',
    participantRole: 'coach',
    lastMessage: 'Here\'s your nutrition plan for the week',
    lastMessageTime: new Date(Date.now() - 172800000), // 2 days ago
    unreadCount: 0,
    messages: [
      {
        id: 'msg5',
        senderId: 'coach2',
        senderName: 'Coach Mike',
        senderRole: 'coach',
        content: 'Hi! I\'ve been reviewing your nutrition logs.',
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        isRead: true,
      },
      {
        id: 'msg6',
        senderId: 'user1',
        senderName: 'You',
        senderRole: 'user',
        content: 'Great! Any suggestions for improvement?',
        timestamp: new Date(Date.now() - 172900000),
        isRead: true,
      },
      {
        id: 'msg7',
        senderId: 'coach2',
        senderName: 'Coach Mike',
        senderRole: 'coach',
        content: 'Here\'s your nutrition plan for the week',
        timestamp: new Date(Date.now() - 172800000),
        isRead: true,
      },
    ],
  },
];
