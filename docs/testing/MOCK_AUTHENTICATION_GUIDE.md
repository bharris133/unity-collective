# Mock Authentication System Guide

**Date**: January 30, 2026  
**Repository**: https://github.com/bharris133/unity-collective  
**Status**: ✅ Implemented and Ready for Testing

---

## 1. Overview

Unity Collective includes a comprehensive mock authentication system to facilitate testing of different user roles and authentication states without needing to connect to Firebase. This guide explains how to use and configure the mock authentication system.

---

## 2. Features

✅ **Multiple User Types** - Test as a regular user, vendor, or admin  
✅ **Runtime Switching** - Switch between mock and live Firebase auth at runtime  
✅ **User Impersonation** - Easily switch between different mock users  
✅ **Developer UI** - A floating UI for easy control during development  
✅ **Persistent State** - Mock user state is saved in localStorage  

---

## 3. How it Works

### **Data Switching Integration**

The mock authentication system is integrated with the existing data switching mechanism. It is enabled when `VITE_USE_MOCK_DATA` is set to `true` in your `.env` file.

### **Authentication Service**

`src/services/authService.ts` provides all authentication functions (`signIn`, `signUp`, `signOut`) with automatic fallback to mock implementations when mock mode is active.

### **AuthContext**

`src/contexts/AuthContext.tsx` is updated to handle both Firebase and mock authentication states, ensuring the entire application reacts correctly to the current authentication mode.

### **Developer UI**

`src/components/DevMockUserSwitcher.tsx` is a floating UI component that appears in development mode when mock data is enabled. It allows you to:

- Enable/disable mock authentication
- See the currently logged-in mock user
- Switch between different mock users
- Sign out

---

## 4. How to Use

### **Step 1: Enable Mock Data**

Make sure your `.env` file has `VITE_USE_MOCK_DATA=true`:

```bash
VITE_USE_MOCK_DATA=true
```

### **Step 2: Start the Dev Server**

```bash
pnpm run dev
```

### **Step 3: Use the Mock User Switcher**

When the application loads, you will see a purple settings icon in the bottom-right corner. Click it to open the Mock Auth Control panel.

**Mock Auth Control Panel:**

- **Toggle Switch**: Enable or disable mock authentication. Disabling it will switch to live Firebase authentication and require a page reload.
- **Current User**: Shows the currently logged-in mock user.
- **Switch User**: A dropdown to select and switch between different mock users (regular, vendor, admin).
- **Sign Out**: Logs out the current mock user.

### **Step 4: Test Different User Roles**

1. **Switch to "Vendor User"** - You should see vendor-specific UI elements.
2. **Switch to "Admin User"** - You should see the admin panel link in the navigation.
3. **Switch to "Regular User"** - You should see the standard user view.
4. **Sign Out** - You should see the unauthenticated view.

---

## 5. Mock User Data

Mock user data is defined in `src/data/mockUsers.ts`. You can add or modify users in this file to test different scenarios.

### **Available Mock Users**

| User | Role | Description |
|------|------|-------------|
| **John Doe** | user | Standard community member |
| **Sarah Johnson** | vendor | Business owner with a marketplace presence |
| **Admin User** | admin | Platform administrator |
| **Emily Chen** | user | Another standard user |
| **Mike Rodriguez** | vendor | Another business owner |

---

## 6. Architecture

### **Files Involved**

- **`src/data/mockUsers.ts`** - Mock user data definitions
- **`src/services/authService.ts`** - Authentication logic with mock support
- **`src/contexts/AuthContext.tsx`** - Manages authentication state
- **`src/components/DevMockUserSwitcher.tsx`** - Developer UI for switching users
- **`src/App.tsx`** - Renders the developer UI

### **Data Flow**

1. **`AuthContext`** checks if mock auth is enabled.
2. If enabled, it uses `authService` to get the current mock user from localStorage.
3. The **`DevMockUserSwitcher`** allows you to call `switchMockUser` in `authService`.
4. `switchMockUser` updates the current mock user in localStorage.
5. `AuthContext` listens for storage changes and updates the application state.

---

## 7. Troubleshooting

### **User Switcher Not Visible**

- Make sure `VITE_USE_MOCK_DATA` is `true` in your `.env` file.
- Make sure you are in development mode (`pnpm run dev`), not production.

### **User Not Changing**

- The page should automatically reload when you switch users. If not, manually reload the page.
- Check the browser console for any errors.

### **Switching to Live Firebase**

- Use the toggle in the Mock Auth Control panel to disable mock authentication.
- The page will reload, and you will be using live Firebase authentication.

---

This mock authentication system provides a powerful way to test different user roles and authentication states, making development and testing much more efficient.
