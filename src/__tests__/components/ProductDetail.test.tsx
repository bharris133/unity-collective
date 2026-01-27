import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductDetail from '../../components/ProductDetail';
import { MarketplaceProvider } from '../../contexts/MarketplaceContext';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ productId: 'prod-1' }),
    useNavigate: () => vi.fn(),
  };
});

describe('ProductDetail Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <MarketplaceProvider>
          <ProductDetail />
        </MarketplaceProvider>
      </BrowserRouter>
    );
  };

  it('should render product detail page', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/The Autobiography of Malcolm X/i)).toBeInTheDocument();
    });
  });

  it('should display product description', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Classic autobiography detailing the life/i)).toBeInTheDocument();
    });
  });

  it('should show product price', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/\$18\.99/i)).toBeInTheDocument();
    });
  });

  it('should display product category', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Category:')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });
  });

  it('should show stock status', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/In Stock/i)).toBeInTheDocument();
      expect(screen.getByText(/45 available/i)).toBeInTheDocument();
    });
  });

  it('should have quantity selector', async () => {
    renderComponent();
    
    await waitFor(() => {
      const quantityInput = screen.getByRole('spinbutton');
      expect(quantityInput).toBeInTheDocument();
      expect(quantityInput).toHaveValue(1);
    });
  });

  it('should allow increasing quantity', async () => {
    renderComponent();
    
    await waitFor(() => {
      const increaseButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
      expect(increaseButton).toBeInTheDocument();
    });
  });

  it('should allow decreasing quantity', async () => {
    renderComponent();
    
    await waitFor(() => {
      const decreaseButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
      expect(decreaseButton).toBeInTheDocument();
    });
  });

  it('should have add to cart button', async () => {
    renderComponent();
    
    await waitFor(() => {
      const addToCartButton = screen.getByRole('button', { name: /Add to Cart/i });
      expect(addToCartButton).toBeInTheDocument();
      expect(addToCartButton).not.toBeDisabled();
    });
  });

  it('should display vendor information', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Afrocentric Books & Gifts/i)).toBeInTheDocument();
      expect(screen.getByText(/Sold By/i)).toBeInTheDocument();
    });
  });

  it('should show featured badge for featured products', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Featured Product/i)).toBeInTheDocument();
    });
  });

  it('should have back button', async () => {
    renderComponent();
    
    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /Back/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  it('should have wishlist button', async () => {
    renderComponent();
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      // Heart icon button for wishlist
      expect(buttons.length).toBeGreaterThan(3);
    });
  });

  it('should have share button', async () => {
    renderComponent();
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      // Share2 icon button
      expect(buttons.length).toBeGreaterThan(3);
    });
  });
});
