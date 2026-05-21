/**
 * Mock data for business onboarding proof-of-concept.
 * Supports the Lane B (Wizard) happy path end-to-end test.
 */

// Onboarding steps in order
export const ONBOARDING_STEPS = [
  'registration',
  'business-profile',
  'verification',
  'products',
  'review',
  'complete',
] as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[number];

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface OnboardingVerificationDoc {
  docType: 'business-license' | 'ein' | 'affidavit' | 'other';
  fileName: string;
  uploadedAt: string;
  // In mock mode this is a placeholder path; in production it would be a Storage URL
  mockFilePath: string;
}

export interface OnboardingState {
  memberId: string;          // uid of the user going through onboarding
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  // Business profile data collected during wizard
  businessProfile: {
    businessName: string;
    category: string;
    description: string;
    location: string;
    phone: string;
    email: string;
    website: string;
  };
  // Verification
  isBlackOwned: boolean;     // self-declaration
  verificationStatus: VerificationStatus;
  verificationDocs: OnboardingVerificationDoc[];
  // Products: added during onboarding or skipped
  skippedProducts: boolean;
  // Rejection
  rejectionReason?: string;
  // Timestamps
  startedAt: string;
  completedAt: string | null;
}

// ─── Mock onboarding sessions ────────────────────────────────────────────────

/**
 * A member mid-way through onboarding (for testing resume flow).
 * Uses regularUser2 (Emily Chen) as the test subject.
 */
export const mockOnboardingInProgress: OnboardingState = {
  memberId: 'mock-user-002',
  currentStep: 'verification',
  completedSteps: ['registration', 'business-profile'],
  businessProfile: {
    businessName: 'Chen Creative Studio',
    category: 'Arts & Crafts',
    description: 'Handcrafted jewelry and wearable art celebrating African heritage.',
    location: 'Atlanta, GA',
    phone: '(555) 345-6789',
    email: 'emily.chen@example.com',
    website: '',
  },
  isBlackOwned: true,
  verificationStatus: 'pending',
  verificationDocs: [
    {
      docType: 'business-license',
      fileName: 'chen_creative_business_license.pdf',
      uploadedAt: new Date('2026-05-20').toISOString(),
      mockFilePath: '/mock-docs/chen_creative_business_license.pdf',
    },
  ],
  skippedProducts: false,
  startedAt: new Date('2026-05-20').toISOString(),
  completedAt: null,
};

/**
 * A fully completed onboarding session (for testing the "already onboarded" state).
 * Uses vendorUser (Sarah Johnson) as the test subject.
 */
export const mockOnboardingComplete: OnboardingState = {
  memberId: 'mock-vendor-001',
  currentStep: 'complete',
  completedSteps: ['registration', 'business-profile', 'verification', 'products', 'review', 'complete'],
  businessProfile: {
    businessName: 'Green Garden Organic Farm',
    category: 'Food & Beverage',
    description: 'Certified organic produce and artisan foods from our family farm.',
    location: 'Unity City, UC',
    phone: '(555) 234-5678',
    email: 'sarah.johnson@greengarden.com',
    website: 'https://greengarden.example.com',
  },
  isBlackOwned: true,
  verificationStatus: 'verified',
  verificationDocs: [
    {
      docType: 'ein',
      fileName: 'green_garden_ein.pdf',
      uploadedAt: new Date('2025-06-10').toISOString(),
      mockFilePath: '/mock-docs/green_garden_ein.pdf',
    },
  ],
  skippedProducts: false,
  startedAt: new Date('2025-06-10').toISOString(),
  completedAt: new Date('2025-06-10').toISOString(),
};

// ─── In-memory store (simulates a database for mock mode) ────────────────────

const onboardingStore: Map<string, OnboardingState> = new Map([
  ['mock-user-002', mockOnboardingInProgress],
  ['mock-vendor-001', mockOnboardingComplete],
]);

export const getOnboardingState = (memberId: string): OnboardingState | null => {
  return onboardingStore.get(memberId) ?? null;
};

export const saveOnboardingState = (state: OnboardingState): void => {
  onboardingStore.set(state.memberId, { ...state });
};

export const clearOnboardingState = (memberId: string): void => {
  onboardingStore.delete(memberId);
};

// ─── Accepted document types for upload UI ───────────────────────────────────

export const ACCEPTED_DOC_TYPES = [
  { value: 'business-license', label: 'Business License' },
  { value: 'ein', label: 'EIN / Tax ID Document' },
  { value: 'affidavit', label: 'Signed Affidavit' },
  { value: 'other', label: 'Other Supporting Document' },
] as const;

// ─── Business categories (re-exported for wizard use) ────────────────────────

export const BUSINESS_CATEGORIES = [
  'Food & Beverage',
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Technology',
  'Professional Services',
  'Arts & Crafts',
  'Home & Garden',
  'Health & Wellness',
  'Education & Training',
  'Entertainment',
  'Other',
] as const;
