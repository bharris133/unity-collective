import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { mockBusinesses, type Business } from '../data';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Business Service
 * 
 * Provides a unified interface for fetching business data.
 * Automatically switches between mock data and Firebase based on environment variable.
 */

export const businessService = {
  /**
   * Get all businesses
   */
  async getAll(): Promise<Business[]> {
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for businesses');
      return Promise.resolve(mockBusinesses);
    }

    console.log('🔥 Fetching businesses from Firebase');
    try {
      const querySnapshot = await getDocs(collection(db, 'businesses'));
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as Business));
    } catch (error) {
      console.error('Error fetching businesses from Firebase:', error);
      console.log('⚠️ Falling back to mock data');
      return mockBusinesses;
    }
  },

  /**
   * Get a single business by ID
   */
  async getById(id: number): Promise<Business | null> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for business ${id}`);
      return Promise.resolve(mockBusinesses.find(b => b.id === id) || null);
    }

    console.log(`🔥 Fetching business ${id} from Firebase`);
    try {
      const docRef = doc(db, 'businesses', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: parseInt(docSnap.id),
          ...docSnap.data()
        } as Business;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching business ${id} from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockBusinesses.find(b => b.id === id) || null;
    }
  },

  /**
   * Get businesses by category
   */
  async getByCategory(category: string): Promise<Business[]> {
    const allBusinesses = await this.getAll();
    return allBusinesses.filter(b => b.category === category);
  }
};
