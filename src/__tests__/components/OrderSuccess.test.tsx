import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrderSuccess from '../../components/OrderSuccess';

// Mock orderService
vi.mock('../../services/orderService', () => ({
  orderService: {
    getOrderById: vi.fn().mockResolvedValue(null),
  },
}));

// Mock useSearchParams
const mockUseSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => mockUseSearchParams(),
  };
});

describe('OrderSuccess Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

    it('should render success message with valid order ID', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('orderId=abc123def456789'),
    ]);
    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    });
    expect(screen.getByText(/Thank you for supporting Black-owned businesses/)).toBeInTheDocument();
  });

    it('should display order reference based on order ID', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('orderId=abc123def456789'),
    ]);
    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Order Reference')).toBeInTheDocument();
    });
    expect(screen.getByText(/UC-/)).toBeInTheDocument();
  });

    it('should show what happens next steps', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('orderId=abc123def456789'),
    ]);
    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("What's Next?")).toBeInTheDocument();
    });
    expect(screen.getByText('Vendor Notification')).toBeInTheDocument();
    expect(screen.getByText('Order Processing')).toBeInTheDocument();
    expect(screen.getByText('Shipping Updates')).toBeInTheDocument();
  });

    it('should display community impact message', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('orderId=abc123def456789'),
    ]);
    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Your Impact')).toBeInTheDocument();
    });
    expect(screen.getByText(/By shopping with Unity Collective/)).toBeInTheDocument();
    expect(screen.getByText('Supporting Black-Owned Businesses')).toBeInTheDocument();
  });

    it('should have view orders and continue shopping buttons', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('orderId=abc123def456789'),
    ]);
    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('View My Orders')).toBeInTheDocument();
    });
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

    it('should show error message when no order ID is provided', async () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams('')]);
    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Invalid Order')).toBeInTheDocument();
    });
    expect(screen.getByText(/No order information found/)).toBeInTheDocument();
  });

    it('should have contact support link', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('orderId=abc123def456789'),
    ]);
    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Questions about your order?')).toBeInTheDocument();
    });
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });
});
