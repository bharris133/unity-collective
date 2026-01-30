import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MarketplaceProvider, useMarketplace } from '../../contexts/MarketplaceContext';
import { Product } from '../../types';

const mockProduct: any = {
  id: 'test-product-1',
  name: 'Test Product',
  description: 'Test description',
  price: 2999,
  category: 'Apparel',
  businessId: 'test-vendor',
  image: '/test-image.jpg',
  inStock: true,
  stockQuantity: 10,
  tags: ['test']
};

describe('MarketplaceContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide marketplace context', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    expect(result.current).toBeDefined();
    expect(result.current.cart).toBeDefined();
    expect(result.current.addToCart).toBeDefined();
    expect(result.current.removeFromCart).toBeDefined();
  });

  it('should start with empty cart', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.getCartItemCount()).toBe(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should add product to cart', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].id).toBe('test-product-1');
    expect(result.current.cart.items[0].quantity).toBe(1);
    expect(result.current.getCartItemCount()).toBe(1);
  });

  it('should increment quantity when adding same product', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(2);
    expect(result.current.getCartItemCount()).toBe(2);
  });

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart.items).toHaveLength(1);

    act(() => {
      result.current.removeFromCart('test-product-1');
    });

    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.getCartItemCount()).toBe(0);
  });

  it('should update product quantity', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('test-product-1', 5);
    });

    expect(result.current.cart.items[0].quantity).toBe(5);
    expect(result.current.getCartItemCount()).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('test-product-1', 0);
    });

    expect(result.current.cart.items).toHaveLength(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 'test-product-2' });
    });

    expect(result.current.cart.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart.items).toHaveLength(0);
  });

  it('should calculate cart total correctly', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct); // $29.99
      result.current.addToCart(mockProduct); // $29.99
    });

    // 2 * 2999 cents = 5998 cents = $59.98
    expect(result.current.getCartTotal()).toBe(5998);
    expect(result.current.getCartSubtotal()).toBe(5998);
  });

  it('should calculate tax correctly', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct); // $29.99
    });

    const tax = result.current.getCartTax(0.08); // 8% tax
    expect(tax).toBe(Math.floor(2999 * 0.08)); // 239 cents
  });

  it('should calculate shipping correctly', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    // Under $50 - should charge shipping
    act(() => {
      result.current.addToCart(mockProduct); // $29.99 (2999 cents)
    });

    expect(result.current.getCartShipping()).toBe(999); // $9.99 shipping

    // At or over $50 - free shipping
    act(() => {
      result.current.addToCart(mockProduct); // Another $29.99 = $59.98 total (5998 cents)
    });

    expect(result.current.getCartShipping()).toBe(0); // Free shipping
  });

  it('should calculate grand total correctly', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct); // $29.99
    });

    const subtotal = 2999;
    const tax = Math.floor(subtotal * 0.08); // 239
    const shipping = 999;
    const expectedTotal = subtotal + tax + shipping; // 4237

    expect(result.current.getCartGrandTotal()).toBe(expectedTotal);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    const savedCart = localStorage.getItem('unity-collective-cart');
    expect(savedCart).toBeTruthy();
    
    const parsedCart = JSON.parse(savedCart!);
    expect(parsedCart).toHaveLength(1);
    expect(parsedCart[0].id).toBe('test-product-1');
  });

  it('should provide sample products', () => {
    const { result } = renderHook(() => useMarketplace(), {
      wrapper: MarketplaceProvider
    });

    expect(result.current.sampleProducts).toBeDefined();
    expect(result.current.sampleProducts.length).toBeGreaterThan(0);
    expect(result.current.sampleProducts[0]).toHaveProperty('id');
    expect(result.current.sampleProducts[0]).toHaveProperty('name');
    expect(result.current.sampleProducts[0]).toHaveProperty('price');
  });
});
