# Unity Collective - Data Source Switching Guide

This guide explains how to easily switch between using local mock data and a live Firebase backend for development. This allows you to develop UI components quickly with mock data and then test against a real backend with a simple configuration change.

## The `VITE_USE_MOCK_DATA` Environment Variable

The entire data source switching mechanism is controlled by a single environment variable:

**`VITE_USE_MOCK_DATA`**

This variable is located in your `.env` file in the root of the project.

-   **To use mock data**: `VITE_USE_MOCK_DATA=true`
-   **To use Firebase**: `VITE_USE_MOCK_DATA=false`

### How it Works

When you start the development server (`pnpm run dev`), Vite loads the environment variables from the `.env` file. Our data services then check the value of `VITE_USE_MOCK_DATA` to decide whether to return hardcoded mock data or make a live call to Firebase.

## How to Switch Data Sources

### **Step 1: Configure Your `.env` File**

1.  If you don’t have a `.env` file, create one by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```

2.  Open the `.env` file and find the `VITE_USE_MOCK_DATA` variable.

### **Step 2: Choose Your Data Source**

#### **Option A: Use Mock Data (Default)**

This is the recommended setting for most UI development and visual review.

1.  Ensure your `.env` file has:
    ```
    VITE_USE_MOCK_DATA=true
    ```

2.  Start the development server:
    ```bash
    pnpm run dev
    ```

3.  The application will now run using the mock data from the `src/data/` directory. You will see messages in the browser console indicating that mock data is being used (e.g., `📦 Using mock data for products`).

#### **Option B: Use Firebase Data**

Use this option to test with a real backend, assuming you have a Firebase project set up.

1.  **Fill in your Firebase credentials** in the `.env` file. You can get these from your Firebase project settings.
    ```
    VITE_FIREBASE_API_KEY=your-api-key-here
    VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    # ... and so on
    ```

2.  **Set the mock data variable to `false`**:
    ```
    VITE_USE_MOCK_DATA=false
    ```

3.  Restart the development server:
    ```bash
    pnpm run dev
    ```

4.  The application will now attempt to fetch data from your Firebase project. You will see messages in the browser console indicating a Firebase connection (e.g., `🔥 Fetching products from Firebase`).

### **Important Note on Fallback**

If `VITE_USE_MOCK_DATA` is set to `false` but the application fails to connect to Firebase (e.g., due to incorrect credentials or network issues), **it will automatically fall back to using the mock data**. This ensures that the application remains usable even if the backend connection fails, and you will see a warning in the console (e.g., `⚠️ Falling back to mock data`).

## The Data Service Abstraction Layer

This seamless switching is made possible by a **data service abstraction layer** located in the `src/services/` directory.

-   **`businessService.ts`**
-   **`productService.ts`**
-   **`offerService.ts`**

Each service provides a set of functions (e.g., `getAll()`, `getById()`) that components can call to get data. The service itself contains the logic to check the `VITE_USE_MOCK_DATA` variable and decide where to fetch the data from.

### Example: `productService.getAll()`

```typescript
// src/services/productService.ts

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const productService = {
  async getAll(): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      // Return mock data
      return Promise.resolve(mockProducts);
    } else {
      // Fetch from Firebase
      // ... (try/catch block)
    }
  }
};
```

By using this service layer, our components don’t need to know where the data is coming from. They simply call `productService.getAll()` and receive a promise that resolves with the product data, whether it’s from a local file or a remote database.

This architecture makes the codebase cleaner, easier to maintain, and highly flexible for both development and production environments.
