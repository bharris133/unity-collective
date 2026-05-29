# Unity Collective — Comprehensive Local Testing Script

This document provides a step-by-step manual testing script to verify all completed functionality in the Unity Collective platform up to Phase 3 (Firebase Integration).

## Prerequisites

1. Ensure you are on the `main` branch and fully up to date:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## Test Suite 1: Mock Mode (No Firebase Credentials Required)

This suite verifies the core UI, routing, and state management using the in-memory mock data.

**Setup:** Ensure `.env.development` has `VITE_USE_MOCK_DATA=true` (this is the default on `main`).

### 1.1 Core Navigation & UI
- [ ] **Home Page:** Verify the hero section, featured businesses, and footer render correctly.
- [ ] **Theme:** Verify the Pan-African dark theme (black, gold, green, red accents) is applied consistently.
- [ ] **Routing:** Click through the main navigation links (Directory, Marketplace, Community, Education, Media, About) and verify they load without errors.

### 1.2 Authentication & Onboarding (Mock)
- [ ] **Sign Up:** Click "Join Our Community", fill out the form, and submit.
- [ ] **Onboarding Wizard:** Verify redirection to `/onboarding`.
- [ ] **Wizard Steps:** Complete the 4-step wizard (Profile, Business Details, Verification, Complete).
- [ ] **Verification Upload:** On step 3, verify the file upload input works and shows a success state.
- [ ] **Completion:** Verify the final "You're In the Collective!" screen appears.

### 1.3 Member Dashboard (Mock)
- [ ] **Access:** Navigate to `/dashboard`.
- [ ] **Profile:** Verify the business profile data matches what was entered in onboarding.
- [ ] **Products:** Add a new product. Verify it appears in the list immediately.
- [ ] **Delete Product:** Delete the product. Verify it is removed from the list.

### 1.4 Admin Panel (Mock)
- [ ] **Switch User:** Click the Dev Mock Gear (bottom right) and select **Admin User**.
- [ ] **Access:** Navigate to `/admin`.
- [ ] **Verification Queue:** Verify the "Business Verifications" tab loads without a blank screen.
- [ ] **Pending Badge:** Verify the red pending count badge appears in the sidebar.
- [ ] **Approve/Reject:** Click "Approve" on a pending application. Verify the status updates to Verified and the pending count decreases.

---

## Test Suite 2: Live Firebase Mode

This suite verifies the Phase 3 integration with Firebase Auth, Firestore, and Storage.

**Setup:** 
1. Copy `.env.example` to `.env.local`.
2. Fill in your Firebase project credentials.
3. Set `VITE_USE_MOCK_DATA=false` in `.env.local`.
4. Clear your browser's `localStorage` for `http://localhost:5173` to remove any stale mock overrides.
5. Restart the dev server.

### 2.1 Firebase Authentication
- [ ] **Sign Up:** Click "Join Our Community" and sign up with a new test email.
- [ ] **Verification:** Check the Firebase Console → Authentication tab. Verify the new user exists.

### 2.2 Firestore — Onboarding & Profiles
- [ ] **Wizard:** Complete the onboarding wizard as the new user.
- [ ] **Verification:** Check the Firebase Console → Firestore Database. Verify a document was created under `onboarding/{uid}`.
- [ ] **Dashboard:** Navigate to `/dashboard`. Verify the profile data loads from Firestore.

### 2.3 Firebase Storage — Document Uploads
- [ ] **Upload:** During the onboarding wizard (Step 3), upload a test document (e.g., a PDF or image).
- [ ] **Verification:** Check the Firebase Console → Storage. Verify the file exists under `onboarding/{uid}/docs/`.

### 2.4 Firestore — Product Management
- [ ] **Add Product:** On the dashboard, add a new product.
- [ ] **Verification:** Check Firestore. Verify a document was created in the `products` collection.
- [ ] **Delete Product:** Delete the product from the dashboard.
- [ ] **Verification:** Check Firestore. Verify the document was removed.

---

## Troubleshooting

- **Blank Screen on Admin Panel:** Ensure you have pulled the latest `main` branch. This was fixed in PR #30 and PR #31.
- **Always in Mock Mode:** Ensure you have cleared `localStorage` and that `.env.local` has `VITE_USE_MOCK_DATA=false`.
- **Firebase Permission Denied:** Check your `firestore.rules` and `storage.rules` to ensure they allow authenticated users to read/write their own data.
