import { collection, getDocs, doc, getDoc, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { mockThreads, mockMessages, type MessageThread, type Message } from '../data/mockMessages';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Message Service
 * 
 * Provides a unified interface for fetching and managing private messages.
 * Automatically switches between mock data and Firebase based on environment variable.
 */

export const messageService = {
  /**
   * Get all message threads for the current user
   */
  async getAllThreads(): Promise<MessageThread[]> {
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for message threads');
      return Promise.resolve(mockThreads);
    }

    console.log('🔥 Fetching message threads from Firebase');
    try {
      const querySnapshot = await getDocs(collection(db, 'messageThreads'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastMessageTime: doc.data().lastMessageTime?.toDate(),
      } as MessageThread));
    } catch (error) {
      console.error('Error fetching message threads from Firebase:', error);
      console.log('⚠️ Falling back to mock data');
      return mockThreads;
    }
  },

  /**
   * Get a single thread by ID
   */
  async getThreadById(threadId: string): Promise<MessageThread | null> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for thread ${threadId}`);
      return Promise.resolve(mockThreads.find(t => t.id === threadId) || null);
    }

    console.log(`🔥 Fetching thread ${threadId} from Firebase`);
    try {
      const docRef = doc(db, 'messageThreads', threadId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          lastMessageTime: docSnap.data().lastMessageTime?.toDate(),
        } as MessageThread;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching thread ${threadId} from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockThreads.find(t => t.id === threadId) || null;
    }
  },

  /**
   * Get all messages in a thread
   */
  async getMessagesByThreadId(threadId: string): Promise<Message[]> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for messages in thread ${threadId}`);
      return Promise.resolve(mockMessages[threadId] || []);
    }

    console.log(`🔥 Fetching messages for thread ${threadId} from Firebase`);
    try {
      const q = query(
        collection(db, 'messages'),
        where('threadId', '==', threadId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      } as Message));
    } catch (error) {
      console.error(`Error fetching messages for thread ${threadId} from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockMessages[threadId] || [];
    }
  },

  /**
   * Get total unread message count
   */
  async getUnreadCount(): Promise<number> {
    const threads = await this.getAllThreads();
    return threads.reduce((total, thread) => total + thread.unreadCount, 0);
  },

  /**
   * Send a new message in a thread
   */
  async sendMessage(threadId: string, senderId: string, senderName: string, content: string): Promise<Message | null> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Mock: Sending message to thread ${threadId}`);
      const newMessage: Message = {
        id: `m${Date.now()}`,
        threadId,
        senderId,
        senderName,
        content,
        timestamp: new Date(),
        read: false,
      };
      
      // In mock mode, we just return the message without actually storing it
      return Promise.resolve(newMessage);
    }

    console.log(`🔥 Sending message to thread ${threadId} in Firebase`);
    try {
      const messageData = {
        threadId,
        senderId,
        senderName,
        content,
        timestamp: new Date(),
        read: false,
      };
      
      const docRef = await addDoc(collection(db, 'messages'), messageData);
      
      // Update thread's last message
      const threadRef = doc(db, 'messageThreads', threadId);
      await updateDoc(threadRef, {
        lastMessage: content,
        lastMessageTime: new Date(),
      });
      
      return {
        id: docRef.id,
        ...messageData,
      };
    } catch (error) {
      console.error('Error sending message to Firebase:', error);
      return null;
    }
  },

  /**
   * Mark a thread as read
   */
  async markThreadAsRead(threadId: string): Promise<boolean> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Mock: Marking thread ${threadId} as read`);
      return Promise.resolve(true);
    }

    console.log(`🔥 Marking thread ${threadId} as read in Firebase`);
    try {
      const threadRef = doc(db, 'messageThreads', threadId);
      await updateDoc(threadRef, {
        unreadCount: 0,
      });
      return true;
    } catch (error) {
      console.error(`Error marking thread ${threadId} as read:`, error);
      return false;
    }
  }
};
