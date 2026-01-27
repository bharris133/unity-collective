export interface MessageThread {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  relatedOfferId?: string;
  relatedOfferTitle?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export const mockThreads: MessageThread[] = [
  {
    id: '1',
    participants: ['user1', 'user2'],
    participantNames: ['John Smith', 'Sarah Johnson'],
    lastMessage: 'That sounds great! When can we start?',
    lastMessageTime: new Date('2025-01-25T14:30:00'),
    unreadCount: 2,
    relatedOfferId: '1',
    relatedOfferTitle: 'Looking for Web Development Services',
  },
  {
    id: '2',
    participants: ['user1', 'user3'],
    participantNames: ['John Smith', 'Marcus Williams'],
    lastMessage: 'I can help with that. Let me send you my portfolio.',
    lastMessageTime: new Date('2025-01-24T10:15:00'),
    unreadCount: 0,
    relatedOfferId: '3',
    relatedOfferTitle: 'Need Logo Design',
  },
  {
    id: '3',
    participants: ['user1', 'user4'],
    participantNames: ['John Smith', 'Lisa Brown'],
    lastMessage: 'Thanks for your interest! Here are the details...',
    lastMessageTime: new Date('2025-01-23T16:45:00'),
    unreadCount: 1,
    relatedOfferId: '2',
    relatedOfferTitle: 'Offering Catering Services',
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      threadId: '1',
      senderId: 'user2',
      senderName: 'Sarah Johnson',
      content: 'Hi! I saw your offer for web development. I can help with that.',
      timestamp: new Date('2025-01-25T14:00:00'),
      read: true,
    },
    {
      id: 'm2',
      threadId: '1',
      senderId: 'user1',
      senderName: 'John Smith',
      content: 'Great! What kind of projects have you worked on?',
      timestamp: new Date('2025-01-25T14:15:00'),
      read: true,
    },
    {
      id: 'm3',
      threadId: '1',
      senderId: 'user2',
      senderName: 'Sarah Johnson',
      content: 'I specialize in React and Node.js. I can show you my portfolio.',
      timestamp: new Date('2025-01-25T14:20:00'),
      read: true,
    },
    {
      id: 'm4',
      threadId: '1',
      senderId: 'user1',
      senderName: 'John Smith',
      content: 'That sounds great! When can we start?',
      timestamp: new Date('2025-01-25T14:30:00'),
      read: false,
    },
  ],
  '2': [
    {
      id: 'm5',
      threadId: '2',
      senderId: 'user3',
      senderName: 'Marcus Williams',
      content: 'Hey! I saw you need a logo. I\'m a graphic designer.',
      timestamp: new Date('2025-01-24T10:00:00'),
      read: true,
    },
    {
      id: 'm6',
      threadId: '2',
      senderId: 'user1',
      senderName: 'John Smith',
      content: 'Perfect! Can you send me some examples of your work?',
      timestamp: new Date('2025-01-24T10:10:00'),
      read: true,
    },
    {
      id: 'm7',
      threadId: '2',
      senderId: 'user3',
      senderName: 'Marcus Williams',
      content: 'I can help with that. Let me send you my portfolio.',
      timestamp: new Date('2025-01-24T10:15:00'),
      read: true,
    },
  ],
  '3': [
    {
      id: 'm8',
      threadId: '3',
      senderId: 'user4',
      senderName: 'Lisa Brown',
      content: 'Hi! I\'m interested in your catering services for an upcoming event.',
      timestamp: new Date('2025-01-23T16:30:00'),
      read: true,
    },
    {
      id: 'm9',
      threadId: '3',
      senderId: 'user1',
      senderName: 'John Smith',
      content: 'Thanks for your interest! Here are the details...',
      timestamp: new Date('2025-01-23T16:45:00'),
      read: false,
    },
  ],
};
