# Mock Authentication Feature

**Feature Name**: Mock Authentication System  
**Date**: January 30, 2026  
**Status**: ✅ Implemented

---

## What This Feature Does

The Mock Authentication feature allows developers to test the Unity Collective application with different user roles (regular user, vendor, admin) without needing to connect to Firebase or create real user accounts. It integrates seamlessly with the existing data switching mechanism and provides a developer UI for easy user switching during development and testing.

---

## Files Involved

### **Core Files**

1. **`src/data/mockUsers.ts`**
   - Defines mock user data for different user types
   - Exports helper functions to retrieve users by email or UID

2. **`src/services/authService.ts`**
   - Provides authentication functions (`signIn`, `signUp`, `signOut`)
   - Implements mock authentication logic
   - Manages mock user state in localStorage
   - Provides functions to switch between mock users

3. **`src/contexts/AuthContext.tsx`**
   - Updated to support both Firebase and mock authentication
   - Listens for storage events to react to mock user changes
   - Provides `isMockMode` flag to components

4. **`src/components/DevMockUserSwitcher.tsx`**
   - Developer UI component for switching between mock users
   - Floating panel in the bottom-right corner
   - Only visible in development mode

5. **`src/App.tsx`**
   - Renders the `DevMockUserSwitcher` component

### **Documentation Files**

6. **`docs/testing/MOCK_AUTHENTICATION_GUIDE.md`**
   - User guide for the mock authentication system

7. **`docs/testing/TESTING_PROCEDURES_GUIDE.md`**
   - Updated to reference the mock authentication guide

---

## How to Make Changes

### **Adding a New Mock User**

1. Open `src/data/mockUsers.ts`
2. Add a new user object to the `mockUsers` record:

```typescript
export const mockUsers: Record<string, User & { password: string; role: 'user' | 'vendor' | 'admin' }> = {
  // ... existing users ...
  
  newUser: {
    uid: 'mock-user-003',
    email: 'new.user@example.com',
    password: 'password123',
    displayName: 'New User',
    firstName: 'New',
    lastName: 'User',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewUser',
    phoneNumber: '(555) 999-8888',
    address: '999 New St, Unity City, UC 12345',
    role: 'user',
    isVendor: false,
    createdAt: new Date('2024-06-01').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
};
```

3. Export the new user at the bottom of the file:

```typescript
export const {
  regularUser,
  vendorUser,
  adminUser,
  regularUser2,
  vendorUser2,
  newUser, // Add this
} = mockUsers;
```

4. The new user will automatically appear in the Mock User Switcher UI.

### **Changing Mock Authentication Logic**

1. Open `src/services/authService.ts`
2. Modify the `mockSignIn`, `mockSignUp`, or `mockSignOut` functions as needed.
3. For example, to add a delay to simulate network latency:

```typescript
const mockSignIn = async (email: string, password: string): Promise<User> => {
  console.log('🔐 Using mock authentication');
  
  // Increase delay from 500ms to 1000ms
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // ... rest of the function
};
```

### **Customizing the Developer UI**

1. Open `src/components/DevMockUserSwitcher.tsx`
2. Modify the JSX to change the appearance or behavior.
3. For example, to change the position:

```typescript
// Change from bottom-right to bottom-left
<div className="fixed bottom-4 left-4 z-50">
  {/* ... */}
</div>
```

---

## How to Add Items into the Scope

### **Adding More User Roles**

Currently, the system supports three roles: `user`, `vendor`, and `admin`. To add a new role:

1. **Update the User type** in `src/types/User.ts`:

```typescript
export interface User {
  // ... existing fields ...
  role?: 'user' | 'vendor' | 'admin' | 'moderator'; // Add new role
}
```

2. **Add mock users** with the new role in `src/data/mockUsers.ts`:

```typescript
moderatorUser: {
  uid: 'mock-moderator-001',
  email: 'moderator@unitycollective.com',
  password: 'moderator123',
  displayName: 'Moderator User',
  // ... other fields ...
  role: 'moderator',
},
```

3. **Update UI logic** in components that check user roles.

### **Adding User Preferences**

To add user preferences (e.g., theme, language) to mock users:

1. **Update the User type** in `src/types/User.ts`:

```typescript
export interface User {
  // ... existing fields ...
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
  };
}
```

2. **Add preferences** to mock users in `src/data/mockUsers.ts`:

```typescript
regularUser: {
  // ... existing fields ...
  preferences: {
    theme: 'light',
    language: 'en',
  },
},
```

3. **Use preferences** in your components:

```typescript
const { userProfile } = useAuth();
const theme = userProfile?.preferences?.theme || 'light';
```

### **Adding Authentication Events**

To track authentication events (e.g., login count, last login):

1. **Update `mockSignIn`** in `src/services/authService.ts`:

```typescript
const mockSignIn = async (email: string, password: string): Promise<User> => {
  // ... existing code ...
  
  const updatedUser = {
    ...userWithoutPassword,
    lastLoginAt: new Date().toISOString(),
    loginCount: (userWithoutPassword.loginCount || 0) + 1,
  };
  
  setCurrentMockUser(updatedUser);
  
  return updatedUser;
};
```

2. **Update the User type** to include the new fields.

---

This feature documentation serves as a primer for making changes and adding functionality to the mock authentication system.
