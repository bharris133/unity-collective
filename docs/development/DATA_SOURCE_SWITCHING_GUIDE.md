# Data Source Switching Guide

**Date**: January 30, 2026  
**Repository**: https://github.com/bharris133/unity-collective  
**Status**: ✅ Up-to-date

---

## 1. Overview

The Unity Collective application is designed with a flexible data service layer that allows developers to seamlessly switch between using local mock data and a live Firebase backend. This guide is the **single source of truth** for how this system works and how to configure it.

---

## 2. How It Works

### **The Service Layer**

All data fetching is handled by services located in `src/services/`. These services provide a consistent API for components to request data, regardless of the source.

### **The Environment Variable**

The data source is controlled by a single environment variable in your `.env` file:

```
VITE_USE_MOCK_DATA=true
```

-   **`true`**: Use local mock data from `src/data/` (default for development)
-   **`false`**: Fetch live data from Firebase (requires credentials)

### **Automatic Fallback**

If `VITE_USE_MOCK_DATA` is set to `false` but the Firebase connection fails, the application will **automatically fall back** to using mock data. This ensures the app remains functional even if the backend is unavailable.

### **Console Indicators**

Check the browser console to see which data source is active:
-   `📦 Using mock data for [resource]`
-   `🔥 Fetching [resource] from Firebase`
-   `⚠️ Falling back to mock data`

---

## 3. How to Configure

### **Step 1: Create `.env` File**

If you don't have a `.env` file, create one from the example:

```bash
cp .env.example .env
```

### **Step 2: Set the Data Source**

Edit the `.env` file to choose your data source:

**For Mock Data (Recommended for UI Development):**
```
VITE_USE_MOCK_DATA=true
```

**For Live Firebase Data:**
```
VITE_USE_MOCK_DATA=false
```
*Note: You must also provide your Firebase credentials in the `.env` file for this to work.*

### **Step 3: Restart the Server**

After any change to the `.env` file, you must restart the development server:

```bash
pnpm run dev
```

---

## 4. Testing the Data Switch

### **Test 1: Mock Data**

1.  Set `VITE_USE_MOCK_DATA=true`
2.  Run `pnpm run dev`
3.  Navigate the application and verify mock data is displayed
4.  Check console for `📦 Using mock data` messages

### **Test 2: Live Data**

1.  Set `VITE_USE_MOCK_DATA=false` and configure Firebase credentials
2.  Run `pnpm run dev`
3.  Verify live data is displayed
4.  Check console for `🔥 Fetching from Firebase` messages

### **Test 3: Fallback**

1.  Set `VITE_USE_MOCK_DATA=false` with **invalid** Firebase credentials
2.  Run `pnpm run dev`
3.  Verify mock data is displayed (fallback)
4.  Check console for `⚠️ Falling back to mock data` messages

---

## 5. For Developers

### **Using Services in Components**

Always use the service layer to fetch data. Do not import from `src/data/` directly.

```typescript
// Correct way
import { businessService } from '../services';

useEffect(() => {
  const loadData = async () => {
    const businesses: Business[] = await businessService.getAll();
    // ...
  };
  loadData();
}, []);
```

### **Adding New Services**

Create new services in `src/services/` following the existing pattern. Ensure you add a mock data file in `src/data/` and implement the Firebase fetching logic.

---

This centralized guide is the single source of truth for data switching. All other documents should reference this guide instead of duplicating the information.
