import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { mockOffers, type CommunityPost } from '../data';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const offerService = {
  async getAll(): Promise<CommunityPost[]> {
    if (USE_MOCK_DATA) return Promise.resolve(mockOffers);
    try {
      const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
        updatedAt: d.data().updatedAt?.toDate(),
      } as CommunityPost));
    } catch {
      return mockOffers;
    }
  },

  async getById(id: string): Promise<CommunityPost | null> {
    if (USE_MOCK_DATA) return Promise.resolve(mockOffers.find(o => o.id === id) ?? null);
    try {
      const snap = await getDoc(doc(db, 'offers', id));
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...snap.data(),
        createdAt: snap.data().createdAt?.toDate(),
        updatedAt: snap.data().updatedAt?.toDate(),
      } as CommunityPost;
    } catch {
      return mockOffers.find(o => o.id === id) ?? null;
    }
  },

  async getByStatus(status: CommunityPost['status']): Promise<CommunityPost[]> {
    if (USE_MOCK_DATA) return Promise.resolve(mockOffers.filter(o => o.status === status));
    try {
      const q = query(collection(db, 'offers'), where('status', '==', status), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
        updatedAt: d.data().updatedAt?.toDate(),
      } as CommunityPost));
    } catch {
      return mockOffers.filter(o => o.status === status);
    }
  },

  async create(data: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (USE_MOCK_DATA) throw new Error('Creating offers requires Firebase. Set VITE_USE_MOCK_DATA=false');
    const ref = await addDoc(collection(db, 'offers'), { ...data, createdAt: new Date(), updatedAt: new Date() });
    return ref.id;
  },

  async updateStatus(id: string, status: CommunityPost['status']): Promise<void> {
    if (USE_MOCK_DATA) return;
    await updateDoc(doc(db, 'offers', id), { status, updatedAt: new Date() });
  },
};
