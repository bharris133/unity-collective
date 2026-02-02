/**
 * Mock Payment Service
 * 
 * Simulates payment processing for development and testing.
 * No actual charges are made.
 */

import type {
  IPaymentService,
  PaymentIntent,
  PaymentResult,
  CheckoutSession,
  OrderData,
} from './paymentService';

class MockPaymentService implements IPaymentService {
  private paymentIntents: Map<string, PaymentIntent> = new Map();
  private checkoutSessions: Map<string, CheckoutSession> = new Map();

  /**
   * Generate a mock payment intent ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a mock payment intent
   */
  async createPaymentIntent(orderData: OrderData): Promise<PaymentIntent> {
    console.log('💳 [Mock Payment] Creating payment intent for order:', orderData);

    const paymentIntent: PaymentIntent = {
      id: this.generateId('pi'),
      amount: orderData.total,
      currency: 'usd',
      status: 'pending',
      clientSecret: this.generateId('secret'),
      metadata: {
        orderId: this.generateId('order'),
        userId: orderData.userId || 'guest',
        email: orderData.email,
        itemCount: orderData.items.length,
      },
    };

    this.paymentIntents.set(paymentIntent.id, paymentIntent);

    console.log('✅ [Mock Payment] Payment intent created:', paymentIntent.id);
    return paymentIntent;
  }

  /**
   * Confirm a mock payment (always succeeds in mock mode)
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<PaymentResult> {
    console.log('💳 [Mock Payment] Confirming payment:', paymentIntentId);

    const paymentIntent = this.paymentIntents.get(paymentIntentId);

    if (!paymentIntent) {
      console.error('❌ [Mock Payment] Payment intent not found:', paymentIntentId);
      return {
        success: false,
        error: 'Payment intent not found',
        message: 'Invalid payment intent ID',
      };
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock payment always succeeds (you can add failure scenarios for testing)
    paymentIntent.status = 'succeeded';
    this.paymentIntents.set(paymentIntentId, paymentIntent);

    console.log('✅ [Mock Payment] Payment confirmed successfully');

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      orderId: paymentIntent.metadata?.orderId,
      message: 'Mock payment processed successfully',
    };
  }

  /**
   * Cancel a mock payment intent
   */
  async cancelPayment(paymentIntentId: string): Promise<boolean> {
    console.log('💳 [Mock Payment] Canceling payment:', paymentIntentId);

    const paymentIntent = this.paymentIntents.get(paymentIntentId);

    if (!paymentIntent) {
      console.error('❌ [Mock Payment] Payment intent not found:', paymentIntentId);
      return false;
    }

    paymentIntent.status = 'canceled';
    this.paymentIntents.set(paymentIntentId, paymentIntent);

    console.log('✅ [Mock Payment] Payment canceled');
    return true;
  }

  /**
   * Get mock payment intent status
   */
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    console.log('💳 [Mock Payment] Getting payment status:', paymentIntentId);

    const paymentIntent = this.paymentIntents.get(paymentIntentId);

    if (!paymentIntent) {
      throw new Error('Payment intent not found');
    }

    return paymentIntent;
  }

  /**
   * Create a mock checkout session
   */
  async createCheckoutSession(orderData: OrderData): Promise<CheckoutSession> {
    console.log('💳 [Mock Payment] Creating checkout session for order:', orderData);

    const paymentIntent = await this.createPaymentIntent(orderData);

    const session: CheckoutSession = {
      id: this.generateId('cs'),
      paymentIntentId: paymentIntent.id,
      amount: orderData.total,
      currency: 'usd',
      status: 'open',
      url: `/checkout/mock/${this.generateId('session')}`,
    };

    this.checkoutSessions.set(session.id, session);

    console.log('✅ [Mock Payment] Checkout session created:', session.id);
    return session;
  }

  /**
   * Get mock checkout session
   */
  async getCheckoutSession(sessionId: string): Promise<CheckoutSession> {
    console.log('💳 [Mock Payment] Getting checkout session:', sessionId);

    const session = this.checkoutSessions.get(sessionId);

    if (!session) {
      throw new Error('Checkout session not found');
    }

    return session;
  }
}

// Export singleton instance
export const mockPaymentService = new MockPaymentService();
