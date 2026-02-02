/**
 * Payment Service Interface
 * 
 * Provides a unified interface for payment processing.
 * Automatically switches between mock and Stripe based on environment variable.
 */

export interface PaymentIntent {
  id: string;
  amount: number; // in cents
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  clientSecret?: string;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'mock';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface CheckoutSession {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'open' | 'complete' | 'expired';
  url?: string;
}

export interface OrderData {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number; // in cents
  }>;
  subtotal: number; // in cents
  tax: number; // in cents
  shipping: number; // in cents
  total: number; // in cents
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
  phone?: string;
  userId?: string; // Optional for guest checkout
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  orderId?: string;
  error?: string;
  message?: string;
}

/**
 * Payment Service Interface
 * Implementations: mockPaymentService.ts, stripePaymentService.ts
 */
export interface IPaymentService {
  /**
   * Create a payment intent for the order
   */
  createPaymentIntent(orderData: OrderData): Promise<PaymentIntent>;

  /**
   * Confirm a payment intent
   */
  confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentResult>;

  /**
   * Cancel a payment intent
   */
  cancelPayment(paymentIntentId: string): Promise<boolean>;

  /**
   * Get payment intent status
   */
  getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent>;

  /**
   * Create a checkout session (for hosted checkout page)
   */
  createCheckoutSession(orderData: OrderData): Promise<CheckoutSession>;

  /**
   * Retrieve checkout session
   */
  getCheckoutSession(sessionId: string): Promise<CheckoutSession>;
}
