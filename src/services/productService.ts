import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { mockProducts, type Product } from '../data';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Product Service
 *
 * Provides a unified interface for reading and writing product data.
 * Automatically switches between mock data and Firestore based on
 * the VITE_USE_MOCK_DATA environment variable.
 */

export const productService = {
  // ─── Read operations ──────────────────────────────────────────────────────

  /** Get all products */
  async getAll(): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for products');
      return Promise.resolve(mockProducts);
    }

    console.log('🔥 Fetching products from Firestore');
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (error) {
      console.error('Error fetching products from Firestore:', error);
      console.warn('⚠️ Falling back to mock data');
      return mockProducts;
    }
  },

  /** Get a single product by ID */
  async getById(id: string): Promise<Product | null> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockProducts.find(p => p.id === id) || null);
    }

    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return mockProducts.find(p => p.id === id) || null;
    }
  },

  /** Get products by business ID */
  async getByBusinessId(businessId: string): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockProducts.filter(p => p.businessId === businessId));
    }

    try {
      const q = query(collection(db, 'products'), where('businessId', '==', businessId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (error) {
      console.error(`Error fetching products for business ${businessId}:`, error);
      return mockProducts.filter(p => p.businessId === businessId);
    }
  },

  /** Get products by category */
  async getByCategory(category: string): Promise<Product[]> {
    const allProducts = await this.getAll();
    return allProducts.filter(p => p.category === category);
  },

  // ─── Write operations ─────────────────────────────────────────────────────

  /**
   * Create a new product.
   * If the product already has an `id`, it is used as the Firestore document ID;
   * otherwise Firestore auto-generates one.
   * Returns the saved product (with the resolved id).
   */
  async create(product: Product): Promise<Product> {
    if (USE_MOCK_DATA) {
      // In mock mode just return the product as-is (in-memory only)
      return Promise.resolve(product);
    }

    try {
      const { id, ...data } = product;
      if (id) {
        await setDoc(doc(db, 'products', id), data);
        return product;
      } else {
        const docRef = await addDoc(collection(db, 'products'), data);
        return { ...product, id: docRef.id };
      }
    } catch (error) {
      console.error('Error creating product in Firestore:', error);
      throw error;
    }
  },

  /**
   * Update an existing product (partial update via merge).
   */
  async update(id: string, updates: Partial<Product>): Promise<void> {
    if (USE_MOCK_DATA) {
      return Promise.resolve();
    }

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a product by ID.
   */
  async delete(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      return Promise.resolve();
    }

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};
