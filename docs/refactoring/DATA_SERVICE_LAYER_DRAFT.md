# Draft: Data Service Abstraction Layer

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. Objective

To create a data service abstraction layer that centralizes all data fetching logic. This will decouple components from data sources, improve code reuse, and make it easy to switch between mock data and a real backend.

## 2. File Structure

The data service layer will live in a new `src/services/` directory. Each data domain will have its own service file.

```
src/
├── services/
│   ├── businessService.ts
│   ├── productService.ts
│   ├── eventService.ts
│   └── index.ts
└── ...
```

## 3. Environment Variable Toggle

A `.env` file will be used to control whether the application uses mock data or a real backend. This allows for easy switching during development and testing.

```
# .env

VITE_USE_MOCK_DATA=true
```

## 4. Example Implementation: `productService.ts`

This example demonstrates how the `productService` would be implemented. It uses the `VITE_USE_MOCK_DATA` environment variable to decide whether to return mock data or make a real API call.

```typescript
// src/services/productService.ts

import { mockProducts } from "../data/mockProducts";
import { Product } from "../types";

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === "true";

/**
 * Fetches all products.
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 */
export const getProducts = async (): Promise<Product[]> => {
  if (useMockData) {
    console.log("Using mock data for products");
    return Promise.resolve(mockProducts);
  } else {
    console.log("Fetching products from API");
    // In a real application, you would fetch from your backend API
    // For example:
    // const response = await fetch("https://api.unitycollective.com/products");
    // if (!response.ok) {
    //   throw new Error("Failed to fetch products");
    // }
    // return response.json();

    // For now, we will return the mock data as a fallback
    return Promise.resolve(mockProducts);
  }
};

/**
 * Fetches a single product by its ID.
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Product | undefined>} A promise that resolves to the product, or undefined if not found.
 */
export const getProductById = async (id: string): Promise<Product | undefined> => {
  if (useMockData) {
    console.log(`Using mock data for product with id: ${id}`);
    return Promise.resolve(mockProducts.find((p) => p.id === id));
  } else {
    console.log(`Fetching product with id: ${id} from API`);
    // Real API call
    // const response = await fetch(`https://api.unitycollective.com/products/${id}`);
    // if (!response.ok) {
    //   return undefined;
    // }
    // return response.json();

    // Fallback
    return Promise.resolve(mockProducts.find((p) => p.id === id));
  }
};
```

## 5. How to Use in a Component

Components will no longer fetch data directly. Instead, they will import and use the functions from the data service layer.

```javascript
// Example: Using the productService in a component

import React, { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import { Product } from "../types";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};

export default ProductList;
```

## 6. Conclusion

This data service abstraction layer provides a clean, scalable, and maintainable way to manage data fetching in the Unity Collective application. It decouples components from data sources, centralizes data logic, and makes it easy to switch between mock and real data, which will be crucial for future development and testing.
