# Feature Documentation: Shopping Cart

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. What it Does

The Shopping Cart feature provides a temporary holding space for products that a user intends to purchase. It allows users to review their selected items, adjust quantities, and proceed to checkout.

### Key Functionality

- **Add to Cart**: Users can add products to the cart from the marketplace or product detail pages.
- **View Cart**: A modal or dedicated page that displays all items in the cart.
- **Adjust Quantity**: Users can increase or decrease the quantity of each item in the cart.
- **Remove from Cart**: Users can remove items from the cart.
- **Subtotal Calculation**: The cart automatically calculates the subtotal of all items.

---

## 2. Files Involved

### Context

- **`src/contexts/MarketplaceContext.tsx`**: Manages the global state of the shopping cart, including the list of items, cart total, and all cart-related functions.

### UI Components

- **`src/components/marketplace/ShoppingCart.jsx`**: Renders the shopping cart modal or page.
- **`src/components/Navigation.jsx`**: Displays the cart icon with the number of items in the cart.

---

## 3. How to Make Changes

### Modifying the Cart Display

1.  **Open `src/components/marketplace/ShoppingCart.jsx`**.
2.  **Modify the JSX** to change how cart items are displayed (e.g., change the layout, add more product details).

```javascript
// src/components/marketplace/ShoppingCart.jsx

<div className="flex flex-col gap-4">
  {cart.map((item) => (
    <div key={item.product.id} className="flex justify-between items-center">
      {/* ... modify how each cart item is displayed ... */}
    </div>
  ))}
</div>
```

### Changing the Quantity Adjustment Logic

1.  **Open `src/contexts/MarketplaceContext.tsx`**.
2.  **Locate the `adjustQuantity` function**.
3.  **Modify the logic** to change how item quantities are adjusted (e.g., set a maximum quantity).

```typescript
// src/contexts/MarketplaceContext.tsx

const adjustQuantity = (productId: string, newQuantity: number) => {
  setCart(prevCart => {
    if (newQuantity <= 0) {
      return prevCart.filter(item => item.product.id !== productId);
    } else {
      return prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      );
    }
  });
};
```

---

## 4. How to Add Items

This feature is about managing a list of products. To add a new product to the cart, you would use the `addToCart` function from the `MarketplaceContext`.

### Adding a "Add to Cart" Button to a New Component

1.  **Import the `useMarketplace` hook** from `src/contexts/MarketplaceContext.tsx`.
2.  **Get the `addToCart` function** from the context.
3.  **Add a button** that calls `addToCart` with the product as an argument.

```javascript
// Example: Adding an "Add to Cart" button to a new component

import { useMarketplace } from "../contexts/MarketplaceContext";

const NewProductComponent = ({ product }) => {
  const { addToCart } = useMarketplace();

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};
```

---

## 5. Future Improvements

- **Persistence**: The cart state is not persistent. It should be saved to local storage or the user's profile in the database to persist across sessions.
- **Discount Codes**: A feature to apply discount codes to the cart could be added.
- **Shipping Calculation**: The cart could be enhanced to calculate shipping costs based on the user's location.
- **"Save for Later"**: A "Save for Later" feature would allow users to move items from their cart to a separate list without removing them completely.
