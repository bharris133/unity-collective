# Detailed Plan: Componentizing `App.jsx`

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. Objective

To refactor the monolithic `App.jsx` file into a collection of smaller, more manageable page components. This will improve code organization, maintainability, and developer experience.

## 2. Current State

- `App.jsx` is a 791-line file.
- It contains the main application router.
- It also contains the full implementation of the `HomePage`, `BusinessDirectoryPage`, and `CommunityHubPage` components.

## 3. Target State

- `App.jsx` will only contain the main application router and global context providers.
- All page-level components will be in their own files within a new `src/pages/` directory.
- The application will have the following file structure:

```
src/
├── pages/
│   ├── HomePage.jsx
│   ├── BusinessDirectoryPage.jsx
│   ├── CommunityHubPage.jsx
│   └── ... (other page components)
├── components/
│   └── ... (reusable components)
├── contexts/
│   └── ... (global contexts)
├── data/
│   └── ... (mock data)
├── services/
│   └── ... (data services)
└── App.jsx
```

## 4. Step-by-Step Implementation Plan

### Step 1: Create the `src/pages/` Directory

Create a new directory named `pages` inside the `src` directory.

```bash
mkdir src/pages
```

### Step 2: Create Page Component Files

Create the following new files inside the `src/pages/` directory:

- `HomePage.jsx`
- `BusinessDirectoryPage.jsx`
- `CommunityHubPage.jsx`

### Step 3: Move `HomePage` Logic

1.  **Cut the `HomePage` component logic** from `App.jsx`.
2.  **Paste the logic** into `src/pages/HomePage.jsx`.
3.  **Add necessary imports** to `HomePage.jsx` (e.g., `React`, UI components, mock data).
4.  **Export the `HomePage` component**.

### Step 4: Move `BusinessDirectoryPage` Logic

1.  **Cut the `BusinessDirectoryPage` component logic** from `App.jsx`.
2.  **Paste the logic** into `src/pages/BusinessDirectoryPage.jsx`.
3.  **Add necessary imports**.
4.  **Export the `BusinessDirectoryPage` component**.

### Step 5: Move `CommunityHubPage` Logic

1.  **Cut the `CommunityHubPage` component logic** from `App.jsx`.
2.  **Paste the logic** into `src/pages/CommunityHubPage.jsx`.
3.  **Add necessary imports**.
4.  **Export the `CommunityHubPage` component**.

### Step 6: Update `App.jsx`

1.  **Remove the `HomePage`, `BusinessDirectoryPage`, and `CommunityHubPage` component implementations** from `App.jsx`.
2.  **Import the new page components** from the `src/pages/` directory.
3.  **Update the router** to use the imported page components.

```javascript
// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import contexts and navigation
import { AuthProvider } from './contexts/AuthContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import Navigation from './components/Navigation';

// Import page components
import HomePage from './pages/HomePage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import CommunityHubPage from './pages/CommunityHubPage';
// ... other page imports

const App = () => {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={<BusinessDirectoryPage />} />
            <Route path="/hub" element={<CommunityHubPage />} />
            {/* ... other routes ... */}
          </Routes>
        </Router>
      </MarketplaceProvider>
    </AuthProvider>
  );
};

export default App;
```

## 5. Verification

After completing the refactoring, run the application and perform the following checks:

- The homepage loads correctly.
- The business directory page loads correctly.
- The community hub page loads correctly.
- All navigation links work as expected.
- There are no console errors.

## 6. Conclusion

This refactoring will significantly improve the structure and maintainability of the Unity Collective codebase. By following this plan, the process will be systematic and low-risk.
