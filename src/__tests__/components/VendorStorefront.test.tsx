import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VendorStorefront from '../../components/VendorStorefront';
import { MarketplaceProvider } from '../../contexts/MarketplaceContext';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ vendorId: 'vendor-1' }),
    useNavigate: () => vi.fn(),
  };
});

describe('VendorStorefront Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <MarketplaceProvider>
          <VendorStorefront />
        </MarketplaceProvider>
      </BrowserRouter>
    );
  };

  it('should render vendor storefront with vendor information', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Afrocentric Books & Gifts/i)).toBeInTheDocument();
    });
  });

  it('should display vendor description', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Premier destination for African-American literature/i)).toBeInTheDocument();
    });
  });

  it('should show verified badge for verified vendors', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Verified Business/i)).toBeInTheDocument();
    });
  });

  it('should display founding member badge', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Founding Member/i)).toBeInTheDocument();
    });
  });

  it('should render product grid', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/The Autobiography of Malcolm X/i)).toBeInTheDocument();
    });
  });

  it('should have search functionality', async () => {
    renderComponent();
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search products/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('should have category filter', async () => {
    renderComponent();
    
    await waitFor(() => {
      const categorySelect = screen.getByRole('combobox');
      expect(categorySelect).toBeInTheDocument();
    });
  });

  it('should display vendor contact information', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/\(555\) 123-4567/i)).toBeInTheDocument();
      expect(screen.getByText(/contact@afrocentricbooks\.com/i)).toBeInTheDocument();
    });
  });

  it('should show vendor rating', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/4\.8/i)).toBeInTheDocument();
      expect(screen.getByText(/127 reviews/i)).toBeInTheDocument();
    });
  });

  it('should display product prices correctly', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/\$18\.99/i)).toBeInTheDocument();
    });
  });
});
