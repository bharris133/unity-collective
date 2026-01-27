import { Timestamp } from 'firebase/firestore';

export interface Product {
  productId: string;
  vendorId: string; // links to vendors/{vendorId}
  name: string;
  description: string;
  price: number; // in cents
  category: string;
  images: string[]; // Storage URLs
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface CreateProductData {
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  inStock?: boolean;
  stockQuantity?: number;
  tags?: string[];
}

export interface UpdateProductData extends Partial<Omit<Product, 'productId' | 'vendorId' | 'createdAt'>> {
  // Partial update fields
}

export const PRODUCT_CATEGORIES = [
  'Apparel',
  'Food & Beverage',
  'Books & Education',
  'Digital Products',
  'Beauty & Personal Care',
  'Home & Garden',
  'Electronics',
  'Art & Collectibles',
  'Services',
  'Other'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
