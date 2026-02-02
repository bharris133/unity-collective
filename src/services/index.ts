/**
 * Services Index
 * 
 * Central export point for all services.
 * Automatically switches between mock and real implementations based on environment.
 */

import { mockPaymentService } from './mockPaymentService';
import { stripePaymentService } from './stripePaymentService';
import type { IPaymentService } from './paymentService';

// Determine which payment service to use based on environment
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Payment Service
 * 
 * Automatically uses mock or Stripe based on VITE_USE_MOCK_DATA environment variable.
 * - Mock mode: Simulates payments for development/testing
 * - Production mode: Uses real Stripe API
 */
export const paymentService: IPaymentService = USE_MOCK_DATA
  ? mockPaymentService
  : stripePaymentService;

// Log which payment service is being used
if (USE_MOCK_DATA) {
  console.log('💳 Using MOCK payment service (no real charges)');
} else {
  console.log('💳 Using STRIPE payment service (real charges)');
}

// Export all other services
export * from './businessService';
export * from './productService';
export * from './offerService';
export * from './eventService';
export * from './messageService';

// Export payment service types
export type { IPaymentService, PaymentIntent, PaymentResult, CheckoutSession, OrderData } from './paymentService';
