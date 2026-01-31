# Unity Collective - Comprehensive Debugging & Testing Primer

## 🎯 Your Mission

Your primary goal is to debug the blank page issue, verify all functionality, and ensure the application is stable after the recent refactoring. To do this effectively, you must first familiarize yourself with the codebase and feature architecture.

This primer is structured in two phases. Complete them in order.

---

## Phase 1: Codebase Familiarization & Context

**Objective**: Understand the project's architecture, the purpose of its features, and the recent changes that led to the current bug. **Do not start debugging until you have reviewed these files.**

### Step 1: Understand the Documentation Structure

First, understand how the project documentation is organized. This will help you find information efficiently.

- **Read**: `docs/README.md` - This file is the master index for all project documentation.

### Step 2: Review the Recent Refactoring

The current bug was introduced during a major refactoring. Understanding what changed is critical.

- **Read**: `docs/refactoring/REFACTORING_IMPLEMENTATION_SUMMARY.md` - This document details the extraction of page components and the integration of the data service layer, which are the direct causes of the current issue.

### Step 3: Learn the Core Features

To test the application properly, you must understand how its core features are designed to work. The following documents explain the purpose, files involved, and modification instructions for each key feature.

- **Read**: `docs/features/README.md` - This explains the purpose and structure of all feature documents.
- **Read**: `docs/features/homepage.md` - The homepage is the most likely source of the current bug.
- **Read**: `docs/features/marketplace.md` - This is directly related to the `MarketplaceContext` and `productService` changes.
- **Read**: `docs/features/business-directory.md` - This is one of the pages that was extracted and needs to be tested.
- **Read**: `docs/features/authentication.md` - Understanding the authentication flow is crucial for testing user-specific features.

### Step 4: Understand the Data Layer

The refactoring included changes to how data is fetched. Review the following to understand the data service abstraction.

- **Read**: `docs/development/DATA_SWITCHING_SUMMARY.md` - Explains how to switch between mock data and Firebase.

---

## Phase 2: Debugging, Testing & Verification

**Objective**: Apply your contextual understanding from Phase 1 to identify and fix the bug, then conduct thorough testing.

### ⚠️ The Issue

- **Problem**: The application builds successfully but renders a **blank white page**.
- **Likely Cause**: A JavaScript runtime error, probably in `HomePage.jsx` or a related component, is preventing React from mounting.

### Step 1: Debug the Blank Page (CRITICAL)

1.  Start the dev server: `pnpm run dev`
2.  Open your browser to `http://localhost:5173`
3.  Open the **DevTools Console (F12)**.
4.  **Identify the JavaScript error message.** It will tell you the file and line number.
5.  Navigate to the file and fix the error. It is likely a missing import (`import React from 'react';`), a typo, or an undefined variable.

### Step 2: Verify All Page Routes

Once the homepage is rendering, manually navigate to every primary route to ensure they all load without errors.

-   `/`
-   `/community`
-   `/directory`
-   `/marketplace`
-   `/education`
-   `/media`
-   `/about`

### Step 3: Verify Data Service Integration

1.  Navigate to the `/marketplace` page.
2.  Confirm that product data is being displayed.
3.  Review `src/contexts/MarketplaceContext.tsx` and `src/services/productService.ts` to ensure the data flow is correct.

### Step 4: Run Automated Tests

Finally, run the automated test suite to catch any regressions.

1.  Execute the test script: `pnpm test:run`
2.  Ensure all 112 tests pass.
3.  If any tests fail, analyze the output and fix the underlying issue.

---

## 🗂️ Key Files for Debugging

-   **`/src/App.jsx`**: The main application component containing the router and context providers.
-   **`/src/pages/HomePage.jsx`**: The most likely source of the bug.
-   **`/src/contexts/MarketplaceContext.tsx`**: Where the new data service is integrated.
-   **`/src/services/productService.ts`**: The data service itself.
-   **`/package.json`**: Contains all project scripts (`dev`, `test:run`).

---

## ✅ Success Criteria

-   [ ] **Familiarization Complete**: All documents in Phase 1 have been reviewed.
-   [ ] **Bug Fixed**: The application homepage loads correctly without a blank screen.
-   [ ] **No Console Errors**: The browser console is free of red error messages.
-   [ ] **Routes Verified**: All primary page routes load successfully.
-   [ ] **Data Service Verified**: The marketplace page displays products loaded via the `productService`.
-   [ ] **Tests Pass**: The `pnpm test:run` command completes with all tests passing.

---

## 🚀 Getting Started

```bash
# 1. Navigate to the project directory
cd /home/ubuntu/unity-collective-fresh

# 2. Begin Phase 1: Read the specified documentation to build context.

# 3. Once familiarized, begin Phase 2: Start the dev server
pnpm run dev

# 4. Follow the debugging and testing steps outlined above.

# 5. After all checks pass, commit your work.
git add .
git commit -m "fix: Resolve blank page runtime error and verify all tests"
git push
```

By following this two-phase approach, you will have the necessary context to not only fix the bug but also to understand its root cause within the broader application architecture, ensuring a more robust and reliable solution.

*Last Updated: January 30, 2026*
