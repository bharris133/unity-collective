# Feature Documentation: Homepage

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. What it Does

The Homepage is the main landing page of the Unity Collective platform. It serves as a central hub to welcome users, communicate the platform's mission, and provide a high-level overview of key features and community activity.

### Key Functionality

- **Hero Section**: Displays a powerful message about community empowerment with a call-to-action to join.
- **Community Statistics**: Shows real-time (mock) statistics for community members, businesses, events, and economic impact.
- **Five Pillars**: Explains the core principles of the Unity Collective platform.
- **Featured Businesses**: Highlights a curated list of Black-owned businesses.
- **Upcoming Events**: Showcases upcoming community events.
- **Newsletter Subscription**: Allows users to subscribe to a newsletter.

---

## 2. Files Involved

### Core Component

- **`src/App.jsx`**: The main application component that renders the homepage content. The homepage is not a separate component but is rendered directly within `App.jsx` when the route is `/`.

### Data Sources

- **`src/data/mockBusinesses.ts`**: Provides the data for the "Featured Businesses" section.
- **`src/data/mockEvents.ts`**: Provides the data for the "Upcoming Events" section.
- **`src/data/mockStats.ts`**: Provides the data for the community statistics dashboard.

### UI Components

- **`src/components/ui/card.jsx`**: Used to display featured businesses and events.
- **`src/components/ui/button.jsx`**: Used for calls-to-action like "Join Our Community" and "Explore Businesses".
- **`src/components/ui/badge.jsx`**: Used to display categories for businesses and events.

### Assets

- **`src/assets/hero_banner.png`**: The main hero image.
- **`src/assets/logo_main.png`**: The Unity Collective logo.

---

## 3. How to Make Changes

### Changing the Hero Section Text

1.  **Open `src/App.jsx`**.
2.  **Locate the `HomePage` component** within the file.
3.  **Find the `div` with the class `bg-black text-white`**.
4.  **Modify the `h1` and `p` tags** to change the text.

```javascript
// src/App.jsx

const HomePage = () => (
  <div class="flex flex-col">
    {/* Hero Section */}
    <div class="relative text-white text-center py-20 px-4" style={{ backgroundImage: `url(${heroBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div class="absolute inset-0 bg-black opacity-60"></div>
      <div class="relative z-10">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Empowering Our Community Through Unity and Economic Strength</h1>
        <p class="text-lg md:text-xl mb-8 max-w-3xl mx-auto">Building a stronger Black community through the five pillars: Unity, Economic Control, Self-Sufficiency, Protection, and Control of Our Narrative.</p>
        {/* ... */}
      </div>
    </div>
    {/* ... */}
  </div>
);
```

### Changing the Five Pillars Text

1.  **Open `src/App.jsx`**.
2.  **Locate the `HomePage` component**.
3.  **Find the `div` with the class `grid md:grid-cols-5 gap-8`**.
4.  **Modify the `h3` and `p` tags** for each pillar.

```javascript
// src/App.jsx

const pillars = [
  { name: "Unity", description: "A scattered community is easily broken..." },
  { name: "Economic Control", description: "Support Black-owned businesses..." },
  // ...
];

// ... in HomePage component
<div class="grid md:grid-cols-5 gap-8">
  {pillars.map((pillar) => (
    <div key={pillar.name}>
      <h3 class="text-xl font-bold mb-2">{pillar.name}</h3>
      <p class="text-gray-400">{pillar.description}</p>
    </div>
  ))}
</div>
```

---

## 4. How to Add Items

### Adding a New Featured Business

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

### Adding a New Upcoming Event

1.  **Open `src/data/mockEvents.ts`**.
2.  **Add a new event object** to the `mockEvents` array.
3.  **Ensure the new object follows the `CommunityEvent` interface**.

```typescript
// src/data/mockEvents.ts

export const mockEvents: CommunityEvent[] = [
  // ... existing events
  {
    id: 6,
    name: "Youth Coding Workshop",
    type: "In-Person",
    date: "2025-10-15",
    time: "10:00 AM EST",
    location: "Chicago, IL",
    attendees: 45,
    description: "A free coding workshop for young people aged 12-18."
  }
];
```

### Adding a New Community Statistic

1.  **Open `src/data/mockStats.ts`**.
2.  **Add a new statistic object** to the `mockCommunityStats` array.
3.  **Ensure the new object follows the `CommunityStat` interface**.

```typescript
// src/data/mockStats.ts

export const mockCommunityStats: CommunityStat[] = [
  // ... existing stats
  {
    icon: TrendingUp, // or another Lucide icon
    value: "1.2M",
    label: "Social Media Reach"
  }
];
```

---

## 5. Future Improvements

- **Componentization**: The homepage is currently a single large component within `App.jsx`. It could be broken down into smaller, more manageable components (e.g., `HeroSection.jsx`, `FeaturedBusinesses.jsx`).
- **Dynamic Data**: The homepage currently uses mock data. It should be updated to fetch data from Firebase or another backend service.
- **Personalization**: The homepage could be personalized for logged-in users, showing them relevant content based on their interests and activity.
