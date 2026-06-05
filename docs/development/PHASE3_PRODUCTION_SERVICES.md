# Phase 3: Production-Ready Services

**Date**: June 2026
**Branch**: `feature/phase3-production-services`
**Status**: ✅ Complete

---

## Overview

Phase 3 transitions the Unity Collective platform from local mock data to real production backend services. Every data operation now routes through a unified service layer that automatically switches between mock (development) and live (production) modes via a single environment variable.

---

## Architecture

```
Component / Context
       │
       ▼
  Service Layer  ─── VITE_USE_MOCK_DATA=true  ──▶  src/data/*.ts  (mock)
  (src/services/)
       │
       └─────────── VITE_USE_MOCK_DATA=false ──▶  Firebase / Stripe (live)
```

---

## Services Implemented

### 1. Firebase Authentication (`AuthContext.tsx`)

**What it does:** Manages user sign-up, login, Google sign-in, and session persistence.

**Files involved:**
- `src/contexts/AuthContext.tsx` — mock/live switching, Firestore user profile creation
- `src/services/authService.ts` — mock auth helpers (localStorage-backed)
- `src/firebase.ts` — Firebase app initialization with guard against missing keys

**Mock mode:** Uses `localStorage` to persist a mock user session. Supports switching users via the `DevMockUserSwitcher` component.

**Live mode:** Uses Firebase Authentication (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signInWithPopup`) and writes user profiles to Firestore `users/{uid}`.

**How to add a new auth provider:**
1. Import the provider from `firebase/auth` (e.g., `GithubAuthProvider`)
2. Add a `signInWithGithub()` function following the `signInWithGoogle()` pattern in `AuthContext.tsx`
3. Expose it on the `AuthContextType` interface

---

### 2. Firestore Data Services

All data services follow the same pattern:

```typescript
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const myService = {
  async getAll(): Promise<MyType[]> {
    if (USE_MOCK_DATA) return mockData;
    try {
      // Firestore query
    } catch {
      return mockData; // automatic fallback
    }
  }
};
```

| Service | Firestore Collection | File |
|---------|---------------------|------|
| `productService` | `products` | `src/services/productService.ts` |
| `businessService` | `businesses` | `src/services/businessService.ts` |
| `offerService` | `communityPosts` | `src/services/offerService.ts` |
| `messageService` | `messageThreads`, `messages` | `src/services/messageService.ts` |
| `eventService` | `events` | `src/services/eventService.ts` |
| `onboardingService` | `onboarding` | `src/services/onboardingService.ts` |

**How to add a new Firestore collection:**
1. Create `src/data/mockMyResource.ts` with sample data and types
2. Create `src/services/myResourceService.ts` following the pattern above
3. Export from `src/services/index.ts`
4. Add Firestore security rules in `firestore.rules`

---

### 3. Stripe Payment Service (`stripePaymentService.ts`)

**What it does:** Processes payments via Stripe Checkout (hosted page) or card-element flow.

**Files involved:**
- `src/services/stripePaymentService.ts` — frontend service, calls Cloud Functions
- `src/services/paymentService.ts` — `IPaymentService` interface and shared types
- `src/services/mockPaymentService.ts` — mock implementation for dev/test
- `functions/src/index.ts` — Cloud Functions: `createCheckoutSession`, `stripeWebhook`

**Mock mode:** Delegates all calls to `mockPaymentService` (simulated delays, fake IDs).

**Live mode:** Calls Firebase Cloud Functions via `httpsCallable`. The secret key never touches the frontend — all price calculations happen server-side.

**Primary checkout flow (recommended):**
```typescript
const session = await stripePaymentService.createCheckoutSession(orderData);
window.location.href = session.url; // redirect to Stripe-hosted page
```

**How to add a new payment method:**
1. Add the method to `IPaymentService` in `paymentService.ts`
2. Implement it in both `mockPaymentService.ts` and `stripePaymentService.ts`
3. Add the corresponding Cloud Function in `functions/src/index.ts`

---

### 4. Firebase Storage (`storageService.ts`)

**What it does:** Handles file uploads for verification documents, product images, and business logos.

**Files involved:**
- `src/services/storageService.ts`

**Mock mode:** Returns a `blob:` URL from `URL.createObjectURL()` — no network call.

**Live mode:** Uploads to Firebase Storage and returns a permanent download URL.

**Storage paths:**
```
onboarding/{memberId}/docs/{timestamp}_{filename}   — verification docs
products/{businessId}/{productId}/{timestamp}_{filename}  — product images
businesses/{businessId}/logo/{timestamp}_{filename} — business logos
```

**How to add a new upload type:**
```typescript
export async function uploadMyFile(id: string, file: File): Promise<UploadResult> {
  if (USE_MOCK_DATA) {
    return { url: URL.createObjectURL(file), path: `my-collection/${id}/${file.name}` };
  }
  const path = `my-collection/${id}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return { url: await getDownloadURL(storageRef), path };
}
```

---

### 5. MessagesPage Service Integration

**What it does:** `MessagesPage` now uses `messageService` instead of inline mock data.

**Files involved:**
- `src/components/MessagesPage.tsx` — rewritten to use `messageService` + `useAuth`
- `src/services/messageService.ts` — unchanged (already complete)
- `src/__tests__/components/MessagesPage.test.tsx` — 11 tests covering all interactions

**Key change:** The component now calls `messageService.getAllThreads()`, `getMessagesByThreadId()`, `markThreadAsRead()`, and `sendMessage()` — making it ready for real-time Firestore updates in a future iteration.

---

## Environment Configuration

| Variable | Dev (`.env.development`) | Production (`.env.production`) |
|----------|--------------------------|-------------------------------|
| `VITE_USE_MOCK_DATA` | `true` | `false` |
| `VITE_FIREBASE_API_KEY` | _(not needed)_ | Set via CI/CD secret |
| `VITE_STRIPE_PUBLISHABLE_KEY` | _(not needed)_ | Set via CI/CD secret |

---

## Testing

All services have unit tests in `src/__tests__/services/`:

```bash
pnpm test --run src/__tests__/services/
```

Tests cover both mock mode (no network calls) and live mode (mocked Firebase/Stripe SDKs).

---

## What's Next (Phase 4)

Phase 4 is **Content Strategy & Copywriting** — finalizing all text copy across the platform now that the functionality is locked in. See `docs/ROADMAP.md` for details.
