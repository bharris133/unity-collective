# Admin Verification Flow — Feature Documentation

## What It Does

The Admin Verification Flow (Lane A) is the admin-side counterpart to the Business Onboarding Wizard (Lane B). It allows platform administrators to review submitted business applications, inspect uploaded verification documents, and approve or reject each application. Status changes are persisted in the in-memory `mockOnboarding` store and immediately reflected on the `BusinessDetail` and `MemberDashboard` pages via the shared `verificationStatus` field.

### Key capabilities

- **Pending queue** — all submissions with `verificationStatus: 'pending'` are surfaced in a dedicated Verifications tab with a live badge count in the sidebar
- **Two-pane review UI** — selecting a submission opens a detail pane showing business profile, self-declared Black-Owned status, and uploaded documents
- **Approve action** — sets `verificationStatus` to `'verified'`; the green Verified badge appears on `BusinessDetail` and `MemberDashboard` immediately
- **Reject action** — two-step flow: first click shows a rejection reason textarea, second click confirms and sets `verificationStatus` to `'rejected'` with an optional `rejectionReason`
- **Override** — a rejected application can be approved via an "Override — Approve Anyway" button
- **Pan-African dark theme** — the entire AdminPanel uses the same `#0A0A0A` / `#D4AF37` design language as the rest of the platform

---

## Files Involved

| File | Role |
|---|---|
| `src/components/admin/AdminPanel.tsx` | Main admin UI — all tabs including the new `VerificationsTab` |
| `src/data/mockOnboarding.ts` | In-memory store; `OnboardingState`, `VerificationStatus`, `saveOnboardingState()`, `getOnboardingState()` |
| `src/data/mockUsers.ts` | Mock user list used to resolve `memberId → displayName`; `adminUser` now has `isAdmin: true` |
| `src/components/BusinessDetail.tsx` | Reads `verificationStatus` from `getOnboardingState()` to show/hide the Verified badge |
| `src/pages/MemberDashboard.tsx` | Reads `verificationStatus` from `getOnboardingState()` to show the Business Verified banner |

---

## How to Make Changes

### Add a new field to the review detail pane

Edit the Business Profile section inside `VerificationsTab` in `AdminPanel.tsx`:

```tsx
// Inside the "Business Profile" card in VerificationsTab
{[
  { label: 'Category',    value: selected.businessProfile.category },
  { label: 'Location',    value: selected.businessProfile.location },
  // Add a new row here:
  { label: 'Tax ID',      value: selected.businessProfile.taxId || '—' },
].map(({ label, value }) => (
  <div key={label} className="flex justify-between text-sm">
    <span className={TEXT_MUTED}>{label}</span>
    <span className="text-white">{value}</span>
  </div>
))}
```

Then add the corresponding field to the `businessProfile` object in `OnboardingState` in `mockOnboarding.ts`.

### Change the verification statuses

The `VerificationStatus` type is defined in `mockOnboarding.ts`:

```ts
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
```

To add a new status (e.g., `'suspended'`), update this type, add a case to `statusBadgeClass()` and `statusLabel()` in `AdminPanel.tsx`, and handle it in the action buttons section of `VerificationsTab`.

### Add a new mock submission for testing

In `mockOnboarding.ts`, create a new `OnboardingState` object and register it in the `onboardingStore` map:

```ts
export const mockOnboardingNewVendor: OnboardingState = {
  memberId: 'mock-vendor-002',
  currentStep: 'review',
  completedSteps: ['account', 'business-profile', 'verify', 'products', 'review'],
  businessProfile: {
    businessName: 'Tech Repair Hub',
    category: 'Technology',
    description: 'Professional device repair and IT support.',
    location: 'Unity City, UC',
    phone: '(555) 456-7890',
    email: 'mike.rodriguez@techrepair.com',
    website: 'https://techrepairhub.com',
  },
  isBlackOwned: true,
  verificationStatus: 'pending',
  verificationDocs: [],
  skippedProducts: false,
  startedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
};

// Then add to the store initializer:
onboardingStore.set('mock-vendor-002', mockOnboardingNewVendor);
```

Also add the new `memberId` to the `knownIds` array in `getAllOnboardingStates()` inside `AdminPanel.tsx`.

### Wire to Firestore (Phase 3)

When replacing mock data with Firestore:

1. Replace `saveOnboardingState()` calls in `AdminPanel.tsx` with a Firestore `updateDoc()` call on the `businesses` collection
2. Replace `getAllOnboardingStates()` with a Firestore `getDocs()` query filtered by `verificationStatus`
3. Use a `useEffect` with `onSnapshot()` for real-time updates to the pending count badge

---

## Adding Items to Scope

To extend the verification flow with additional review steps (e.g., document authenticity check, manual ID verification):

1. Add a new `verificationStep` field to `OnboardingState` (e.g., `'documents' | 'identity' | 'complete'`)
2. Add a step indicator to the detail pane in `VerificationsTab`
3. Add action buttons for each step (e.g., "Mark Documents Reviewed")
4. The final "Approve & Verify" button should only be enabled when all steps are complete
