# [Unity Collective] Development Roadmap

## Phase 1: Foundation & Visual Identity (Completed)
- ✅ Core platform architecture (React, TypeScript, Vite)
- ✅ Mock authentication system
- ✅ Payment service architecture (Mock + Stripe stub)
- ✅ Global Pan-African Dark Theme redesign
- ✅ Feature showcase page

## Phase 2: End-to-End Business Onboarding (Next)
**Goal:** Prove the platform works end-to-end by setting up an actual business from registration to product listing.

### Key Objectives:
1. **Vendor Registration Flow:** Create the UI and logic for a new business to join the platform.
2. **Business Profile Setup:** Allow vendors to input their details (name, description, category, location, images).
3. **Product Management:** Enable vendors to add, edit, and delete products in their storefront.
4. **Integration Testing:** Verify that a newly onboarded business appears correctly in the Business Directory and its products appear in the Marketplace.

### Files to Create/Modify:
- `src/pages/VendorRegistrationPage.tsx`
- `src/pages/VendorDashboard.tsx`
- `src/components/vendor/ProductManager.tsx`
- `src/services/vendorService.ts`

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

*Note: Content strategy is intentionally deferred until Phase 3 is complete to avoid rewriting copy for features that may change during development.*
