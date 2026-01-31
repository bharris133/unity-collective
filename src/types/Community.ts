import { type Timestamp } from 'firebase/firestore';

// Offers / Barter System
export type OfferType = 'barter' | 'discount_request' | 'trade';
export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'completed';

export interface Offer {
  offerId: string;
  fromUserId: string;
  toUserId: string;
  productId: string; // what they want
  offerType: OfferType;
  offerDetails: string;
  offerAmount?: number; // if discount request
  tradeProductId?: string; // if barter/trade
  status: OfferStatus;
  createdAt: Timestamp | string;
  expiresAt: Timestamp | string;
  respondedAt?: Timestamp | string;
  completedAt?: Timestamp | string;
}

export interface CreateOfferData {
  fromUserId: string;
  toUserId: string;
  productId: string;
  offerType: OfferType;
  offerDetails: string;
  offerAmount?: number;
  tradeProductId?: string;
  expiresAt: Timestamp | string;
}

// Messaging System
export interface MessageThread {
  threadId: string;
  participants: string[]; // [userId1, userId2]
  subject: string;
  lastMessageAt: Timestamp | string;
  lastMessage?: string;
  unreadCount?: Record<string, number>; // { userId: count }
  createdAt: Timestamp | string;
}

export interface Message {
  messageId: string;
  threadId: string;
  senderId: string;
  text: string;
  attachments: string[]; // Storage URLs
  createdAt: Timestamp | string;
  read: boolean;
  readAt?: Timestamp | string;
}

export interface CreateMessageData {
  threadId: string;
  senderId: string;
  text: string;
  attachments?: string[];
}

export interface CreateThreadData {
  participants: string[];
  subject: string;
  initialMessage: string;
}
