## 1. What it Does

The Authentication feature manages user login, registration, and session state across the application. It uses Firebase Authentication as the backend service and provides a React Context to make the current user's information available throughout the app. This feature is essential for personalizing the user experience and securing access to certain features (e.g., creating offers, messaging).

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/contexts/AuthContext.jsx` | Provides the `AuthProvider` component and the `useAuth` hook, which manage and expose the current user's authentication state. |
| `src/firebase.js` | Contains the Firebase configuration and initialization (not yet created or configured). |

## 3. How to Make Changes

### **Changing the Login/Registration Flow**

The login and registration logic would be in the `AuthContext.jsx` file, specifically in the `login` and `register` functions. You can modify these to add additional validation, handle errors differently, or integrate with a different authentication provider.

```jsx
// In src/contexts/AuthContext.jsx

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCredential.user);
  } catch (error) {
    console.error('Login failed:', error);
    // Add custom error handling here
  }
};
```

### **Adding User Profile Information**

If you want to store additional user information (e.g., display name, profile picture), you can:

1.  **Store this information in Firestore** when the user registers.
2.  **Fetch this information** in the `AuthContext` when the user logs in.
3.  **Add it to the `currentUser` state** so it is available throughout the app.

## 4. How to Add Items

### **Adding a Protected Route**

To restrict access to a page (e.g., only logged-in users can access the "Create Offer" page), you can create a `ProtectedRoute` component that checks if the user is authenticated.

```jsx
// In src/App.jsx or a new file like src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Then use it in your routes:
<Route path="/offers/create" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
```

### **Adding a Logout Button**

To add a logout button to the navigation, you can:

1.  **Import the `useAuth` hook** in the `Navigation` component.
2.  **Get the `logout` function** from the hook.
3.  **Add a button** that calls `logout`.

```jsx
// In src/components/Navigation.jsx

import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { currentUser, logout } = useAuth();

  return (
    <nav>
      {currentUser && (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}
```
