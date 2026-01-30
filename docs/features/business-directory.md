# Feature Documentation: Business Directory

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. What it Does

The Business Directory is a searchable database of Black-owned businesses. It allows users to discover, learn about, and connect with businesses in the community.

### Key Functionality

- **Search**: Users can search for businesses by name, category, or location.
- **Filtering**: Users can filter businesses by category.
- **Business Cards**: Displays a summary of each business with key information.
- **Vendor Storefront**: Each business has a dedicated page with more details.

---

## 2. Files Involved

### Core Component

- **`src/App.jsx`**: The `BusinessDirectoryPage` component is defined within this file and rendered when the route is `/directory`.

### Data Sources

- **`src/data/mockBusinesses.ts`**: Provides the data for all businesses in the directory.

### UI Components

- **`src/components/ui/card.jsx`**: Used to display each business as a card.
- **`src/components/ui/input.jsx`**: Used for the search bar.
- **`src/components/ui/select.jsx`**: Used for the category filter.
- **`src/components/ui/badge.jsx`**: Used to display the business category.

---

## 3. How to Make Changes

### Changing the Search Placeholder Text

1.  **Open `src/App.jsx`**.
2.  **Locate the `BusinessDirectoryPage` component**.
3.  **Find the `Input` component** with the `placeholder` prop.
4.  **Modify the `placeholder` text**.

```javascript
// src/App.jsx (in BusinessDirectoryPage)

<Input
  type="text"
  placeholder="Search businesses by name, category, or location..."
  className="max-w-lg flex-1"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### Changing the Filter Options

1.  **Open `src/App.jsx`**.
2.  **Locate the `BusinessDirectoryPage` component**.
3.  **Find the `select` element** for filtering.
4.  **Modify the `option` elements** to change the filter categories.

```javascript
// src/App.jsx (in BusinessDirectoryPage)

<select
  className="bg-gray-800 text-white p-2 rounded-md"
  value={filterCategory}
  onChange={(e) => setFilterCategory(e.target.value)}
>
  <option value="All">All Categories</option>
  <option value="Business Services">Business Services</option>
  <option value="Food & Beverage">Food & Beverage</option>
  <option value="Technology">Technology</option>
  <option value="Retail">Retail</option>
</select>
```

---

## 4. How to Add Items

### Adding a New Business

1.  **Open `src/data/mockBusinesses.ts`**.
2.  **Add a new business object** to the `mockBusinesses` array.
3.  **Ensure the new object follows the `Business` interface**.

```typescript
// src/data/mockBusinesses.ts

export const mockBusinesses: Business[] = [
  // ... existing businesses
  {
    id: 7,
    name: "New Vision Books",
    category: "Retail",
    location: "Harlem, NY",
    rating: 4.7,
    description: "Independent bookstore specializing in African-American literature.",
    image: "/api/placeholder/300/200",
    verified: true,
    owner: "Aisha Williams",
    since: 2018,
    website: "https://newvisionbooks.com",
    phone: "(212) 555-1234",
    email: "contact@newvisionbooks.com"
  }
];
```

### Adding a New Filter Category

1.  **Open `src/App.jsx`**.
2.  **Locate the `BusinessDirectoryPage` component**.
3.  **Add a new `option` element** to the category filter `select`.
4.  **Ensure the `value` of the new option** matches a category in your business data.

```javascript
// src/App.jsx (in BusinessDirectoryPage)

<select ...>
  {/* ... existing options */}
  <option value="Health & Wellness">Health & Wellness</option>
</select>
```

---

## 5. Future Improvements

- **Componentization**: The `BusinessDirectoryPage` is a large component. It could be broken down into smaller components like `SearchBar.jsx`, `BusinessCard.jsx`, and `FilterControls.jsx`.
- **Dynamic Data**: The directory should fetch business data from a database (e.g., Firebase) instead of using mock data.
- **Pagination**: For a large number of businesses, pagination should be implemented to improve performance.
- **Advanced Filtering**: More advanced filtering options could be added, such as filtering by location, rating, or services offered.
