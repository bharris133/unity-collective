# Unity Collective - Developer Guide

This guide provides technical documentation for developers working on the Unity Collective platform. It covers the architecture, code structure, and best practices for making changes and adding new features.

## 1. Architecture Overview

The Unity Collective platform is a modern web application built with a robust and scalable technology stack.

### **Technology Stack**

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Frontend**  | React 19, TypeScript (fully migrated), Vite, React Router         |
| **Styling**   | TailwindCSS, Lucide React (icons)                |
| **Backend**   | Firebase (Authentication, Firestore, Cloud Functions) |
| **Payments**  | Stripe                                           |
| **Testing**   | Vitest, React Testing Library                    |

### **Data Flow**

The application follows a standard client-server architecture where the frontend (React app) interacts with the backend services (Firebase) for data persistence and secure operations.

> **User Action** → **React Component** → **React Context** → **Firebase SDK** → **Cloud Firestore / Functions**

State management is handled through React Contexts, providing a clean and efficient way to manage global state for authentication, marketplace data, and other shared concerns.

## 2. Data Sources (Mock vs. Live)

The application can be run with either local mock data or a live Firebase backend. This is controlled by an environment variable and is designed to make UI development fast and efficient.

For complete instructions on how to configure and test this feature, please see the official guide:

**[➡️ Data Source Switching Guide](./DATA_SOURCE_SWITCHING_GUIDE.md)**

**[➡️ ESLint Configuration Guide](./ESLINT_GUIDE.md)**

### **Firebase Setup**

For detailed instructions on setting up Firebase for this project, see the official guide:

**[➡️ Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)**

### **Testing**

For comprehensive testing procedures and guidelines, see the official guide:

**[➡️ Testing Procedures Guide](../testing/TESTING_PROCEDURES_GUIDE.md)**

## 3. Code Structure

The project is organized into a `src` directory for the frontend application and a `functions` directory for the Firebase Cloud Functions. All frontend code is written in TypeScript.

### **Directory Overview**

```
unity-collective/
├── src/
│   ├── components/          # Reusable and page-level components
│   ├── contexts/            # React Contexts for state management
│   ├── types/               # TypeScript type definitions
│   ├── __tests__/           # All test files for the application
│   ├── assets/              # Static assets (images, logos)
│   ├── App.jsx              # Main application component with routing
│   └── main.jsx             # Application entry point
├── functions/               # Firebase Cloud Functions backend
├── .env.example             # Example environment variables
├── package.json             # Project dependencies and scripts
└── vite.config.js           # Vite configuration
```

### **Component Architecture**

A key architectural aspect of this project is that several page-level components are defined **inline within `src/App.jsx`**. This was a design choice for smaller, self-contained pages. More complex pages are extracted into their own files within `src/components/`.

**Inline Page Components (in `App.jsx`):**
- `HomePage`
- `CommunityPage` (Placeholder)
- `BusinessDirectoryPage`
- `EducationPage` (Placeholder)
- `MediaCenterPage` (Placeholder)
- `AboutPage` (Placeholder)

**Extracted Page Components (in `src/components/`):**
- `MarketplacePage.jsx`
- `VendorStorefront.tsx`
- `ProductDetail.tsx`
- `Checkout.tsx`
- `OrderSuccess.tsx`
- `OffersPage.tsx`
- `CreateOffer.tsx`
- `MessagesPage.tsx`

**Missing Components:**
- As of the last review, the `FavoritesPage` component is not implemented, though a route exists for it in `App.jsx`. This is a known issue to be addressed.

## 3. Making Changes

Follow these guidelines when modifying the codebase.

### **Modifying an Existing Component**

1.  **Locate the Component**: Determine if the component is defined inline in `App.jsx` or as a separate file in `src/components/`.
2.  **Make Your Changes**: Apply your updates to the component logic and JSX.
3.  **Update Types**: If you change data structures, update the corresponding types in the `src/types/` directory.
4.  **Run Tests**: Ensure all existing tests continue to pass by running `pnpm test`.

### **Updating Styles with TailwindCSS**

The project uses TailwindCSS for all styling. To make style changes, add or modify the utility classes in the `className` attribute of the JSX elements.

```tsx
// Example: Changing a button's background color and adding padding
<button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
  Submit
</button>
```

## 4. Adding a New Feature

Use the following workflow to add a new feature, such as the missing **Favorites Page**.

### **Step 1: Create the Component File**

Create a new file for your page component in the `src/components/` directory.

**`src/components/FavoritesPage.tsx`**

```tsx
import React from 'react';

const FavoritesPage: React.FC = () => {
  // TODO: Implement logic to fetch and display user's favorites
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">My Favorites</h1>
      {/* Placeholder for favorites list */}
      <p>Favorites functionality is under construction.</p>
    </div>
  );
};

export default FavoritesPage;
```

### **Step 2: Update the Main App Component**

Modify `src/App.jsx` to import and use the new component.

```jsx
// 1. Import the new component at the top of App.jsx
import FavoritesPage from './components/FavoritesPage';

// 2. Find the existing route definition for "/favorites"
// and ensure it renders your new component.
<Route path="/favorites" element={<FavoritesPage />} />
```

### **Step 3: Add State Management (if needed)**

If the feature requires global state, create or update a context in `src/contexts/`.

**`src/contexts/FavoritesContext.tsx`**

```tsx
// Example context for managing favorites
import React, { createContext, useContext, useState } from 'react';

interface FavoritesContextType {
  favorites: string[]; // Array of product IDs
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = (productId: string) => {
    setFavorites((prev) => [...prev, productId]);
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
```

Remember to wrap the application with the new provider in `App.jsx`.

### **Step 4: Write Tests**

Create a new test file in `src/__tests__/components/` to test the new component's rendering and behavior.

**`src/__tests__/components/FavoritesPage.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import FavoritesPage from '../../components/FavoritesPage';
import { describe, it, expect } from 'vitest';

describe('FavoritesPage Component', () => {
  it('renders the page title', () => {
    render(<FavoritesPage />);
    const titleElement = screen.getByRole('heading', { name: /My Favorites/i });
    expect(titleElement).toBeInTheDocument();
  });
});
```

### **Step 5: Commit and Push**

Once all tests pass and the feature is working as expected, commit your changes to Git.

## 5. Best Practices

- **TypeScript**: Use explicit types and avoid using `any` wherever possible.
- **Component Design**: Keep components small and focused on a single responsibility. Extract complex logic into custom hooks.
- **State Management**: Use React Context for global state and `useState` or `useReducer` for local component state.
- **Error Handling**: Implement graceful error handling for all asynchronous operations and API calls.

---

This guide provides a foundation for contributing to the Unity Collective project. For more specific questions, refer to the source code and the other documentation files. ✊🏿
