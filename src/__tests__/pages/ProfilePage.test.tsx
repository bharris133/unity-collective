import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../../pages/ProfilePage';

let userProfile = {
  uid: 'test-vendor-uid',
  email: 'vendor@test.com',
  displayName: 'Test Vendor',
  firstName: 'Test',
  lastName: 'Vendor',
  role: 'vendor' as const,
  businessOwner: true,
  businessName: 'Test Store',
  location: 'Atlanta, GA',
  interests: [],
  favorites: [],
  orderHistory: [],
  isAdmin: false,
  profilePicture: '',
  bio: '',
  phone: '',
  website: '',
  joinedAt: '2026-01-01T00:00:00Z',
};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-vendor-uid' },
    userProfile,
    updateUserProfile: vi.fn(),
    loading: false,
  }),
}));

vi.mock('../../services/storageService', () => ({
  uploadProfileAvatar: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('ProfilePage navigation', () => {
  const renderPage = () => render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );

  it('offers vendors a deterministic return to Store Settings', () => {
    userProfile = { ...userProfile, role: 'vendor', businessOwner: true };
    renderPage();

    expect(screen.getByRole('link', { name: 'Store Settings' })).toHaveAttribute('href', '/vendor/settings');
  });

  it('does not show the store settings shortcut to non-vendors', () => {
    userProfile = { ...userProfile, role: 'buyer', businessOwner: false };
    renderPage();

    expect(screen.queryByRole('link', { name: 'Store Settings' })).not.toBeInTheDocument();
  });
});
