import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { mockProducts, type Product } from '../data';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Product Service
 * 
 * Provides a unified interface for fetching product data.
 * Automatically switches between mock data and Firebase based on environment variable.
 */

export const productService = {
  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for products');
      return Promise.resolve(mockProducts);
    }

    console.log('🔥 Fetching products from Firebase');
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Error fetching products from Firebase:', error);
      console.log('⚠️ Falling back to mock data');
      return mockProducts;
    }
  },

  /**
   * Get a single product by ID
   */
  async getById(id: string): Promise<Product | null> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for product ${id}`);
      return Promise.resolve(mockProducts.find(p => p.id === id) || null);
    }

    console.log(`🔥 Fetching product ${id} from Firebase`);
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Product;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product ${id} from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockProducts.find(p => p.id === id) || null;
    }
  },

  /**
   * Get products by business ID
   */
  async getByBusinessId(businessId: string): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for products from business ${businessId}`);
      return Promise.resolve(mockProducts.filter(p => p.businessId === businessId));
    }

    console.log(`🔥 Fetching products for business ${businessId} from Firebase`);
    try {
      const q = query(collection(db, 'products'), where('businessId', '==', businessId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error(`Error fetching products for business ${businessId}:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockProducts.filter(p => p.businessId === businessId);
    }
  },

  /**
   * Get products by category
   */
  async getByCategory(category: string): Promise<Product[]> {
    const allProducts = await this.getAll();
    return allProducts.filter(p => p.category === category);
  }
};
