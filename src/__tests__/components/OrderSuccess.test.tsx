import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrderSuccess from '../../components/OrderSuccess';

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

  it('should render success message with valid session ID', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('session_id=cs_test_1234567890abcdef'),
    ]);

    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    expect(screen.getByText(/Thank you for supporting Black-owned businesses/)).toBeInTheDocument();
  });

  it('should display order number based on session ID', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('session_id=cs_test_abcd1234'),
    ]);

    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText('Order Number')).toBeInTheDocument();
    // Should show last 8 characters of session ID in uppercase
    expect(screen.getByText(/UC-/)).toBeInTheDocument();
  });

  it('should show what happens next steps', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('session_id=cs_test_1234567890'),
    ]);

    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText("What's Next?")).toBeInTheDocument();
    expect(screen.getByText('Order Confirmation Email')).toBeInTheDocument();
    expect(screen.getByText('Vendor Notification')).toBeInTheDocument();
    expect(screen.getByText('Shipping Updates')).toBeInTheDocument();
  });

  it('should display community impact message', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('session_id=cs_test_1234567890'),
    ]);

    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText('Your Impact')).toBeInTheDocument();
    expect(screen.getByText(/By shopping with Unity Collective/)).toBeInTheDocument();
    expect(screen.getByText('Supporting Black-Owned Businesses')).toBeInTheDocument();
  });

  it('should have continue shopping and return home buttons', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('session_id=cs_test_1234567890'),
    ]);

    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    expect(screen.getByText('Return Home')).toBeInTheDocument();
  });

  it('should show error message when no session ID is provided', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams('')]);

    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText('Invalid Order')).toBeInTheDocument();
    expect(screen.getByText(/No order information found/)).toBeInTheDocument();
  });

  it('should have contact support link', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('session_id=cs_test_1234567890'),
    ]);

    render(
      <BrowserRouter>
        <OrderSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText('Questions about your order?')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });
});
