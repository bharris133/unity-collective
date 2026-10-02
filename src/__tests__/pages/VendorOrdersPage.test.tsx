import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VendorOrdersPage from '../../pages/VendorOrdersPage';

const orderServiceMocks = vi.hoisted(() => ({
  getOrdersByVendor: vi.fn(),
  updateOrderStatus: vi.fn(),
}));
const authMock = vi.hoisted(() => ({
  currentUser: { uid: 'test-vendor-uid' },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => authMock,
}));

vi.mock('../../services/orderService', () => ({
  orderService: {
    getOrdersByVendor: orderServiceMocks.getOrdersByVendor,
    updateOrderStatus: orderServiceMocks.updateOrderStatus,
  },
}));

vi.mock('../../components/EmailActivitySection', () => ({
  default: () => null,
}));

describe('VendorOrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <MemoryRouter>
      <VendorOrdersPage />
    </MemoryRouter>
  );

  it('renders orders returned for the signed-in vendor', async () => {
    orderServiceMocks.getOrdersByVendor.mockResolvedValueOnce([
      {
        orderId: 'qa_order_paid_001',
        userId: 'qa_buyer_001',
        vendorId: 'test-vendor-uid',
        items: [{ productId: 'qa_product_001', name: 'QA Coffee Sampler', quantity: 1, price: 1899 }],
        subtotal: 1899,
        tax: 152,
        shipping: 0,
        platformFee: 0,
        total: 2051,
        status: 'paid',
        stripeSessionId: 'qa_placeholder',
        stripePaymentIntentId: 'qa_placeholder',
        shippingAddress: {
          fullName: 'QA Buyer', addressLine1: '100 QA Way', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'US', phone: '555-0101',
        },
        createdAt: '2026-10-01T00:00:00Z',
      },
    ]);

    renderPage();

    expect(await screen.findByText('QA Coffee Sampler × 1')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('shows a recoverable error instead of a false empty state when the query fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    orderServiceMocks.getOrdersByVendor.mockRejectedValueOnce(new Error('Missing or insufficient permissions.'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('We could not load your store orders. Please try again.')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.queryByText('No orders yet')).not.toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
