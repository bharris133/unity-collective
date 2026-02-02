# Payment Service Architecture

## Overview

The Unity Collective platform uses a flexible payment service architecture that supports both **mock payments** (for development/testing) and **real Stripe payments** (for production).

---

## Architecture Design

### **Service Interface Pattern**

The payment system follows the **Strategy Pattern** with a unified interface:

```
paymentService (interface)
    ├── mockPaymentService (development)
    └── stripePaymentService (production)
```

### **Automatic Switching**

The active payment service is determined by the `VITE_USE_MOCK_DATA` environment variable:

- `VITE_USE_MOCK_DATA=true` → **Mock Payment Service**
- `VITE_USE_MOCK_DATA=false` → **Stripe Payment Service**

---

## Files Structure

```
src/services/
  ├── paymentService.ts           # Interface definitions and types
  ├── mockPaymentService.ts       # Mock implementation (always succeeds)
  ├── stripePaymentService.ts     # Stripe implementation (stub for future)
  └── index.ts                    # Service factory and exports
```

---

## Payment Service Interface

### **Core Methods**

| Method | Purpose | Returns |
|--------|---------|---------|
| `createPaymentIntent()` | Create a payment intent for an order | `PaymentIntent` |
| `confirmPayment()` | Confirm and process the payment | `PaymentResult` |
| `cancelPayment()` | Cancel a pending payment | `boolean` |
| `getPaymentStatus()` | Check payment intent status | `PaymentIntent` |
| `createCheckoutSession()` | Create hosted checkout session | `CheckoutSession` |
| `getCheckoutSession()` | Retrieve checkout session details | `CheckoutSession` |

### **Type Definitions**

```typescript
interface OrderData {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number; // in cents
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress?: Address;
  billingAddress?: Address;
  email: string;
  phone?: string;
  userId?: string; // Optional for guest checkout
}

interface PaymentIntent {
  id: string;
  amount: number; // in cents
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  clientSecret?: string;
  metadata?: Record<string, any>;
}

interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  orderId?: string;
  error?: string;
  message?: string;
}
```

---

## Mock Payment Service

### **Purpose**

Simulates payment processing for development and testing **without making real charges**.

### **Behavior**

- ✅ Always succeeds (configurable for testing failures)
- ✅ Generates mock payment intent IDs
- ✅ Simulates 1-second processing delay
- ✅ Logs all operations to console
- ✅ Stores payment intents in memory

### **Usage**

```typescript
import { paymentService } from '../services';

// Create payment intent
const paymentIntent = await paymentService.createPaymentIntent(orderData);

// Confirm payment (always succeeds in mock mode)
const result = await paymentService.confirmPayment(paymentIntent.id);

if (result.success) {
  console.log('Order ID:', result.orderId);
}
```

### **Console Output**

```
💳 [Mock Payment] Creating payment intent for order: {...}
✅ [Mock Payment] Payment intent created: pi_mock_1234567890_abc123
💳 [Mock Payment] Confirming payment: pi_mock_1234567890_abc123
✅ [Mock Payment] Payment confirmed successfully
```

---

## Stripe Payment Service

### **Status**

⚠️ **Stub implementation** - to be completed when Stripe integration is needed.

### **Future Implementation Steps**

1. **Install Stripe SDK**
   ```bash
   pnpm add @stripe/stripe-js stripe
   ```

2. **Create Backend API**
   - Payment intent creation endpoint
   - Payment confirmation endpoint
   - Webhook handler for payment events

3. **Configure Environment Variables**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...  # Backend only!
   ```

4. **Implement Frontend Integration**
   - Use Stripe.js for card element
   - Handle 3D Secure authentication
   - Confirm payments securely

5. **Security Considerations**
   - ⚠️ **NEVER** expose secret key in frontend
   - ✅ All payment intent creation happens on backend
   - ✅ Frontend only confirms with publishable key

---

## Guest Checkout Support

### **Design**

Both mock and Stripe services support **guest checkout**:

- `userId` field in `OrderData` is **optional**
- If `userId` is not provided, order is treated as guest checkout
- Email is **required** for all orders (guest or authenticated)

### **Implementation**

```typescript
// Guest checkout
const orderData: OrderData = {
  items: [...],
  total: 4999,
  email: 'guest@example.com',
  // userId is omitted
};

// Authenticated checkout
const orderData: OrderData = {
  items: [...],
  total: 4999,
  email: 'user@example.com',
  userId: currentUser.uid,
};
```

---

## Cart Persistence Strategy

### **Current Implementation**

- **Storage**: `localStorage` (via `MarketplaceContext`)
- **Scope**: Browser-specific (not synced across devices)
- **Persistence**: Survives page refreshes and browser restarts

### **Future Enhancement (Optional)**

For authenticated users, cart could be synced to Firestore:

```typescript
// Save cart to Firestore when user logs in
if (currentUser) {
  await saveCartToFirestore(currentUser.uid, cart);
}

// Load cart from Firestore on login
const savedCart = await loadCartFromFirestore(currentUser.uid);
```

---

## Integration with Checkout Flow

### **Checkout Component Usage**

```typescript
import { paymentService } from '../services';
import type { OrderData } from '../services';

function CheckoutPage() {
  const { cart } = useMarketplace();
  const { currentUser } = useAuth();

  const handleCheckout = async () => {
    // Prepare order data
    const orderData: OrderData = {
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: calculateSubtotal(cart),
      tax: calculateTax(cart),
      shipping: calculateShipping(cart),
      total: calculateTotal(cart),
      email: checkoutForm.email,
      userId: currentUser?.uid, // Optional for guest checkout
      shippingAddress: checkoutForm.shippingAddress,
    };

    // Create payment intent
    const paymentIntent = await paymentService.createPaymentIntent(orderData);

    // Confirm payment (mock always succeeds, Stripe requires card details)
    const result = await paymentService.confirmPayment(paymentIntent.id);

    if (result.success) {
      // Navigate to order success page
      navigate(`/order-success/${result.orderId}`);
    } else {
      // Show error message
      setError(result.error);
    }
  };

  return (
    // Checkout form UI
  );
}
```

---

## Testing

### **Mock Mode Testing**

1. Set environment variable:
   ```bash
   VITE_USE_MOCK_DATA=true
   ```

2. Test checkout flow:
   - Add items to cart
   - Proceed to checkout
   - Fill in shipping/billing info
   - Click "Place Order"
   - Payment will succeed automatically

3. Check console for mock payment logs

### **Stripe Mode Testing**

1. Set environment variable:
   ```bash
   VITE_USE_MOCK_DATA=false
   ```

2. Configure Stripe test keys

3. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0027 6000 3184`

---

## Environment Variables

### **Required for Mock Mode**

```env
VITE_USE_MOCK_DATA=true
```

### **Required for Stripe Mode**

```env
VITE_USE_MOCK_DATA=false
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **Backend Environment Variables** (Future)

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Security Best Practices

### **✅ DO**

- Use mock mode for development and testing
- Keep Stripe secret key on backend only
- Validate all payment amounts on backend
- Use HTTPS in production
- Implement webhook signature verification
- Log all payment events for audit trail

### **❌ DON'T**

- Expose Stripe secret key in frontend code
- Trust payment amounts from frontend
- Skip webhook verification
- Store card details (use Stripe tokens instead)
- Process payments without user confirmation

---

## Future Enhancements

### **Phase 1: Current** ✅
- Mock payment service
- Guest checkout support
- localStorage cart persistence

### **Phase 2: Stripe Integration** 🔜
- Stripe API integration
- Backend payment endpoints
- Webhook handling
- 3D Secure support

### **Phase 3: Advanced Features** 🔮
- Firestore cart sync for authenticated users
- Subscription payments
- Refund handling
- Payment method management
- Invoice generation

---

## Troubleshooting

### **Issue: "Payment service not yet implemented"**

**Cause**: `VITE_USE_MOCK_DATA` is set to `false` but Stripe is not configured.

**Solution**: Set `VITE_USE_MOCK_DATA=true` in `.env` file.

### **Issue: Payment always succeeds in testing**

**Cause**: Using mock payment service.

**Solution**: This is expected behavior. Mock mode always succeeds for easy testing.

### **Issue: Cart not persisting across sessions**

**Cause**: localStorage is browser-specific.

**Solution**: This is expected. For cross-device sync, implement Firestore cart sync (Phase 3).

---

## Support

For questions or issues with the payment service:

1. Check console logs for payment service messages
2. Verify `VITE_USE_MOCK_DATA` environment variable
3. Review this documentation
4. Contact development team

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Mock service complete, Stripe service pending
