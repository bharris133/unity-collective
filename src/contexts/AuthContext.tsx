import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
  type UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { type User, type CreateUserData, type UpdateUserData } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  signup: (email: string, password: string, userData: CreateUserData) => Promise<FirebaseUser>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  updateUserProfile: (updates: UpdateUserData) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sign up function
  async function signup(email: string, password: string, userData: CreateUserData): Promise<FirebaseUser> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    if (userData.displayName) {
      await updateProfile(user, { displayName: userData.displayName });
    }

    // Determine role based on businessOwner flag
    const role = userData.businessOwner ? 'vendor' : 'buyer';

    // Create user profile in Firestore
    const userDoc: User = {
      uid: user.uid,
      email: user.email || '',
      displayName: userData.displayName || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: role,
      businessOwner: userData.businessOwner || false,
      businessName: userData.businessName || '',
      vendorId: undefined,
      location: userData.location || '',
      interests: userData.interests || [],
      favorites: [],
      orderHistory: [],
      joinedAt: new Date().toISOString(),
      isAdmin: false,
      profilePicture: '',
      bio: userData.bio || '',
      phone: userData.phone || '',
      website: userData.website || ''
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    return user;
  }

  // Login function
  function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google sign in
  async function signInWithGoogle(): Promise<FirebaseUser> {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create one
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      const newUserDoc: User = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        role: 'buyer',
        businessOwner: false,
        businessName: '',
        vendorId: undefined,
        location: '',
        interests: [],
        favorites: [],
        orderHistory: [],
        joinedAt: new Date().toISOString(),
        isAdmin: false,
        profilePicture: user.photoURL || '',
        bio: '',
        phone: '',
        website: ''
      };
      await setDoc(userDocRef, newUserDoc);
    }
    
    return user;
  }

  // Logout function
  function logout(): Promise<void> {
    return signOut(auth);
  }

  // Update user profile
  async function updateUserProfile(updates: UpdateUserData): Promise<void> {
    if (currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    }
  }

  // Load user profile from Firestore
  async function loadUserProfile(user: FirebaseUser | null): Promise<void> {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data() as User);
      }
    } else {
      setUserProfile(null);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await loadUserProfile(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
