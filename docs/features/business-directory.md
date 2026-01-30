## 1. What it Does

The Business Directory is a searchable and filterable directory of all Black-owned businesses registered on the Unity Collective platform. It allows users to discover businesses by name, category, or location. Each business is displayed as a card with key information, and clicking a card leads to the vendor's dedicated storefront page.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/App.jsx` | Contains the `BusinessDirectoryPage` component, which renders the directory. |
| `src/data/mockBusinesses.ts` | Provides the complete list of mock data for all businesses in the directory. |
| `src/components/VendorStorefront.jsx` | The component for the individual vendor storefront page (not yet created). |

## 3. How to Make Changes

### **Changing the Page Layout**

The layout of the `BusinessDirectoryPage` is defined in `src/App.jsx`. You can modify the JSX to change the arrangement of the search bar, filters, and business cards.

### **Changing Business Card Appearance**

The appearance of each business card is controlled by the JSX within the `.map()` loop inside the `BusinessDirectoryPage` component. You can add or remove elements (e.g., add a "Verified" badge, change the rating style) by editing this section.

```jsx
// In src/App.jsx, inside BusinessDirectoryPage

<div key={business.id} className="border rounded-lg p-4">
  <h3 className="font-bold">{business.name}</h3>
  <p>{business.category}</p>
  {/* Add a new element here */}
</div>
```

### **Modifying Filter Logic**

The filtering logic is handled by `useState` hooks (`searchTerm`, `selectedCategory`, etc.) at the top of the `BusinessDirectoryPage` component. The `filteredBusinesses` variable is where the actual filtering happens. You can modify this logic to add new filters (e.g., by rating).

```jsx
// In src/App.jsx, inside BusinessDirectoryPage

const filteredBusinesses = mockBusinesses.filter(business => {
  return (
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || business.category === selectedCategory)
    // && business.rating >= 4.9 // Add new filter logic here
  );
});
```

## 4. How to Add Items

### **Adding a New Business**

To add a new business to the directory, simply add a new business object to the `mockBusinesses` array in `src/data/mockBusinesses.ts`. Ensure the new object follows the existing structure.

```typescript
// In src/data/mockBusinesses.ts

export const mockBusinesses: Business[] = [
  // ... existing businesses
  {
    id: '7',
    name: 'New Age Tech',
    category: 'Technology',
    location: 'New York, NY',
    description: 'Innovative tech solutions for the modern era.',
    rating: 4.9,
    verified: true,
  },
];
```

### **Adding a New Filter Category**

1.  **Add a business** with the new category to `src/data/mockBusinesses.ts`.
2.  **Add the new category** to the `categories` array inside the `BusinessDirectoryPage` component in `src/App.jsx`.

    ```jsx
    // In src/App.jsx, inside BusinessDirectoryPage

    const categories = ['All', 'Business Services', 'Food & Beverage', 'Technology', 'Retail', 'Healthcare', 'Education', 'New Category'];
    ```

The new category will automatically appear in the filter dropdown.
