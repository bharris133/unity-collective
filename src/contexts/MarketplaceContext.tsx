import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartState, CartAction, CartItem, Product } from '../types';

interface MarketplaceContextType {
  cart: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getCartSubtotal: () => number;
  getCartTax: (taxRate?: number) => number;
  getCartShipping: () => number;
  getCartGrandTotal: () => number;
  sampleProducts: Product[];
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function useMarketplace(): MarketplaceContextType {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}

// Shopping cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
}

interface MarketplaceProviderProps {
  children: ReactNode;
}

export function MarketplaceProvider({ children }: MarketplaceProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('unity-collective-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('unity-collective-cart', JSON.stringify(cart.items));
  }, [cart.items]);

  // Cart actions
  const addToCart = (product: any): void => {
    const cartItem: any = {
      id: product.id || product.productId,
      quantity: 1,
      price: product.price,
      name: product.name,
      image: product.image || (product.images && product.images[0]),
      businessId: product.businessId || product.vendorId
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (productId: string): void => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number): void => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = (): void => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Cart calculations
  const getCartTotal = (): number => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = (): number => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = (): number => {
    return getCartTotal();
  };

  const getCartTax = (taxRate: number = 0.08): number => {
    return Math.floor(getCartSubtotal() * taxRate);
  };

  const getCartShipping = (): number => {
    const subtotal = getCartSubtotal();
    return subtotal >= 5000 ? 0 : 999; // Free shipping over $50 (5000 cents)
  };

  const getCartGrandTotal = (): number => {
    return getCartSubtotal() + getCartTax() + getCartShipping();
  };

  // Sample products data (in a real app, this would come from Firestore)
  const sampleProducts: any[] = [
    {
      id: 'unity-tshirt-001',
      name: 'Unity Collective T-Shirt',
      description: 'Premium cotton t-shirt with Unity Collective logo',
      price: 2499, // in cents
      category: 'Apparel',
      businessId: 'unity-collective',
      image: ['/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 50,
      tags: ['apparel', 'merchandise', 'unity'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'heritage-coffee-001',
      name: 'Heritage Blend Coffee',
      description: 'Ethically sourced coffee beans from African farms',
      price: 1899,
      category: 'Food & Beverage',
      businessId: 'heritage-foods',
      image: ['/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 25,
      tags: ['coffee', 'organic', 'fair-trade'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sankofa-book-001',
      name: 'Business Strategy Guide',
      description: 'Comprehensive guide to Black entrepreneurship',
      price: 2999,
      category: 'Books & Education',
      businessId: 'sankofa-consulting',
      image: ['/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 100,
      tags: ['education', 'business', 'entrepreneurship'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'unity-hoodie-001',
      name: 'Unity Collective Hoodie',
      description: 'Comfortable hoodie with embroidered logo',
      price: 4999,
      category: 'Apparel',
      businessId: 'unity-collective',
      image: ['/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 30,
      tags: ['apparel', 'merchandise', 'unity'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'heritage-spices-001',
      name: 'African Spice Collection',
      description: 'Authentic spice blend collection',
      price: 3499,
      category: 'Food & Beverage',
      businessId: 'heritage-foods',
      image: ['/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 40,
      tags: ['spices', 'cooking', 'authentic'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tech-course-001',
      name: 'Web Development Course',
      description: 'Complete web development training program',
      price: 19999,
      category: 'Digital Products',
      businessId: 'unity-tech',
      image: ['/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 999,
      tags: ['education', 'technology', 'course'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const value: MarketplaceContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartSubtotal,
    getCartTax,
    getCartShipping,
    getCartGrandTotal,
    sampleProducts
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}
