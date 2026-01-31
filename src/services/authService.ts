import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';
import { mockUsers, getMockUserByEmail } from '../data/mockUsers';
import type { User } from '../types/User';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Local storage keys
const MOCK_AUTH_USER_KEY = 'mock_auth_user';
const MOCK_AUTH_ENABLED_KEY = 'mock_auth_enabled';

/**
 * Authentication Service
 * 
 * Provides authentication functionality with automatic fallback to mock data
 * based on the VITE_USE_MOCK_DATA environment variable.
 */

// Check if mock auth is enabled (can be overridden in localStorage)
export const isMockAuthEnabled = (): boolean => {
  const localStorageOverride = localStorage.getItem(MOCK_AUTH_ENABLED_KEY);
  if (localStorageOverride !== null) {
    return localStorageOverride === 'true';
  }
  return USE_MOCK_AUTH;
};

// Enable/disable mock auth at runtime
export const setMockAuthEnabled = (enabled: boolean): void => {
  localStorage.setItem(MOCK_AUTH_ENABLED_KEY, String(enabled));
  console.log(`🔐 Mock authentication ${enabled ? 'enabled' : 'disabled'}`);
};

// Get current mock user from localStorage
export const getCurrentMockUser = (): User | null => {
  if (!isMockAuthEnabled()) return null;
  
  const stored = localStorage.getItem(MOCK_AUTH_USER_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing mock user from localStorage:', error);
    return null;
  }
};

// Set current mock user in localStorage
export const setCurrentMockUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(MOCK_AUTH_USER_KEY, JSON.stringify(user));
    console.log(`🔐 Mock user set: ${user.displayName} (${user.email})`);
  } else {
    localStorage.removeItem(MOCK_AUTH_USER_KEY);
    console.log('🔐 Mock user cleared');
  }
};

// Mock sign in
const mockSignIn = async (email: string, password: string): Promise<User> => {
  console.log('🔐 Using mock authentication');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = getMockUserByEmail(email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.password !== password) {
    throw new Error('Invalid password');
  }
  
  // Remove password from returned user
  const { password: _, ...userWithoutPassword } = user;
  
  setCurrentMockUser(userWithoutPassword);
  
  return userWithoutPassword;
};

// Mock sign up
const mockSignUp = async (email: string, password: string, displayName: string): Promise<User> => {
  console.log('🔐 Using mock authentication for sign up');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user already exists
  const existingUser = getMockUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create new mock user
  const newUser: User = {
    uid: `mock-user-${Date.now()}`,
    email,
    displayName,
    firstName: displayName.split(' ')[0] || '',
    lastName: displayName.split(' ').slice(1).join(' ') || '',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
    phoneNumber: '',
    address: '',
    isVendor: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  
  setCurrentMockUser(newUser);
  
  return newUser;
};

// Mock sign out
const mockSignOut = async (): Promise<void> => {
  console.log('🔐 Mock sign out');
  await new Promise(resolve => setTimeout(resolve, 300));
  setCurrentMockUser(null);
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<User | FirebaseUser> => {
  if (isMockAuthEnabled()) {
    return mockSignIn(email, password);
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.warn('Firebase sign in failed, falling back to mock data:', error);
    return mockSignIn(email, password);
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string, displayName: string): Promise<User | FirebaseUser> => {
  if (isMockAuthEnabled()) {
    return mockSignUp(email, password, displayName);
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.warn('Firebase sign up failed, falling back to mock data:', error);
    return mockSignUp(email, password, displayName);
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  if (isMockAuthEnabled()) {
    return mockSignOut();
  }
  
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.warn('Firebase sign out failed, falling back to mock sign out:', error);
    return mockSignOut();
  }
};

/**
 * Switch to a specific mock user (for testing)
 */
export const switchMockUser = (userKey: keyof typeof mockUsers | null): void => {
  if (!isMockAuthEnabled()) {
    console.warn('Mock auth is not enabled. Enable it first with setMockAuthEnabled(true)');
    return;
  }
  
  if (userKey === null) {
    setCurrentMockUser(null);
    return;
  }
  
  const user = mockUsers[userKey];
  if (!user) {
    console.error(`Mock user "${userKey}" not found`);
    return;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  setCurrentMockUser(userWithoutPassword);
  
  // Trigger a storage event to notify other components
  window.dispatchEvent(new Event('storage'));
};

/**
 * Get all available mock users for testing
 */
export const getAvailableMockUsers = () => {
  return Object.entries(mockUsers).map(([key, user]) => ({
    key,
    label: `${user.displayName} (${user.role})`,
    email: user.email,
    role: user.role,
  }));
};
