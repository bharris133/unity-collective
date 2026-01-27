import { Timestamp } from 'firebase/firestore';

export interface VendorContact {
  email: string;
  phone: string;
  website: string;
}

export interface VendorSocialMedia {
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface Vendor {
  vendorId: string;
  ownerId: string; // links to users/{uid}
  businessName: string;
  description: string;
  category: string;
  location: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  logo: string; // Storage URL
  banner: string; // Storage URL
  contact: VendorContact;
  socialMedia: VendorSocialMedia;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface CreateVendorData {
  ownerId: string;
  businessName: string;
  description: string;
  category: string;
  location: string;
  contact: VendorContact;
  socialMedia?: VendorSocialMedia;
  logo?: string;
  banner?: string;
}

export interface UpdateVendorData extends Partial<Omit<Vendor, 'vendorId' | 'ownerId' | 'createdAt'>> {
  // Partial update fields
}

export const VENDOR_CATEGORIES = [
  'Food & Beverage',
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Technology',
  'Professional Services',
  'Arts & Crafts',
  'Home & Garden',
  'Health & Wellness',
  'Education & Training',
  'Entertainment',
  'Other'
] as const;

export type VendorCategory = typeof VENDOR_CATEGORIES[number];
