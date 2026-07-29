import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { mockBusinesses, type Business } from '../data';
import type { OnboardingState } from '../data/mockOnboarding';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Map an OnboardingState document to the legacy Business shape used by
 * BusinessDirectoryPage and BusinessDetail.  We use the vendor's Firebase UID
 * as a string id so that `/directory/:id` routes still work.
 */
function onboardingToBusinessShape(state: OnboardingState): Business {
  const bp = state.businessProfile;
  return {
    // Use the memberId (UID) as the numeric id field — parseInt will return NaN
    // for UIDs, so we cast to unknown first and store the string directly.
    // BusinessDirectoryPage only uses `business.id` as a React key and for the
    // `/directory/:id` link, so a string value is safe here.
    id: state.memberId as unknown as number,
    businessId: state.memberId,
    name: bp.businessName,
    category: bp.category,
    location: bp.location,
    rating: 0,
    description: bp.description,
    image: '',
    verified: state.verificationStatus === 'verified',
    isBlackOwned: state.isBlackOwned,
    website: bp.website || undefined,
    phone: bp.phone || undefined,
    email: bp.email || undefined,
  };
}

/**
 * Business Service
 *
 * Provides a unified interface for fetching business data.
 * Automatically switches between mock data and Firebase based on environment variable.
 *
 * In production mode the primary source of truth is the `onboarding` collection
 * (same as AdminPanel → Businesses tab) so that every vendor who has completed
 * onboarding appears in the directory.  The legacy `businesses` override collection
 * is merged on top so that any store-settings overrides (logo, name, description)
 * are reflected as well.
 */

export const businessService = {
  /**
   * Get all businesses
   */
  async getAll(): Promise<Business[]> {
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for businesses');
      return Promise.resolve(mockBusinesses);
    }

    console.log('🔥 Fetching businesses from onboarding collection');
    try {
      // Primary source: onboarding collection (same as admin panel)
      const onboardingSnap = await getDocs(collection(db, 'onboarding'));
      const onboardingStates = onboardingSnap.docs.map(d => d.data() as OnboardingState);

      // Secondary source: businesses override collection (store-settings overrides)
      const overridesSnap = await getDocs(collection(db, 'businesses'));
      const overridesMap: Record<string, Record<string, unknown>> = {};
      overridesSnap.docs.forEach(d => {
        overridesMap[d.id] = d.data() as Record<string, unknown>;
      });

      return onboardingStates.map(state => {
        const base = onboardingToBusinessShape(state);
        const ov = overridesMap[state.memberId];
        if (!ov) return base;

        // Apply store-settings overrides
        return {
          ...base,
          name: (ov.businessName as string) || base.name,
          category: (ov.category as string) || base.category,
          description: (ov.description as string) || base.description,
          location: (ov.location as string) || base.location,
          image: (ov.logoUrl as string) || base.image,
          website: (ov.website as string) || base.website,
        };
      });
    } catch (error) {
      console.error('Error fetching businesses from Firebase:', error);
      console.log('⚠️ Falling back to mock data');
      return mockBusinesses;
    }
  },

  /**
   * Get a single business by ID.
   * In production, `id` is the vendor's Firebase UID (a string stored as unknown number).
   */
  async getById(id: number | string): Promise<Business | null> {
    const idStr = String(id);

    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for business ${idStr}`);
      return Promise.resolve(mockBusinesses.find(b => String(b.id) === idStr) || null);
    }

    console.log(`🔥 Fetching business ${idStr} from Firebase`);
    try {
      // Try onboarding collection first (primary source)
      const onboardingRef = doc(db, 'onboarding', idStr);
      const onboardingSnap = await getDoc(onboardingRef);

      if (onboardingSnap.exists()) {
        const state = onboardingSnap.data() as OnboardingState;
        const base = onboardingToBusinessShape(state);

        // Merge override if present
        const overrideRef = doc(db, 'businesses', idStr);
        const overrideSnap = await getDoc(overrideRef);
        if (overrideSnap.exists()) {
          const ov = overrideSnap.data() as Record<string, unknown>;
          return {
            ...base,
            name: (ov.businessName as string) || base.name,
            category: (ov.category as string) || base.category,
            description: (ov.description as string) || base.description,
            location: (ov.location as string) || base.location,
            image: (ov.logoUrl as string) || base.image,
            website: (ov.website as string) || base.website,
          };
        }
        return base;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching business ${idStr} from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockBusinesses.find(b => String(b.id) === idStr) || null;
    }
  },

  /**
   * Get businesses by category
   */
  async getByCategory(category: string): Promise<Business[]> {
    const allBusinesses = await this.getAll();
    return allBusinesses.filter(b => b.category === category);
  }
};
