import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { mockOffers, type Offer } from '../data';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Offer Service
 * 
 * Provides a unified interface for managing community offers.
 * Automatically switches between mock data and Firebase based on environment variable.
 */

export const offerService = {
  /**
   * Get all offers
   */
  async getAll(): Promise<Offer[]> {
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for offers');
      return Promise.resolve(mockOffers);
    }

    console.log('🔥 Fetching offers from Firebase');
    try {
      const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Offer));
    } catch (error) {
      console.error('Error fetching offers from Firebase:', error);
      console.log('⚠️ Falling back to mock data');
      return mockOffers;
    }
  },

  /**
   * Get a single offer by ID
   */
  async getById(id: string): Promise<Offer | null> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for offer ${id}`);
      return Promise.resolve(mockOffers.find(o => o.id === id) || null);
    }

    console.log(`🔥 Fetching offer ${id} from Firebase`);
    try {
      const docRef = doc(db, 'offers', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Offer;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching offer ${id} from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockOffers.find(o => o.id === id) || null;
    }
  },

  /**
   * Get offers by status
   */
  async getByStatus(status: 'open' | 'in-progress' | 'completed'): Promise<Offer[]> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for ${status} offers`);
      return Promise.resolve(mockOffers.filter(o => o.status === status));
    }

    console.log(`🔥 Fetching ${status} offers from Firebase`);
    try {
      const q = query(
        collection(db, 'offers'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Offer));
    } catch (error) {
      console.error(`Error fetching ${status} offers from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockOffers.filter(o => o.status === status);
    }
  },

  /**
   * Create a new offer (only works with Firebase)
   */
  async create(offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (USE_MOCK_DATA) {
      console.warn('⚠️ Cannot create offers in mock data mode');
      throw new Error('Creating offers requires Firebase connection. Set VITE_USE_MOCK_DATA=false');
    }

    console.log('🔥 Creating offer in Firebase');
    const docRef = await addDoc(collection(db, 'offers'), {
      ...offerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }
};
