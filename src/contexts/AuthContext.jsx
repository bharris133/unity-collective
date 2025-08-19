import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, userData) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    if (userData.displayName) {
      await updateProfile(user, { displayName: userData.displayName });
    }

    // Create user profile in Firestore
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      businessOwner: userData.businessOwner || false,
      businessName: userData.businessName || '',
      location: userData.location || '',
      interests: userData.interests || [],
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
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google sign in
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const newUserDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        businessOwner: false,
        businessName: '',
        location: '',
        interests: [],
        joinedAt: new Date().toISOString(),
        isAdmin: false,
        profilePicture: user.photoURL || '',
        bio: '',
        phone: '',
        website: ''
      };
      await setDoc(doc(db, 'users', user.uid), newUserDoc);
    }
    
    return user;
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Update user profile
  async function updateUserProfile(updates) {
    if (currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updates }));
    }
  }

  // Load user profile from Firestore
  async function loadUserProfile(user) {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
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

  const value = {
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

