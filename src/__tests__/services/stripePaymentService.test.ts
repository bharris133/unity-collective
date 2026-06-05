import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { OrderData } from '../../services/paymentService';

// Mock Firebase Functions
vi.mock('../../firebase', () => ({
  functions: {},
}));

vi.mock('firebase/functions', () => ({
  httpsCallable: vi.fn(),
}));

// Mock mockPaymentService
vi.mock('../../services/mockPaymentService', () => ({
  mockPaymentService: {
    createCheckoutSession: vi.fn(),
    getCheckoutSession: vi.fn(),
    createPaymentIntent: vi.fn(),
    confirmPayment: vi.fn(),
    cancelPayment: vi.fn(),
    getPaymentStatus: vi.fn(),
  },
}));

const sampleOrder: OrderData = {
  items: [{ productId: 'p1', productName: 'Widget', quantity: 2, price: 1000 }],
  subtotal: 2000,
  tax: 200,
  shipping: 500,
  total: 2700,
  email: 'buyer@example.com',
};

describe('stripePaymentService (mock mode)', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('VITE_USE_MOCK_DATA', 'true');
  });

  it('delegates createCheckoutSession to mockPaymentService', async () => {
    const { mockPaymentService } = await import('../../services/mockPaymentService');
    vi.mocked(mockPaymentService.createCheckoutSession).mockResolvedValue({
      id: 'sess_mock', paymentIntentId: 'pi_mock', amount: 2700, currency: 'usd', status: 'open', url: '/checkout',
    });

    const { stripePaymentService } = await import('../../services/stripePaymentService');
    const result = await stripePaymentService.createCheckoutSession(sampleOrder);

    expect(mockPaymentService.createCheckoutSession).toHaveBeenCalledWith(sampleOrder);
    expect(result.id).toBe('sess_mock');
  });

  it('delegates createPaymentIntent to mockPaymentService', async () => {
    const { mockPaymentService } = await import('../../services/mockPaymentService');
    vi.mocked(mockPaymentService.createPaymentIntent).mockResolvedValue({
      id: 'pi_mock', amount: 2700, currency: 'usd', status: 'pending',
    });

    const { stripePaymentService } = await import('../../services/stripePaymentService');
    const result = await stripePaymentService.createPaymentIntent(sampleOrder);

    expect(mockPaymentService.createPaymentIntent).toHaveBeenCalledWith(sampleOrder);
    expect(result.id).toBe('pi_mock');
  });

  it('delegates confirmPayment to mockPaymentService', async () => {
    const { mockPaymentService } = await import('../../services/mockPaymentService');
    vi.mocked(mockPaymentService.confirmPayment).mockResolvedValue({ success: true, paymentIntentId: 'pi_mock' });

    const { stripePaymentService } = await import('../../services/stripePaymentService');
    const result = await stripePaymentService.confirmPayment('pi_mock', 'pm_mock');

    expect(mockPaymentService.confirmPayment).toHaveBeenCalledWith('pi_mock', 'pm_mock');
    expect(result.success).toBe(true);
  });

  it('delegates cancelPayment to mockPaymentService', async () => {
    const { mockPaymentService } = await import('../../services/mockPaymentService');
    vi.mocked(mockPaymentService.cancelPayment).mockResolvedValue(true);

    const { stripePaymentService } = await import('../../services/stripePaymentService');
    const result = await stripePaymentService.cancelPayment('pi_mock');

    expect(mockPaymentService.cancelPayment).toHaveBeenCalledWith('pi_mock');
    expect(result).toBe(true);
  });

  it('delegates getPaymentStatus to mockPaymentService', async () => {
    const { mockPaymentService } = await import('../../services/mockPaymentService');
    vi.mocked(mockPaymentService.getPaymentStatus).mockResolvedValue({
      id: 'pi_mock', amount: 2700, currency: 'usd', status: 'succeeded',
    });

    const { stripePaymentService } = await import('../../services/stripePaymentService');
    const result = await stripePaymentService.getPaymentStatus('pi_mock');

    expect(mockPaymentService.getPaymentStatus).toHaveBeenCalledWith('pi_mock');
    expect(result.status).toBe('succeeded');
  });
});

describe('stripePaymentService (live mode)', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false');
  });

  it('calls Cloud Function for createCheckoutSession', async () => {
    const { httpsCallable } = await import('firebase/functions');
    const mockFn = vi.fn().mockResolvedValue({ data: { sessionId: 'sess_live', url: 'https://checkout.stripe.com/pay/sess_live' } });
    vi.mocked(httpsCallable).mockReturnValue(mockFn);

    const { stripePaymentService } = await import('../../services/stripePaymentService');
    const result = await stripePaymentService.createCheckoutSession(sampleOrder);

    expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'createCheckoutSession');
    expect(result.id).toBe('sess_live');
    expect(result.url).toBe('https://checkout.stripe.com/pay/sess_live');
  });

  it('calls Cloud Function for createPaymentIntent', async () => {
    const { httpsCallable } = await import('firebase/functions');
    const mockFn = vi.fn().mockResolvedValue({ data: { id: 'pi_live', amount: 2700, currency: 'usd', status: 'pending' } });
    vi.mocked(httpsCallable).mockReturnValue(mockFn);

    const { stripePaymentService } = await import('../../services/stripePaymentService');
    const result = await stripePaymentService.createPaymentIntent(sampleOrder);

    expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'createPaymentIntent');
    expect(result.id).toBe('pi_live');
  });
});
