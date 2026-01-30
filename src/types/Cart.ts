import { Timestamp } from 'firebase/firestore';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number; // snapshot at add time (in cents)
  name?: string; // for display
  image?: string; // for display
  vendorId?: string; // for vendor association
}

export interface Cart {
  userId: string;
  items: CartItem[];
  vendorId: string; // single-vendor cart for MVP
  updatedAt: Timestamp | string;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string } // productId
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export interface CartCalculations {
  subtotal: number;
  tax: number;
  shipping: number;
  platformFee: number;
  total: number;
}
