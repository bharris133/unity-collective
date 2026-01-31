# Feature Documentation: Favorites

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. What it Does

The Favorites feature allows users to save businesses, products, and other items they are interested in. It provides a personalized space for users to keep track of items they want to revisit later.

### Key Functionality

- **Save to Favorites**: Users can click a "heart" icon to save an item to their favorites.
- **Favorites Page**: A dedicated page that displays all of the user's saved items.
- **Remove from Favorites**: Users can remove items from their favorites list.

---

## 2. Files Involved

### Core Component

- **`src/components/FavoritesPage.tsx`**: Renders the list of all favorited items.

### Context

- **`src/contexts/FavoritesContext.tsx`**: Manages the global state for the user's favorites, including the list of favorited items and functions for adding/removing items.

### UI Components

- **`src/components/ui/card.jsx`**: Used to display each favorited item.
- **`src/components/ui/button.jsx`**: Used for actions like "Remove from Favorites".
- **`lucide-react`**: The `Heart` icon is used to indicate whether an item is favorited.

---

## 3. How to Make Changes

### Changing the Appearance of Favorited Items

1.  **Open `src/components/FavoritesPage.tsx`**.
2.  **Locate the `.map()` loop** that renders the `favorites`.
3.  **Modify the JSX inside the loop** to change the appearance of the favorited item cards.

```typescript
// src/components/FavoritesPage.tsx

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {favorites.map((item) => (
    <Card key={item.id}>
      {/* ... modify card content here ... */}
    </Card>
  ))}
</div>
```

### Modifying the Add/Remove Logic

1.  **Open `src/contexts/FavoritesContext.tsx`**.
2.  **Locate the `toggleFavorite` function**.
3.  **Modify the logic** to change how items are added to or removed from the favorites list.

```typescript
// src/contexts/FavoritesContext.tsx

const toggleFavorite = (item: any) => {
  setFavorites(prevFavorites => {
    const isFavorited = prevFavorites.some(fav => fav.id === item.id);
    if (isFavorited) {
      return prevFavorites.filter(fav => fav.id !== item.id);
    } else {
      return [...prevFavorites, item];
    }
  });
};
```

---

## 4. How to Add Items

This feature is about adding existing items (like businesses or products) to a personalized list. To make a new type of item "favoritable":

1.  **Identify the component** where the new item type is rendered (e.g., `EventCard.jsx`).
2.  **Import the `useFavorites` hook** from `src/contexts/FavoritesContext.tsx`.
3.  **Add a `Heart` icon button** to the component.
4.  **Call the `toggleFavorite` function** when the button is clicked.

```javascript
// Example: Adding favorites to an EventCard component

import { useFavorites } from "../contexts/FavoritesContext";
import { Heart } from "lucide-react";

const EventCard = ({ event }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = favorites.some(fav => fav.id === event.id);

  return (
    <Card>
      {/* ... event details ... */}
      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(event)}>
        <Heart className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"} />
      </Button>
    </Card>
  );
};
```

---

## 5. Future Improvements

- **Persistence**: The favorites state is currently not persistent. It should be saved to the user's profile in the database so that it persists across sessions.
- **Categorization**: The favorites page could be improved by allowing users to categorize their saved items (e.g., "Businesses", "Products", "Events").
- **Notifications**: Users could be notified when a favorited item goes on sale or has a related event.
