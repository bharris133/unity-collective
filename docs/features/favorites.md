## 1. What it Does

The Favorites feature allows users to save businesses, products, or offers to a personal list for easy access later. This feature enhances user experience by providing a way to bookmark items of interest without making a purchase or commitment immediately.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/components/FavoritesPage.jsx` | Renders the page that displays all of the user's favorited items (not yet created). |
| `src/contexts/FavoritesContext.jsx` | Manages the global state for the user's favorites list (not yet created). |

## 3. How to Make Changes

### **Changing the Favorites Page Layout**

*This assumes the `FavoritesPage` component exists.*

The layout of the favorites page would be controlled by the JSX in `src/components/FavoritesPage.jsx`. You can organize favorites by type (businesses, products, offers) or display them all in a single list.

### **Modifying the Add/Remove Logic**

The logic for adding and removing items from favorites would be in `src/contexts/FavoritesContext.jsx`. You can modify this to add validation (e.g., prevent duplicates) or to sync with a backend API.

```jsx
// In src/contexts/FavoritesContext.jsx

const addToFavorites = (item) => {
  setFavorites(prevFavorites => {
    if (prevFavorites.some(fav => fav.id === item.id)) {
      return prevFavorites; // Prevent duplicates
    }
    return [...prevFavorites, item];
  });
};
```

## 4. How to Add Items

### **Adding a "Favorite" Button to a Component**

To allow users to favorite an item from a page (e.g., the Business Directory), you need to:

1.  **Import the Favorites Context** into the component.
2.  **Get the `addToFavorites` function** from the context.
3.  **Add a button** that calls `addToFavorites` with the item as an argument.

```jsx
// In src/App.jsx, inside BusinessDirectoryPage

import { useFavorites } from './contexts/FavoritesContext';

function BusinessDirectoryPage() {
  const { addToFavorites } = useFavorites();

  return (
    <div>
      {mockBusinesses.map(business => (
        <div key={business.id}>
          <h3>{business.name}</h3>
          <button onClick={() => addToFavorites(business)}>Add to Favorites</button>
        </div>
      ))}
    </div>
  );
}
```

### **Displaying Favorited Items**

In `src/components/FavoritesPage.jsx`, you would retrieve the favorites list from the context and map over it to display each item.

```jsx
// In src/components/FavoritesPage.jsx

import { useFavorites } from '../contexts/FavoritesContext';

function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div>
      <h1>My Favorites</h1>
      {favorites.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  );
}
```
