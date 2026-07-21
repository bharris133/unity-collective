import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface EmailLog {
  id: string;
  orderId: string;
  vendorId: string;
  type: 'buyer_confirmation' | 'vendor_notification';
  to: string;
  status: 'sent' | 'failed';
  error: string | null;
  timestamp: Timestamp | string | null;
}

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const emailLogService = {
  /** Get all email logs for a specific order */
  async getByOrderId(orderId: string): Promise<EmailLog[]> {
    if (USE_MOCK_DATA) return [];
    try {
      const q = query(
        collection(db, 'emailLogs'),
        where('orderId', '==', orderId),
        orderBy('timestamp', 'asc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailLog));
    } catch (err) {
      console.error('Error fetching email logs for order:', err);
      return [];
    }
  },

  /** Get all email logs for a vendor (most recent first, capped at 200) */
  async getByVendorId(vendorId: string): Promise<EmailLog[]> {
    if (USE_MOCK_DATA) return [];
    try {
      const q = query(
        collection(db, 'emailLogs'),
        where('vendorId', '==', vendorId),
        orderBy('timestamp', 'desc'),
        limit(200)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailLog));
    } catch (err) {
      console.error('Error fetching email logs for vendor:', err);
      return [];
    }
  },

  /** Get all email logs (admin view, most recent first, capped at 500) */
  async getAll(): Promise<EmailLog[]> {
    if (USE_MOCK_DATA) return [];
    try {
      const q = query(
        collection(db, 'emailLogs'),
        orderBy('timestamp', 'desc'),
        limit(500)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailLog));
    } catch (err) {
      console.error('Error fetching all email logs:', err);
      return [];
    }
  },
};
