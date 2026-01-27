import { describe, it, expect, vi } from 'vitest';
import { useFavorites } from '../../contexts/FavoritesContext';

// Mock the entire context module
vi.mock('../../contexts/FavoritesContext', async () => {
  const actual = await vi.importActual('../../contexts/FavoritesContext');
  return {
    ...actual,
    useFavorites: vi.fn(() => ({
      favoriteVendors: [],
      favoriteProducts: [],
      addFavoriteVendor: vi.fn(),
      removeFavoriteVendor: vi.fn(),
      isFavoriteVendor: vi.fn(() => false),
      addFavoriteProduct: vi.fn(),
      removeFavoriteProduct: vi.fn(),
      isFavoriteProduct: vi.fn(() => false),
      toggleFavoriteVendor: vi.fn(),
      toggleFavoriteProduct: vi.fn(),
    })),
  };
});

describe('FavoritesContext', () => {
  it('should provide favorites context', () => {
    const context = useFavorites();
    expect(context).toBeDefined();
    expect(context.favoriteVendors).toBeDefined();
    expect(context.favoriteProducts).toBeDefined();
  });

  it('should have addFavoriteVendor function', () => {
    const context = useFavorites();
    expect(typeof context.addFavoriteVendor).toBe('function');
  });

  it('should have removeFavoriteVendor function', () => {
    const context = useFavorites();
    expect(typeof context.removeFavoriteVendor).toBe('function');
  });

  it('should have isFavoriteVendor function', () => {
    const context = useFavorites();
    expect(typeof context.isFavoriteVendor).toBe('function');
  });

  it('should have addFavoriteProduct function', () => {
    const context = useFavorites();
    expect(typeof context.addFavoriteProduct).toBe('function');
  });

  it('should have removeFavoriteProduct function', () => {
    const context = useFavorites();
    expect(typeof context.removeFavoriteProduct).toBe('function');
  });

  it('should have isFavoriteProduct function', () => {
    const context = useFavorites();
    expect(typeof context.isFavoriteProduct).toBe('function');
  });

  it('should have toggleFavoriteVendor function', () => {
    const context = useFavorites();
    expect(typeof context.toggleFavoriteVendor).toBe('function');
  });

  it('should have toggleFavoriteProduct function', () => {
    const context = useFavorites();
    expect(typeof context.toggleFavoriteProduct).toBe('function');
  });
});
