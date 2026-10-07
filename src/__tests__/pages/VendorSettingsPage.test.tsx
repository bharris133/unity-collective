import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VendorSettingsPage from '../../pages/VendorSettingsPage';

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
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
    getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
    setDoc: vi.fn().mockResolvedValue(undefined),
    doc: vi.fn(),
    collection: vi.fn(),
  };
});

vi.mock('../../firebase', () => ({ db: {} }));

import { getDocs, setDoc } from 'firebase/firestore';

describe('VendorSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false');
    vi.mocked(getDocs).mockResolvedValue({ empty: true, docs: [] } as never);
    window.confirm = vi.fn(() => true);
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

  it('shows verification progress section', async () => {
    // The old binary "Verification Status" section was removed (PR #59).
    // VerificationProgress replaces it; check for its heading.
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Verification Progress/i)).toBeInTheDocument();
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

  it('shows rejected submission feedback and permits a corrected upload', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'rejected-submission',
          data: () => ({
            type: 'document',
            status: 'rejected',
            fileUrls: [],
            notes: 'Original QA submission',
            reviewedBy: 'admin-uid',
            reviewedAt: '2026-10-07T00:00:00.000Z',
            rejectionReason: 'Please upload a readable certification document.',
            createdAt: { toMillis: () => 2 },
          }),
        },
      ],
    } as never);

    renderPage();

    expect(await screen.findByText('Submission Rejected')).toBeInTheDocument();
    expect(screen.getByText(/Please upload a readable certification document/i)).toBeInTheDocument();
    expect(screen.getByText(/Click to select a PDF or image file/i)).toBeInTheDocument();
  });

  it('continues to prioritize a pending submission over an earlier rejection', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'pending-submission',
          data: () => ({ type: 'document', status: 'pending', fileUrls: [], notes: '', reviewedBy: null, reviewedAt: null, rejectionReason: null, createdAt: { toMillis: () => 3 } }),
        },
        {
          id: 'rejected-submission',
          data: () => ({ type: 'document', status: 'rejected', fileUrls: [], notes: '', reviewedBy: 'admin-uid', reviewedAt: '2026-10-07T00:00:00.000Z', rejectionReason: 'Earlier rejection', createdAt: { toMillis: () => 2 } }),
        },
      ],
    } as never);

    renderPage();

    expect(await screen.findByText('Under Review')).toBeInTheDocument();
    expect(screen.queryByText('Submission Rejected')).not.toBeInTheDocument();
    expect(screen.queryByText(/Click to select a PDF or image file/i)).not.toBeInTheDocument();
  });

  it('warns before the dashboard action discards unsaved store changes', async () => {
    window.confirm = vi.fn(() => false);
    renderPage();

    const description = await screen.findByDisplayValue('Empowering women over 40.');
    fireEvent.change(description, { target: { value: 'Unsaved update' } });

    fireEvent.click(screen.getByRole('button', { name: 'Back to Dashboard' }));

    expect(window.confirm).toHaveBeenCalledWith('You have unsaved store changes. Leave without saving?');
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('clears the unload warning after store changes are saved', async () => {
    renderPage();

    const description = await screen.findByDisplayValue('Empowering women over 40.');
    fireEvent.change(description, { target: { value: 'Saved update' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save Settings' }));
    await waitFor(() => expect(setDoc).toHaveBeenCalled());
    await screen.findByText('Saved!');

    const unloadEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(unloadEvent);
    expect(unloadEvent.defaultPrevented).toBe(false);
  });
});
