import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VendorStorefront from '../../components/VendorStorefront';
import { MarketplaceProvider } from '../../contexts/MarketplaceContext';

// Mock useParams to return a test vendor UID
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ vendorId: 'test-uid-001' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock onboardingService
vi.mock('../../services/onboardingService', () => ({
  getOnboardingState: vi.fn().mockResolvedValue({
    memberId: 'test-uid-001',
    currentStep: 'complete',
    completedSteps: ['registration', 'business-profile', 'verification', 'products', 'review', 'complete'],
    businessProfile: {
      businessName: 'Thriving After Forty',
      category: 'Wellness',
      description: 'Empowering women over 40 through health, wellness, and community.',
      location: 'Atlanta, GA',
      phone: '',
      email: '',
      website: 'https://thrivingafterforty.com',
    },
    isBlackOwned: true,
    verificationStatus: 'verified',
    verificationDocs: [],
    skippedProducts: false,
    startedAt: '2025-01-01T00:00:00Z',
    completedAt: '2025-01-02T00:00:00Z',
  }),
}));

// Mock productService
vi.mock('../../services/productService', () => ({
  productService: {
    getByBusinessId: vi.fn().mockResolvedValue([
      {
        productId: 'prod-001',
        vendorId: 'test-uid-001',
        name: 'Wellness Journal',
        description: 'A guided journal for women over 40.',
        price: 2499,
        category: 'Books & Education',
        images: [],
        inStock: true,
        stockQuantity: 10,
        tags: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ]),
  },
}));

// Mock Firestore getDoc for businesses override (returns no override)
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => null }),
    doc: vi.fn(),
  };
});

// Mock firebase db
vi.mock('../../firebase', () => ({
  db: {},
}));

describe('VendorStorefront Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <MarketplaceProvider>
          <VendorStorefront />
        </MarketplaceProvider>
      </BrowserRouter>
    );

  it('renders the business name from onboarding data', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Thriving After Forty')).toBeInTheDocument();
    });
  });

  it('renders the business description', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Empowering women over 40/i)).toBeInTheDocument();
    });
  });

  it('shows Verified Business badge for verified vendors', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Verified Business')).toBeInTheDocument();
    });
  });

  it('renders products from productService', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Wellness Journal')).toBeInTheDocument();
    });
  });

  it('formats product price correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('$24.99')).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });
  });

  it('renders category filter', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('shows location when provided', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Atlanta, GA')).toBeInTheDocument();
    });
  });

  it('shows "Store Not Found" when onboarding returns null', async () => {
    const { getOnboardingState } = await import('../../services/onboardingService');
    vi.mocked(getOnboardingState).mockResolvedValueOnce(null);
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Store Not Found')).toBeInTheDocument();
    });
  });
});
