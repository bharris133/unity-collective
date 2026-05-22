# Unity Collective — Phase 3 Project Plan

## Overview
Phase 3 transitions the Unity Collective platform from a fully functional, in-memory mock architecture to a live production environment. The core objective is to replace the mock data stores and authentication stubs with real Firebase and Stripe integrations, making the platform ready for real users and transactions.

This plan is structured in strict adherence to the project's `Guidelines.md` principles: **Think Before Coding**, **Simplicity First**, **Surgical Changes**, and **Goal-Driven Execution**.

## Objectives
1. **Production Authentication:** Replace the mock user switcher with real Firebase Authentication (Sign Up, Login, Password Reset).
2. **Persistent Data:** Replace the in-memory `mockOnboarding`, `mockUsers`, and `mockProducts` stores with live Firestore reads and writes.
3. **Asset Storage:** Implement Firebase Storage for business logos, verification documents, and product images.
4. **Live Payments:** Activate the existing Stripe payment stub to process real transactions.

## Deliverables & Execution Plan

Following the **Goal-Driven Execution** principle, the work is broken down into verifiable steps.

### 1. Firebase Authentication Integration
**Goal:** Users can securely register, log in, and maintain sessions using Firebase Auth.

**Execution Steps:**
1. Initialize Firebase Auth in the project configuration → verify: Firebase app initializes without errors.
2. Update `authService.ts` to wrap Firebase Auth methods (createUserWithEmailAndPassword, signInWithEmailAndPassword) → verify: Methods return expected Firebase user objects.
3. Update `AuthContext.tsx` to listen to Firebase auth state changes instead of mock state → verify: `useAuth` hook correctly reflects logged-in/logged-out state.
4. Build/Update Login and Registration UI components to wire to the new service → verify: User can successfully create an account and log in via the UI.

**Simplicity First Check:** Do not implement complex OAuth providers (Google, Apple) unless explicitly requested. Stick to Email/Password for the MVP.

### 2. Firestore Integration (Data Persistence)
**Goal:** Business profiles, onboarding states, and product listings persist across sessions in a live database.

**Execution Steps:**
1. Define Firestore schema and security rules for Users, Businesses, and Products → verify: Rules allow read/write only for authorized users.
2. Update `onboardingService.ts` to read/write from Firestore instead of `mockOnboarding.ts` → verify: Onboarding wizard progress saves to Firestore and loads correctly on refresh.
3. Update `productService.ts` to read/write from Firestore instead of `mockProducts.ts` → verify: Adding/editing products in the Member Dashboard updates Firestore.
4. Update Admin Panel to fetch pending verifications from Firestore → verify: Admin can see live submissions and approve/reject them, updating the Firestore document.

**Surgical Changes Check:** The mock architecture was designed with a Strategy Pattern. We will swap the implementation inside the service files without altering the React components or hooks that consume them.

### 3. Firebase Storage Integration
**Goal:** Users can upload real images and documents, replacing static local assets.

**Execution Steps:**
1. Configure Firebase Storage bucket and security rules → verify: Authenticated users can upload files.
2. Implement an upload utility function in `storageService.ts` → verify: Function successfully uploads a file and returns a public URL.
3. Wire the document upload step in the Onboarding Wizard to the storage service → verify: Uploaded verification documents are saved to Firebase and the URL is stored in Firestore.
4. Wire the product image upload in the Member Dashboard to the storage service → verify: Product images are saved to Firebase and render correctly in the marketplace.

### 4. Stripe Payment Activation
**Goal:** The marketplace can process real financial transactions.

**Execution Steps:**
1. Configure Stripe API keys in environment variables → verify: Keys load correctly in the application.
2. Update the existing Stripe stub in `paymentService.ts` to call the live Stripe API (or Stripe Test Mode) → verify: Checkout flow generates a valid Stripe session.
3. Implement a basic webhook handler (if necessary for order fulfillment) → verify: Successful payments update the order status in Firestore.

**Think Before Coding Check:** Before implementing webhooks, we must confirm if synchronous client-side confirmation is sufficient for the MVP, to avoid over-engineering the payment flow.

## Conclusion
By following this plan, Phase 3 will surgically replace the mock layer with production services, resulting in a fully functional, live platform ready for beta testing.
