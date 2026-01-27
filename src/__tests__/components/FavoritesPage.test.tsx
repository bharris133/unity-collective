import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FavoritesPage from '../../components/FavoritesPage';
import React from 'react';

// Mock contexts
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    currentUser: { uid: 'test-user', displayName: 'Test User' },
    loading: false,
  })),
}));

vi.mock('../../contexts/FavoritesContext', () => ({
  useFavorites: vi.fn(() => ({
    favoriteVendors: ['1', '2'],
    favoriteProducts: ['1', '2'],
    toggleFavoriteVendor: vi.fn(),
    toggleFavoriteProduct: vi.fn(),
  })),
}));

describe('FavoritesPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render the favorites page', () => {
    renderWithRouter(<FavoritesPage />);
    expect(screen.getByText('My Favorites')).toBeInTheDocument();
  });

  it('should display vendors and products tabs', () => {
    renderWithRouter(<FavoritesPage />);
    expect(screen.getByText(/Vendors \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/Products \(2\)/)).toBeInTheDocument();
  });

  it('should show vendor count in tab', () => {
    renderWithRouter(<FavoritesPage />);
    expect(screen.getByText(/Vendors \(2\)/)).toBeInTheDocument();
  });

  it('should show product count in tab', () => {
    renderWithRouter(<FavoritesPage />);
    expect(screen.getByText(/Products \(2\)/)).toBeInTheDocument();
  });

  it('should display favorite vendors', () => {
    renderWithRouter(<FavoritesPage />);
    expect(screen.getByText('Soul Food Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Afrocentric Designs')).toBeInTheDocument();
  });
});
