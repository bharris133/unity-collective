import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VendorSettingsPage from '../../pages/VendorSettingsPage';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock AuthContext — vendor user
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-vendor-uid' },
    userProfile: { role: 'vendor', businessOwner: true, email: 'vendor@test.com' },
    loading: false,
  }),
}));

// Mock onboardingService
vi.mock('../../services/onboardingService', () => ({
  getOnboardingState: vi.fn().mockResolvedValue({
    memberId: 'test-vendor-uid',
    currentStep: 'complete',
    completedSteps: ['registration', 'business-profile', 'verification', 'products', 'review', 'complete'],
    businessProfile: {
      businessName: 'Thriving After Forty',
      category: 'Wellness',
      description: 'Empowering women over 40.',
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

// Mock Firestore — no existing override
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => null }),
    setDoc: vi.fn().mockResolvedValue(undefined),
    doc: vi.fn(),
  };
});

vi.mock('../../firebase', () => ({ db: {} }));

describe('VendorSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <BrowserRouter>
        <VendorSettingsPage />
      </BrowserRouter>
    );

  it('renders the page heading', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Store Settings')).toBeInTheDocument();
    });
  });

  it('pre-fills business name from onboarding data', async () => {
    renderPage();
    await waitFor(() => {
      const input = screen.getByDisplayValue('Thriving After Forty');
      expect(input).toBeInTheDocument();
    });
  });

  it('pre-fills description from onboarding data', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Empowering women over 40.')).toBeInTheDocument();
    });
  });

  it('shows verification status', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('verified')).toBeInTheDocument();
    });
  });

  it('renders the Save Settings button', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });
  });

  it('renders the View My Store link', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('View My Store')).toBeInTheDocument();
    });
  });

  it('renders logo upload section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Store Logo')).toBeInTheDocument();
    });
  });
});
