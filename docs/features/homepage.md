## 1. What it Does

The Homepage is the main landing page of the Unity Collective platform. It serves as a welcome and navigation hub, showcasing the community's key pillars, featured businesses, upcoming events, and community statistics. Its primary goal is to engage visitors and guide them to other key sections of the platform.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/App.jsx` | Contains the `HomePage` component, which renders the entire page. |
| `src/data/mockBusinesses.ts` | Provides mock data for the "Featured Businesses" section. |
| `src/data/mockEvents.ts` | Provides mock data for the "Upcoming Events" section. |
| `src/data/mockStats.ts` | Provides mock data for the "Community Statistics" dashboard. |
| `src/assets/hero_banner.png` | The main background image for the hero section. |

## 3. How to Make Changes

### **Changing Text Content**

Most of the text (headlines, descriptions) is hardcoded directly within the `HomePage` component in `src/App.jsx`. To change it, find the corresponding JSX element and edit the text.

```jsx
// Example: Changing the main headline in src/App.jsx

<h1 className="text-5xl font-bold">Empowering Our Community...</h1>
```

### **Changing the Hero Image**

The hero image is imported from `src/assets/`. To change it, replace `hero_banner.png` with a new image of the same name, or update the import statement in `src/App.jsx`.

### **Changing the Five Pillars**

The Five Pillars are defined in an array within the `HomePage` component. You can edit the `title` and `description` for each pillar directly in this array.

```jsx
// In src/App.jsx
const pillars = [
  { title: 'Unity', description: '...' },
  { title: 'Economic Control', description: '...' },
  // ...
];
```

## 4. How to Add Items

### **Adding a Featured Business**

The homepage displays the first 3 businesses from `mockBusinesses.ts`. To change which businesses are featured, you can either:

1.  **Reorder the array** in `src/data/mockBusinesses.ts`.
2.  **Change the slice logic** in `src/App.jsx`:

    ```jsx
    // In src/App.jsx
    const featuredBusinesses = mockBusinesses.slice(0, 4); // Now shows 4 businesses
    ```

### **Adding an Upcoming Event**

Similar to businesses, the homepage displays the first 3 events from `mockEvents.ts`. Add a new event to the top of the `mockEvents.ts` array to have it appear on the homepage.

### **Adding a Community Statistic**

1.  **Add the new stat** to the `mockCommunityStats` array in `src/data/mockStats.ts`.
2.  **Update the JSX** in the `HomePage` component in `src/App.jsx` to render the new stat. You will need to add a new `div` for the stat and its label.

    ```jsx
    // In src/App.jsx, inside the community stats section

    <div>
      <p className="text-4xl font-bold">{communityStats[4].value}</p>
      <p className="text-sm text-gray-400">{communityStats[4].label}</p>
    </div>
    ```
