/**
 * Onboarding Service
 *
 * Provides a unified interface for reading and writing onboarding state.
 * Switches between the in-memory mock store (dev/test) and Firestore (production)
 * based on the VITE_USE_MOCK_DATA environment variable.
 *
 * Firestore collection: 'onboarding'
 * Document ID: the member's uid
 */

import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
  getOnboardingState as mockGet,
  saveOnboardingState as mockSave,
  clearOnboardingState as mockClear,
  type OnboardingState,
} from '../data/mockOnboarding';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Get the onboarding state for a member.
 * Returns null if no state exists for the given memberId.
 */
export async function getOnboardingState(memberId: string): Promise<OnboardingState | null> {
  if (USE_MOCK_DATA) {
    return mockGet(memberId);
  }

  try {
    const docRef = doc(db, 'onboarding', memberId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as OnboardingState;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching onboarding state for ${memberId}:`, error);
    console.warn('⚠️ Falling back to mock onboarding store');
    return mockGet(memberId);
  }
}

/**
 * Save (create or overwrite) the onboarding state for a member.
 */
export async function saveOnboardingState(state: OnboardingState): Promise<void> {
  if (USE_MOCK_DATA) {
    mockSave(state);
    return;
  }

  try {
    const docRef = doc(db, 'onboarding', state.memberId);
    await setDoc(docRef, state);
  } catch (error) {
    console.error(`Error saving onboarding state for ${state.memberId}:`, error);
    console.warn('⚠️ Falling back to mock onboarding store');
    mockSave(state);
  }
}

/**
 * Get all onboarding states (admin use only).
 * In production, queries the full Firestore 'onboarding' collection.
 * In mock mode, returns the known mock entries.
 */
export async function getAllOnboardingStates(): Promise<OnboardingState[]> {
  if (USE_MOCK_DATA) {
    const { mockOnboardingInProgress, mockOnboardingComplete } = await import('../data/mockOnboarding');
    return [mockOnboardingInProgress, mockOnboardingComplete];
  }
  try {
    const snapshot = await getDocs(collection(db, 'onboarding'));
    return snapshot.docs.map(d => d.data() as OnboardingState);
  } catch (error) {
    console.error('Error fetching all onboarding states:', error);
    return [];
  }
}

/**
 * Delete the onboarding state for a member (e.g., after full migration to a Business doc).
 */
export async function clearOnboardingState(memberId: string): Promise<void> {
  if (USE_MOCK_DATA) {
    mockClear(memberId);
    return;
  }

  try {
    const docRef = doc(db, 'onboarding', memberId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error clearing onboarding state for ${memberId}:`, error);
    console.warn('⚠️ Falling back to mock onboarding store');
    mockClear(memberId);
  }
}
