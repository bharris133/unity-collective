import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MarketplaceContext = createContext();

export function useMarketplace() {
  return useContext(MarketplaceContext);
}

// Shopping cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
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

export function MarketplaceProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('unity-collective-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
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
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Cart calculations
  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return getCartTotal();
  };

  const getCartTax = (taxRate = 0.08) => {
    return getCartSubtotal() * taxRate;
  };

  const getCartShipping = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  };

  const getCartGrandTotal = () => {
    return getCartSubtotal() + getCartTax() + getCartShipping();
  };

  // Sample products data (in a real app, this would come from a database)
  const sampleProducts = [
    {
      id: 'unity-tshirt-001',
      name: 'Unity Collective T-Shirt',
      description: 'Premium cotton t-shirt with Unity Collective logo',
      price: 24.99,
      category: 'Apparel',
      businessId: 'unity-collective',
      businessName: 'Unity Collective',
      image: '/api/placeholder/300/300',
      inStock: true,
      stockQuantity: 50,
      tags: ['apparel', 'merchandise', 'unity']
    },
    {
      id: 'heritage-coffee-001',
      name: 'Heritage Blend Coffee',
      description: 'Ethically sourced coffee beans from African farms',
      price: 18.99,
      category: 'Food & Beverage',
      businessId: 'heritage-foods',
      businessName: 'Heritage Foods Market',
      image: '/api/placeholder/300/300',
      inStock: true,
      stockQuantity: 25,
      tags: ['coffee', 'organic', 'fair-trade']
    },
    {
      id: 'sankofa-book-001',
      name: 'Business Strategy Guide',
      description: 'Comprehensive guide to Black entrepreneurship',
      price: 29.99,
      category: 'Books & Education',
      businessId: 'sankofa-consulting',
      businessName: 'Sankofa Consulting',
      image: '/api/placeholder/300/300',
      inStock: true,
      stockQuantity: 100,
      tags: ['education', 'business', 'entrepreneurship']
    },
    {
      id: 'unity-hoodie-001',
      name: 'Unity Collective Hoodie',
      description: 'Comfortable hoodie with embroidered logo',
      price: 49.99,
      category: 'Apparel',
      businessId: 'unity-collective',
      businessName: 'Unity Collective',
      image: '/api/placeholder/300/300',
      inStock: true,
      stockQuantity: 30,
      tags: ['apparel', 'merchandise', 'unity']
    },
    {
      id: 'heritage-spices-001',
      name: 'African Spice Collection',
      description: 'Authentic spice blend collection',
      price: 34.99,
      category: 'Food & Beverage',
      businessId: 'heritage-foods',
      businessName: 'Heritage Foods Market',
      image: '/api/placeholder/300/300',
      inStock: true,
      stockQuantity: 40,
      tags: ['spices', 'cooking', 'authentic']
    },
    {
      id: 'tech-course-001',
      name: 'Web Development Course',
      description: 'Complete web development training program',
      price: 199.99,
      category: 'Digital Products',
      businessId: 'unity-tech',
      businessName: 'Unity Tech Solutions',
      image: '/api/placeholder/300/300',
      inStock: true,
      stockQuantity: 999,
      tags: ['education', 'technology', 'course']
    }
  ];

  const value = {
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

