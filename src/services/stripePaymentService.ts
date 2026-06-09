/**
 * Stripe Payment Service
 *
 * Calls Firebase Cloud Functions for all server-side Stripe operations.
 * The secret key never touches the frontend — all price calculations and
 * payment intent creation happen in functions/src/index.ts.
 *
 * Mock mode: delegates to mockPaymentService (VITE_USE_MOCK_DATA=true)
 * Live mode:  calls Cloud Functions + Stripe.js (VITE_USE_MOCK_DATA=false)
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { mockPaymentService } from './mockPaymentService';
import type {
  IPaymentService,
  PaymentIntent,
  PaymentResult,
  CheckoutSession,
  OrderData,
} from './paymentService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

class StripePaymentService implements IPaymentService {
  // ─── Checkout Session (primary flow) ────────────────────────────────────────

  async createCheckoutSession(orderData: OrderData): Promise<CheckoutSession> {
    if (USE_MOCK) return mockPaymentService.createCheckoutSession(orderData);

    console.log('💳 [Stripe] Creating checkout session via Cloud Function…');
    const fn = httpsCallable<{ cartItems: OrderData['items']; successUrl?: string; cancelUrl?: string }, { sessionId: string; url: string }>(
      functions,
      'createCheckoutSession'
    );
    const { data } = await fn({ cartItems: orderData.items });
    return {
      id: data.sessionId,
      paymentIntentId: '',
      amount: orderData.total,
      currency: 'usd',
      status: 'open',
      url: data.url,
    };
  }

  async getCheckoutSession(sessionId: string): Promise<CheckoutSession> {
    if (USE_MOCK) return mockPaymentService.getCheckoutSession(sessionId);

    console.log(`💳 [Stripe] Fetching checkout session ${sessionId}…`);
    const fn = httpsCallable<{ sessionId: string }, CheckoutSession>(functions, 'getCheckoutSession');
    const { data } = await fn({ sessionId });
    return data;
  }

  // ─── Payment Intent (card-element flow) ─────────────────────────────────────

  async createPaymentIntent(orderData: OrderData): Promise<PaymentIntent> {
    if (USE_MOCK) return mockPaymentService.createPaymentIntent(orderData);

    console.log('💳 [Stripe] Creating payment intent via Cloud Function…');
    const fn = httpsCallable<OrderData, PaymentIntent>(functions, 'createPaymentIntent');
    const { data } = await fn(orderData);
    return data;
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentResult> {
    if (USE_MOCK) return mockPaymentService.confirmPayment(paymentIntentId, paymentMethodId);

    console.log(`💳 [Stripe] Confirming payment ${paymentIntentId}…`);
    const fn = httpsCallable<{ paymentIntentId: string; paymentMethodId?: string }, PaymentResult>(
      functions,
      'confirmPayment'
    );
    const { data } = await fn({ paymentIntentId, paymentMethodId });
    return data;
  }

  async cancelPayment(paymentIntentId: string): Promise<boolean> {
    if (USE_MOCK) return mockPaymentService.cancelPayment(paymentIntentId);

    console.log(`💳 [Stripe] Canceling payment ${paymentIntentId}…`);
    const fn = httpsCallable<{ paymentIntentId: string }, { success: boolean }>(functions, 'cancelPayment');
    const { data } = await fn({ paymentIntentId });
    return data.success;
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    if (USE_MOCK) return mockPaymentService.getPaymentStatus(paymentIntentId);

    console.log(`💳 [Stripe] Getting status for ${paymentIntentId}…`);
    const fn = httpsCallable<{ paymentIntentId: string }, PaymentIntent>(functions, 'getPaymentStatus');
    const { data } = await fn({ paymentIntentId });
    return data;
  }
}

export const stripePaymentService = new StripePaymentService();
