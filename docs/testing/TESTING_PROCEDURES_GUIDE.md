# Testing Procedures Guide

**Date**: January 30, 2026  
**Repository**: https://github.com/bharris133/unity-collective  
**Status**: ✅ Up-to-date

---

## 1. Overview

This guide is the **single source of truth** for all testing procedures in the Unity Collective project. It covers automated testing, visual testing, and data source testing.

---

## 2. Automated Testing

The project uses **Vitest** for unit and integration testing.

### **Running Tests**

To run all automated tests, use the following command:

```bash
pnpm test
```

To run tests in watch mode (re-runs on file changes):

```bash
pnpm run test:watch
```

### **Writing Tests**

-   Test files are located in `src/__tests__/`.
-   Follow the existing patterns in the test files.
-   Use **React Testing Library** for component testing.
-   Aim for high test coverage for all new features.

---

## 3. Visual Testing

Visual testing is a manual process to ensure the application looks and feels correct. It should be performed after any significant UI changes.

### **Checklist**

A comprehensive visual testing checklist is available here:

**[➡️ Visual Testing Checklist](./VISUAL_TESTING_CHECKLIST.md)**

Always refer to this checklist to ensure all key areas are covered.

### **Process**

1.  **Start the dev server** with mock data:
    ```bash
    pnpm run dev
    ```

2.  **Open the application** in a browser.

3.  **Go through the checklist**, verifying each item.

4.  **Test on multiple screen sizes** using your browser's developer tools.

---

## 4. Data Source Testing

It is critical to test that the application works correctly with both mock and live data.

### **Data Switching**

For detailed instructions on how to switch between data sources, see the official guide:

**[➡️ Data Source Switching Guide](../development/DATA_SOURCE_SWITCHING_GUIDE.md)**

### **Testing Scenarios**

| Scenario | `VITE_USE_MOCK_DATA` | Firebase Credentials | Expected Outcome |
|---|---|---|---|
| **Mock Data** | `true` | N/A | App runs with mock data |
| **Live Data** | `false` | Valid | App runs with live Firebase data |
| **Fallback** | `false` | Invalid | App falls back to mock data |

Always test all three scenarios to ensure the data layer is robust.

### **Mock Authentication Testing**

For detailed instructions on testing with different user roles, see the official guide:

**[➡️ Mock Authentication System Guide](./MOCK_AUTHENTICATION_GUIDE.md)**

---

This centralized guide should be the single source of truth for all testing procedures. All other documents should reference this guide instead of duplicating the information.
