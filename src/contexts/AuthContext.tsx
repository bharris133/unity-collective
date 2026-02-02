import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
import { 
  isMockAuthEnabled, 
  getCurrentMockUser, 
  setCurrentMockUser,
  signIn as mockSignIn,
  signUp as mockSignUp,
  signOut as mockSignOut
} from '../services/authService';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  signup: (email: string, password: string, userData: CreateUserData) => Promise<FirebaseUser | User>;
  login: (email: string, password: string) => Promise<UserCredential | User>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  updateUserProfile: (updates: UpdateUserData) => Promise<void>;
  loading: boolean;
  isMockMode: boolean;
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
  const [isMockMode, setIsMockMode] = useState<boolean>(isMockAuthEnabled());

  // Sign up function
  async function signup(email: string, password: string, userData: CreateUserData): Promise<FirebaseUser | User> {
    if (isMockAuthEnabled()) {
      const displayName = `${userData.firstName} ${userData.lastName}`;
      const mockUser = await mockSignUp(email, password, displayName);
      
      // Update user profile with additional data
      const enhancedProfile: User = {
        ...mockUser,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phone || '',
        address: userData.location || '',
        isVendor: userData.businessOwner || false,
        businessName: userData.businessName,
      };
      
      setCurrentMockUser(enhancedProfile);
      setUserProfile(enhancedProfile);
      
      return enhancedProfile;
    }

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
  async function login(email: string, password: string): Promise<UserCredential | User> {
    if (isMockAuthEnabled()) {
      const mockUser = await mockSignIn(email, password);
      setUserProfile(mockUser);
      return mockUser as User;
    }
    
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google sign in
  async function signInWithGoogle(): Promise<FirebaseUser> {
    if (isMockAuthEnabled()) {
      throw new Error('Google sign-in is not available in mock mode. Please use email/password or switch to live Firebase.');
    }

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
  async function logout(): Promise<void> {
    if (isMockAuthEnabled()) {
      await mockSignOut();
      setUserProfile(null);
      setCurrentUser(null);
      return;
    }
    
    return signOut(auth);
  }

  // Update user profile
  async function updateUserProfile(updates: UpdateUserData): Promise<void> {
    if (isMockAuthEnabled()) {
      const currentMock = getCurrentMockUser();
      if (currentMock) {
        const updated = { ...currentMock, ...updates };
        setCurrentMockUser(updated);
        setUserProfile(updated);
      }
      return;
    }

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

  // Initialize authentication
  useEffect(() => {
    const mockMode = isMockAuthEnabled();
    setIsMockMode(mockMode);

    if (mockMode) {
      // Mock mode: check localStorage for current user
      const mockUser = getCurrentMockUser();
      setUserProfile(mockUser);
      
      // Create a mock Firebase User object for compatibility
      if (mockUser) {
        const mockFirebaseUser = {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL || null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => '',
          getIdTokenResult: async () => ({} as any),
          reload: async () => {},
          toJSON: () => ({}),
          phoneNumber: mockUser.phoneNumber || null,
          providerId: 'mock',
        } as FirebaseUser;
        setCurrentUser(mockFirebaseUser);
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);

      // Listen for storage changes (when mock user is switched)
      const handleStorageChange = () => {
        const updatedMockUser = getCurrentMockUser();
        setUserProfile(updatedMockUser);
        
        // Update currentUser as well
        if (updatedMockUser) {
          const mockFirebaseUser = {
            uid: updatedMockUser.uid,
            email: updatedMockUser.email,
            displayName: updatedMockUser.displayName,
            photoURL: updatedMockUser.photoURL || null,
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: null,
            delete: async () => {},
            getIdToken: async () => '',
            getIdTokenResult: async () => ({} as any),
            reload: async () => {},
            toJSON: () => ({}),
            phoneNumber: updatedMockUser.phoneNumber || null,
            providerId: 'mock',
          } as FirebaseUser;
          setCurrentUser(mockFirebaseUser);
        } else {
          setCurrentUser(null);
        }
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } else {
      // Firebase mode: use onAuthStateChanged
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        await loadUserProfile(user);
        setLoading(false);
      });

      return unsubscribe;
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    loading,
    isMockMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
