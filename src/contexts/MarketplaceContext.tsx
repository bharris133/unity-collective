import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import { type CartState, type CartAction, type CartItem, type Product } from '../types';
import { productService } from '../services/productService';

interface MarketplaceContextType {
  cart: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getCartSubtotal: () => number;
  getCartTax: (taxRate?: number) => number;
  getCartShipping: () => number;
  getCartGrandTotal: () => number;
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function useMarketplace(): MarketplaceContextType {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider');
  return context;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(i => i.productId !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map(i => i.productId === action.payload.productId ? { ...i, quantity: Math.max(0, action.payload.quantity) } : i)
          .filter(i => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload || [] };
    default:
      return state;
  }
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setProducts(await productService.getAll());
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshProducts(); }, []);

  useEffect(() => {
    const saved = localStorage.getItem('unity-collective-cart');
    if (saved) {
      try { dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) as CartItem[] }); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('unity-collective-cart', JSON.stringify(cart.items));
  }, [cart.items]);

  const addToCart = (product: Product): void => {
    const item: CartItem = {
      productId: product.productId,
      quantity: 1,
      price: product.price,
      name: product.name,
      image: product.images?.[0],
      vendorId: product.vendorId,
    };
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (productId: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  const updateQuantity = (productId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getCartTotal = () => cart.items.reduce((t, i) => t + i.price * i.quantity, 0);
  const getCartItemCount = () => cart.items.reduce((t, i) => t + i.quantity, 0);
  const getCartSubtotal = () => getCartTotal();
  const getCartTax = (taxRate = 0.08) => Math.floor(getCartSubtotal() * taxRate);
  const getCartShipping = () => getCartSubtotal() >= 5000 ? 0 : 999;
  const getCartGrandTotal = () => getCartSubtotal() + getCartTax() + getCartShipping();

  return (
    <MarketplaceContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      getCartTotal, getCartItemCount, getCartSubtotal, getCartTax, getCartShipping, getCartGrandTotal,
      products, loading, error, refreshProducts,
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}
