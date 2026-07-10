import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { type Order, type CreateOrderData, type OrderStatus } from '../types/Order';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
  async createOrder(data: CreateOrderData): Promise<string> {
    const ref = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...data,
      status: 'paid' as OrderStatus,
      createdAt: serverTimestamp(),
      paidAt: serverTimestamp(),
    });
    return ref.id;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
    if (!snap.exists()) return null;
    return { orderId: snap.id, ...snap.data() } as Order;
  },

  async getOrdersByBuyer(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ orderId: d.id, ...d.data() } as Order));
  },

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('vendorId', '==', vendorId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ orderId: d.id, ...d.data() } as Order));
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const updates: Record<string, unknown> = { status };
    if (status === 'shipped') updates.shippedAt = serverTimestamp();
    if (status === 'delivered') updates.deliveredAt = serverTimestamp();
    if (status === 'cancelled') updates.cancelledAt = serverTimestamp();
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), updates);
  },
};
