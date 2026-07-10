# [Unity Collective] Development Roadmap

## Phase 1: Foundation & Visual Identity (Completed)
- ✅ Core platform architecture (React, TypeScript, Vite)
- ✅ Mock authentication system
- ✅ Payment service architecture (Mock + Stripe stub)
- ✅ Global Pan-African Dark Theme redesign
- ✅ Feature showcase page

## Phase 2: End-to-End Business Onboarding (Completed)
**Goal:** Prove the platform works end-to-end by setting up an actual business from registration to product listing.

### Completed:
- ✅ **Business Onboarding Wizard (Lane B)** — 5-step guided flow (`/onboarding`) with step indicator, validation, and mock persistence
- ✅ **Black-Owned Verification Badge** — Pan-African gradient pill shown on `BusinessDetail` and `MemberDashboard`
- ✅ **Member Dashboard** — Product management (add/edit/delete) with redirect guards (`/dashboard`)
- ✅ **Admin Verification Flow (Lane A)** — Pending queue, review modal, Approve/Reject actions wired to `mockOnboarding` store; Pan-African dark theme applied to AdminPanel

### Documentation:
- `docs/ADMIN_VERIFICATION_FLOW.md`
- `docs/BUSINESS_ONBOARDING_WIZARD.md` (if created)

## Phase 3: Production-Ready Functionality
**Goal:** Transition from mock data to real backend services.

### Key Objectives:
1. **Firebase Integration:** Replace mock auth and data services with real Firebase Authentication and Firestore.
2. **Stripe Integration:** Implement the `stripePaymentService.ts` stub to process real transactions.
3. **Image Hosting:** Set up Firebase Storage or AWS S3 for user-uploaded images (business logos, product photos).

## Phase 4: Content Strategy & Copywriting
**Goal:** Finalize all text copy across the platform once the functionality is locked in.

### Key Objectives:
1. **Homepage Copy:** Refine the hero messaging, value propositions, and calls to action.
2. **About Page:** Write the official mission, vision, and history of [Unity Collective].
3. **Education & Media Centers:** Populate with initial real content or curated links.
4. **Transactional Emails:** Draft copy for welcome emails, order confirmations, and vendor approvals.
5. **Profile Page (`/profile`):** Build a dedicated `ProfilePage` component with editable display name, email, avatar, and role. Currently `/profile` redirects to `/dashboard` as a temporary fix (PR #40).

*Note: Content strategy is intentionally deferred until Phase 3 is complete to avoid rewriting copy for features that may change during development.*
