import { type Timestamp } from 'firebase/firestore';

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // in cents
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  orderId: string;
  userId: string;
  vendorId: string;
  items: OrderItem[];
  subtotal: number; // in cents
  tax: number; // in cents
  shipping: number; // in cents
  platformFee: number; // in cents
  total: number; // in cents
  status: OrderStatus;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  shippingAddress: ShippingAddress;
  createdAt: Timestamp | string;
  paidAt?: Timestamp | string;
  shippedAt?: Timestamp | string;
  deliveredAt?: Timestamp | string;
  cancelledAt?: Timestamp | string;
}

export interface CreateOrderData {
  userId: string;
  vendorId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  platformFee: number;
  total: number;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  shippingAddress: ShippingAddress;
}

export interface UpdateOrderData extends Partial<Omit<Order, 'orderId' | 'userId' | 'createdAt'>> {
  // Partial update fields
}
