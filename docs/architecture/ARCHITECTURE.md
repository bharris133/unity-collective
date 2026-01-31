# Unity Collective - System Architecture

This document provides a detailed overview of the technical architecture of the Unity Collective platform. It is intended for developers and system architects to understand the key components and how they interact.

## Architecture Diagram

The following diagram illustrates the high-level architecture of the system, including the frontend application, state management, backend services, and external integrations.

![System Architecture Diagram](https://private-us-east-1.manuscdn.com/sessionFile/ZqkNXCZXLrr8vW98BTytnR/sandbox/0OjttxrZMhggslQdgiUTQh-images_1769490868667_na1fn_L2hvbWUvdWJ1bnR1L3VuaXR5LWNvbGxlY3RpdmUtcmVwby9hcmNoaXRlY3R1cmU.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWnFrTlhDWlhMcnI4dlc5OEJUeXRuUi9zYW5kYm94LzBPanR0eHJaTWhnZ3NsUWRnaVVUUWgtaW1hZ2VzXzE3Njk0OTA4Njg2NjdfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzVnVhWFI1TFdOdmJHeGxZM1JwZG1VdGNtVndieTloY21Ob2FYUmxZM1IxY21VLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qaH8dC9ibX9AAv7caYpHcGQPobE1PbSoc2cNb2qMbXwdiz0VRlZEzAP48ejL5NSncNzzaZ0-pS~sQiYwT0Yhi57bLaMEpo552gW8ehLIBGBMmRY-hinss~iyXwcadtIrfZZRfJh8QLcldOtifctff64NUb9eRDHL2Mke1zhzJols7RGFYXcCV03aNFoM~T6qC7vGdnb9fmJz1QNkkJvTmK~nHuFTm55IggJrOZhIbNEaVdGWwoihpBoBm~9hODkxo8CvOj~5EE9TF~ppNMDc3qoi5AGQjrHijtiQaDVhJhRjMD1Rgt-CpjYVRH4NTUZSymEeQb8n9bS4t1CWVNOb1w__)

## Core Components

The architecture is divided into four main areas:

1.  **User Browser (Frontend)**: The client-side React application that users interact with.
2.  **State Management**: React Contexts used to manage global application state.
3.  **Firebase Backend**: A suite of serverless tools from Google that provide the backend infrastructure.
4.  **External Services**: Third-party APIs integrated into the platform, such as Stripe for payments.

### 1. Frontend Application (React)

The frontend is a **Single-Page Application (SPA)** built with **React** and **TypeScript**, using **Vite** as the build tool. It is responsible for rendering the user interface and handling user interactions.

-   **React Router**: Manages all client-side routing, allowing for a seamless user experience without full page reloads. It directs users to different page components like the `HomePage`, `MarketplacePage`, `OffersPage`, etc.
-   **Components**: The UI is built with a combination of reusable components and page-level components. Many core pages are defined inline within `App.jsx`, while more complex features are broken into their own files in the `src/components` directory.
-   **Styling**: **TailwindCSS** is used for all styling, providing a utility-first approach for rapid and consistent UI development.

### 2. State Management (React Context)

Global application state is managed using React's built-in **Context API**. This avoids prop-drilling and provides a clean way to share data across the application.

-   **`AuthContext`**: Manages the user's authentication state (e.g., current user, login/logout functions). It serves as the interface between the React app and **Firebase Authentication**.
-   **`MarketplaceContext`**: Manages all state related to the e-commerce functionality, including the shopping cart (adding/removing items, calculating totals) and the mock product data.
-   **`FavoritesContext`**: Although the UI is not yet built, this context exists to manage a user's list of favorited vendors and products.

### 3. Firebase Backend

The entire backend is powered by Google's **Firebase** platform, which provides a suite of serverless tools that are scalable and easy to manage.

-   **Firebase Authentication**: Handles all user sign-up, login, and session management. It supports various authentication methods, including email/password and social logins.
-   **Cloud Firestore**: A NoSQL, document-based database used to store all application data, including users, vendors, products, orders, offers, and messages. Its real-time capabilities can be leveraged for live updates.
-   **Cloud Functions**: Serverless functions used for secure backend logic that should not be exposed to the client. The primary use case in this project is to create a **Stripe Checkout session**. The frontend calls this function, which then securely communicates with the Stripe API using a secret key.
-   **Firebase Storage**: Used to store user-generated content such as profile pictures, product images, and other media files.

### 4. External Services

-   **Stripe API**: The platform is integrated with Stripe for all payment processing. The integration is designed to be secure and PCI-compliant by using a server-side (Cloud Function) approach to create checkout sessions. This ensures that no sensitive payment information ever touches the frontend or our own servers.

## Data Flow Example: Making a Purchase

1.  A user clicks the "Add to Cart" button in the **React App**.
2.  The `addToCart` function from the **`MarketplaceContext`** is called, updating the cart state.
3.  The user navigates to the `/checkout` route, handled by **React Router**.
4.  The **Checkout** component is rendered, displaying the cart contents from the `MarketplaceContext`.
5.  The user clicks "Proceed to Stripe Checkout".
6.  The React app calls the `createStripeCheckout` **Cloud Function**.
7.  The Cloud Function securely communicates with the **Stripe API** using the secret key.
8.  Stripe creates a checkout session and returns a session URL.
9.  The Cloud Function returns the session URL to the React app.
10. The React app redirects the user to the Stripe-hosted checkout page to complete the payment.
11. Stripe sends a webhook event to another Cloud Function to confirm the payment and update the order status in **Cloud Firestore**.
