## 1. What it Does

The Shopping Cart feature allows users to add products to a cart, adjust quantities, remove items, and proceed to checkout. The cart state is managed globally using a React Context, making it accessible from any component in the application. This feature is a core part of the marketplace functionality.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/contexts/MarketplaceContext.tsx` | Manages the global state for the shopping cart, including the list of items, total price, and functions for adding/removing items. |
| `src/components/Checkout.jsx` | Renders the checkout form where users finalize their purchase (not yet created). |

## 3. How to Make Changes

### **Changing Cart Item Display**

The cart items are typically displayed in a modal or a dedicated cart page. The JSX for rendering each cart item would be in the component that displays the cart (e.g., a `CartModal` component). You can modify this to change what information is shown (e.g., add a thumbnail image).

```jsx
// In a CartModal component or similar

{cart.items.map(item => (
  <div key={item.id}>
    <h4>{item.name}</h4>
    <p>Quantity: {item.quantity}</p>
    <p>Price: ${item.price * item.quantity}</p>
    {/* Add a thumbnail image here */}
  </div>
))}
```

### **Modifying Cart Logic**

All cart logic (adding items, calculating totals, etc.) is in `src/contexts/MarketplaceContext.tsx`. You can modify the `addToCart`, `removeFromCart`, and `updateQuantity` functions to change how the cart behaves.

```typescript
// In src/contexts/MarketplaceContext.tsx

const addToCart = (product: Product) => {
  setCart(prevCart => {
    const existingItem = prevCart.items.find(item => item.id === product.id);
    if (existingItem) {
      // Increase quantity if item already in cart
      return {
        ...prevCart,
        items: prevCart.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    } else {
      // Add new item to cart
      return {
        ...prevCart,
        items: [...prevCart.items, { ...product, quantity: 1 }],
      };
    }
  });
};
```

### **Changing the Checkout Process**

The checkout form and submission logic would be in `src/components/Checkout.jsx`. You can add or remove form fields, change validation, or integrate with a payment gateway (e.g., Stripe).

## 4. How to Add Items

### **Adding an "Add to Cart" Button**

To allow users to add a product to the cart from a page (e.g., the Marketplace or Product Detail page), you need to:

1.  **Import the Marketplace Context** into the component.
2.  **Get the `addToCart` function** from the context.
3.  **Add a button** that calls `addToCart` with the product as an argument.

```jsx
// In src/components/MarketplacePage.jsx

import { useMarketplace } from '../contexts/MarketplaceContext';

function MarketplacePage() {
  const { addToCart } = useMarketplace();

  return (
    <div>
      {mockProducts.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
```

### **Displaying the Cart Total**

To display the cart total in the navigation or a cart modal, you can retrieve it from the context.

```jsx
// In src/components/Navigation.jsx

import { useMarketplace } from '../contexts/MarketplaceContext';

function Navigation() {
  const { cart } = useMarketplace();

  return (
    <nav>
      <p>Cart Total: ${cart.total.toFixed(2)}</p>
    </nav>
  );
}
```
