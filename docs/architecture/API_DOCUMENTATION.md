# Unity Collective - API Reference

This document provides a reference for the Firebase Cloud Functions used in the Unity Collective backend. These functions handle secure operations that cannot be performed on the client-side.

## Base URL

Cloud Functions are callable from the client-side SDK or accessible via HTTP endpoints. The base URL for HTTP-triggered functions is:
`https://us-central1-your-production-project-id.cloudfunctions.net`

---

## 1. `createCheckoutSession`

This is a **Callable Function** that creates a secure Stripe checkout session for a user's shopping cart.

-   **Type**: `onCall`
-   **Authentication**: Required. The user must be authenticated with Firebase Auth.

### How to Call

This function is called from the client-side using the Firebase Functions SDK.

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');

const result = await createCheckoutSession({
  cartItems: [...],
  successUrl: 'https://your-domain.com/order-success',
  cancelUrl: 'https://your-domain.com/cart'
});

// Redirect to Stripe
window.location.href = result.data.url;
```

### Request Payload

The function expects a JSON object with the following properties:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `cartItems` | `CartItem[]` | Yes | An array of items in the user's cart. |
| `successUrl` | `string` | No | The URL to redirect to upon successful payment. Defaults to `/order-success`. |
| `cancelUrl` | `string` | No | The URL to redirect to if the user cancels the checkout. Defaults to `/cart`. |

**`CartItem` Object Structure:**

```typescript
interface CartItem {
  id: string;         // Product ID
  name: string;       // Product name
  price: number;      // Price in cents (client-side, not trusted)
  quantity: number;   // Quantity of the item
  vendorId: string;   // ID of the business selling the product
}
```

### Server-Side Logic

1.  **Authentication Check**: Verifies that the user is authenticated.
2.  **Price Verification**: **Crucially, the function does not trust the `price` from the client**. It iterates through the `cartItems` and fetches the actual, up-to-date price for each product from the `products` collection in Firestore. This prevents price tampering.
3.  **Fee Calculation**: It calculates the Unity Collective platform fee based on the vendor's status (e.g., founding members may have fees waived).
4.  **Line Item Creation**: It constructs a list of `line_items` for the Stripe session, including the products and the platform fee.
5.  **Session Creation**: It calls the Stripe API to create a `checkout.session`.
6.  **Metadata**: It attaches important information to the session's `metadata`, including `userId`, `vendorId`, and the `cartItems` JSON, which will be used by the webhook later.

### Response Payload

The function returns a JSON object with the following properties:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `sessionId` | `string` | The ID of the created Stripe checkout session. |
| `url` | `string` | The secure URL to the Stripe-hosted checkout page. The client should redirect the user to this URL. |

### Error Handling

The function will throw an `HttpsError` with one of the following codes if an issue occurs:

-   `unauthenticated`: If the user is not logged in.
-   `invalid-argument`: If the `cartItems` payload is missing or invalid.
-   `not-found`: If a product from the cart cannot be found in Firestore.
-   `internal`: For any other server-side errors, including issues communicating with Stripe.

---

## 2. `stripeWebhook`

This is an **HTTP-triggered Function** that listens for events from Stripe. Its primary purpose is to handle the `checkout.session.completed` event to fulfill orders after a successful payment.

-   **Type**: `onRequest`
-   **Endpoint**: `.../stripeWebhook`

### Security

This endpoint is secured by verifying the **Stripe signature** included in the `stripe-signature` header of every request. This ensures that the request genuinely came from Stripe and was not sent by a malicious third party. If the signature is invalid, the function will return a `400 Bad Request` error.

### Event Handling

The function is designed to handle the `checkout.session.completed` event.

### Logic for `checkout.session.completed`

When a payment is successful, this function performs the following critical actions:

1.  **Extract Metadata**: It retrieves the `userId`, `vendorId`, and `cartItems` from the session's metadata that was attached by the `createCheckoutSession` function.
2.  **Create Order Document**: It creates a new document in the `orders` collection in Firestore. This document contains the complete order details, including the items purchased, pricing, user ID, vendor ID, and payment status.
3.  **Update Vendor Sales**: It atomically increments the `totalSalesCents` and `orderCount` for the corresponding vendor in the `vendors` collection.
4.  **Clear User's Cart**: It deletes the user's cart document from the `carts` collection in Firestore to prevent duplicate orders.
5.  **Future Actions (TODO)**: The function includes placeholders to send an order confirmation email to the user and a new order notification to the vendor.

### Response

The function responds to Stripe with a `200 OK` and `{ received: true }` to acknowledge that the event was received successfully.
