# Unity Collective - Mock Data Guide

This document explains how the Unity Collective application uses mock data for development, testing, and visual review. Understanding this is key to running the app locally without a full backend setup.

## 1. Overview of Data Sources

The application uses a hybrid approach to data:

-   **Mock Data (Hardcoded)**: The majority of the application is powered by hardcoded sample data. This allows for rapid UI development, visual review, and testing without requiring a live database connection.
-   **Backend Integration (Firebase)**: Certain features, specifically those requiring secure operations like user authentication and payment processing, are designed to connect to a Firebase backend. However, the current configuration uses placeholder credentials, meaning it is not connected to a live backend.

## 2. Where Mock Data is Used

Almost every major feature you can see in the live demo runs on mock data. This is intentional and allows for a complete visual review of the user interface.

| Feature | Component/File | Data Source |
| :--- | :--- | :--- |
| **Homepage Content** | `src/App.jsx` | `featuredBusinesses`, `upcomingEvents`, `communityStats` constants are hardcoded. |
| **Business Directory** | `src/App.jsx` | Uses the same `featuredBusinesses` constant. |
| **Marketplace Products** | `src/contexts/MarketplaceContext.tsx` | The `sampleProducts` array is hardcoded directly in the context. |
| **Community Offers** | `src/components/OffersPage.tsx` | The `mockOffers` array is hardcoded within the component. |
| **Community Messages** | `src/components/MessagesPage.tsx` | The `mockThreads` and `mockMessages` objects are hardcoded. |

As the comments in the code indicate (e.g., `// Mock offers data (will be replaced with Firestore)`), this data is intended to be replaced by live data from a Firestore database in a full production environment.

## 3. The Exception: Real Backend Integration

The only feature that is wired to a real backend function is the **checkout process**.

-   **File**: `src/components/Checkout.tsx`
-   **Functionality**: This component uses Firebase's `httpsCallable` function to attempt to call a backend cloud function named `createStripeCheckout`.

Because the app is not connected to a live Firebase project, clicking the final checkout button will result in a console error. **This is expected behavior** in the current state.

## 4. How to Run the App for Visual Review

You are absolutely correct—you can and should use the mock data to run the app for visual review. Since the vast majority of the UI is powered by this data, you can explore almost the entire application without a backend.

Follow these simple steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/bharris133/unity-collective.git
    cd unity-collective
    ```

2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

3.  **Run the Development Server**:
    ```bash
    pnpm run dev
    ```

4.  **Open Your Browser**: Navigate to `http://localhost:5173`.

That's it! You can now click through the entire application—visit the marketplace, add items to the cart, browse the business directory, view the offers page, and see the messaging interface. All of this will work perfectly using the built-in mock data.

## 5. Conclusion

-   **Yes, the app uses mock data** for nearly all of its visual components.
-   **Yes, you can use this mock data to run the app** for a complete visual review.
-   The only part that won't work is the final step of the payment checkout, which requires a live Firebase and Stripe setup as detailed in the `DEPLOYMENT_GUIDE.md`.

This setup is ideal for making UI changes, testing component behavior, and ensuring the application looks and feels right before connecting it to a live production backend.
