import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favoriteVendors: string[];
  favoriteProducts: string[];
  addFavoriteVendor: (vendorId: string) => void;
  removeFavoriteVendor: (vendorId: string) => void;
  isFavoriteVendor: (vendorId: string) => boolean;
  addFavoriteProduct: (productId: string) => void;
  removeFavoriteProduct: (productId: string) => void;
  isFavoriteProduct: (productId: string) => boolean;
  toggleFavoriteVendor: (vendorId: string) => void;
  toggleFavoriteProduct: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [favoriteVendors, setFavoriteVendors] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      const storedVendors = localStorage.getItem(`favorites_vendors_${currentUser.uid}`);
      const storedProducts = localStorage.getItem(`favorites_products_${currentUser.uid}`);
      
      if (storedVendors) {
        setFavoriteVendors(JSON.parse(storedVendors));
      }
      if (storedProducts) {
        setFavoriteProducts(JSON.parse(storedProducts));
      }
    } else {
      // Clear favorites if user logs out
      setFavoriteVendors([]);
      setFavoriteProducts([]);
    }
  }, [currentUser]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favorites_vendors_${currentUser.uid}`, JSON.stringify(favoriteVendors));
    }
  }, [favoriteVendors, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favorites_products_${currentUser.uid}`, JSON.stringify(favoriteProducts));
    }
  }, [favoriteProducts, currentUser]);

  const addFavoriteVendor = (vendorId: string) => {
    if (!currentUser) {return;}
    setFavoriteVendors(prev => [...new Set([...prev, vendorId])]);
    
    // TODO: Save to Firestore
    // const userRef = doc(db, 'users', currentUser.uid);
    // await updateDoc(userRef, {
    //   favoriteVendors: arrayUnion(vendorId)
    // });
  };

  const removeFavoriteVendor = (vendorId: string) => {
    if (!currentUser) {return;}
    setFavoriteVendors(prev => prev.filter(id => id !== vendorId));
    
    // TODO: Remove from Firestore
    // const userRef = doc(db, 'users', currentUser.uid);
    // await updateDoc(userRef, {
    //   favoriteVendors: arrayRemove(vendorId)
    // });
  };

  const isFavoriteVendor = (vendorId: string): boolean => {
    return favoriteVendors.includes(vendorId);
  };

  const toggleFavoriteVendor = (vendorId: string) => {
    if (isFavoriteVendor(vendorId)) {
      removeFavoriteVendor(vendorId);
    } else {
      addFavoriteVendor(vendorId);
    }
  };

  const addFavoriteProduct = (productId: string) => {
    if (!currentUser) {return;}
    setFavoriteProducts(prev => [...new Set([...prev, productId])]);
    
    // TODO: Save to Firestore
  };

  const removeFavoriteProduct = (productId: string) => {
    if (!currentUser) {return;}
    setFavoriteProducts(prev => prev.filter(id => id !== productId));
    
    // TODO: Remove from Firestore
  };

  const isFavoriteProduct = (productId: string): boolean => {
    return favoriteProducts.includes(productId);
  };

  const toggleFavoriteProduct = (productId: string) => {
    if (isFavoriteProduct(productId)) {
      removeFavoriteProduct(productId);
    } else {
      addFavoriteProduct(productId);
    }
  };

  const value: FavoritesContextType = {
    favoriteVendors,
    favoriteProducts,
    addFavoriteVendor,
    removeFavoriteVendor,
    isFavoriteVendor,
    addFavoriteProduct,
    removeFavoriteProduct,
    isFavoriteProduct,
    toggleFavoriteVendor,
    toggleFavoriteProduct,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
