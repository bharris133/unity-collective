# Feature Documentation: Marketplace

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. What it Does

The Marketplace is the e-commerce hub of the Unity Collective platform. It allows users to browse, search, and purchase products from the various businesses in the community.

### Key Functionality

- **Product Catalog**: Displays a grid of all available products.
- **Search & Filtering**: Users can search for products and filter them by category.
- **Add to Cart**: Users can add products to their shopping cart.
- **Product Detail Page**: Each product has a dedicated page with more information.

---

## 2. Files Involved

### Core Component

- **`src/components/MarketplacePage.jsx`**: Renders the main product catalog and handles search/filter logic.

### Context

- **`src/contexts/MarketplaceContext.tsx`**: Manages the global state for the shopping cart, including the list of items, adding/removing items, and calculating the total.

### Data Sources

- **`src/data/mockProducts.ts`**: Provides the data for all products in the marketplace.

### UI Components

- **`src/components/ui/card.jsx`**: Used to display each product as a card.
- **`src/components/ui/input.jsx`**: Used for the search bar.
- **`src/components/ui/select.jsx`**: Used for the category filter.

---

## 3. How to Make Changes

### Changing the Product Card Layout

1.  **Open `src/components/MarketplacePage.jsx`**.
2.  **Locate the `.map()` loop** that renders the `filteredProducts`.
3.  **Modify the JSX inside the loop** to change the appearance of the product cards.

```javascript
// src/components/MarketplacePage.jsx

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredProducts.map((product) => (
    <Card key={product.id}>
      {/* ... modify card content here ... */}
    </Card>
  ))}
</div>
```

### Modifying the Add to Cart Logic

1.  **Open `src/contexts/MarketplaceContext.tsx`**.
2.  **Locate the `addToCart` function**.
3.  **Modify the logic** to change how items are added to the cart (e.g., add a quantity limit).

```typescript
// src/contexts/MarketplaceContext.tsx

const addToCart = (product: Product) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(item => item.product.id === product.id);
    if (existingItem) {
      // If item exists, increase quantity
      return prevCart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      // If item doesn't exist, add it to the cart
      return [...prevCart, { product, quantity: 1 }];
    }
  });
};
```

---

## 4. How to Add Items

### Adding a New Product

1.  **Open `src/data/mockProducts.ts`**.
2.  **Add a new product object** to the `mockProducts` array.
3.  **Ensure the new object follows the `Product` interface**.

```typescript
// src/data/mockProducts.ts

export const mockProducts: Product[] = [
  // ... existing products
  {
    id: "7",
    name: "Handmade Leather Journal",
    price: 45.00,
    description: "A beautiful, handcrafted leather journal.",
    category: "Gifts",
    businessId: "3",
    imageUrl: "/api/placeholder/300/300"
  }
];
```

### Adding a New Product Category

1.  **Open `src/components/MarketplacePage.jsx`**.
2.  **Locate the category filter `select` element**.
3.  **Add a new `option` element** with the new category name.

```javascript
// src/components/MarketplacePage.jsx

<select ...>
  {/* ... existing options */}
  <option value="Gifts">Gifts</option>
</select>
```

---

## 5. Future Improvements

- **Dynamic Data**: The marketplace should fetch product data from a database instead of using mock data.
- **Inventory Management**: The `Product` interface could be extended to include an `inventory` field, and the `addToCart` logic could be updated to prevent adding out-of-stock items.
- **Sorting**: Users should be able to sort products by price, rating, or popularity.
- **Reviews**: A product review and rating system could be implemented.
