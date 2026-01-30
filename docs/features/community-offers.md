# Feature Documentation: Community Offers

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. What it Does

The Community Offers feature facilitates a barter and trade system within the Unity Collective. Users can create offers to trade goods or services, and other users can accept and engage with these offers.

### Key Functionality

- **Offer Listings**: Displays a list of all available offers.
- **Offer Creation**: Allows users to create new offers.
- **Offer Details**: Each offer has a dedicated page with more information.
- **Offer Status**: Offers can have different statuses (e.g., Open, In Progress, Completed).

---

## 2. Files Involved

### Core Components

- **`src/components/OffersPage.tsx`**: Renders the list of all community offers.
- **`src/components/CreateOffer.tsx`**: Renders the form for creating a new offer.

### Data Sources

- **`src/data/mockOffers.ts`**: Provides the data for all community offers.

### UI Components

- **`src/components/ui/card.jsx`**: Used to display each offer.
- **`src/components/ui/button.jsx`**: Used for actions like "Create Offer" and "Accept Offer".
- **`src/components/ui/badge.jsx`**: Used to display the status of each offer.

---

## 3. How to Make Changes

### Changing the Offer Card Layout

1.  **Open `src/components/OffersPage.tsx`**.
2.  **Locate the `.map()` loop** that renders the `mockOffers`.
3.  **Modify the JSX inside the loop** to change the appearance of the offer cards.

```typescript
// src/components/OffersPage.tsx

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {mockOffers.map((offer) => (
    <Card key={offer.id}>
      {/* ... modify card content here ... */}
    </Card>
  ))}
</div>
```

### Modifying the Create Offer Form

1.  **Open `src/components/CreateOffer.tsx`**.
2.  **Modify the JSX** to add, remove, or change form fields.
3.  **Update the `useState` hooks** to manage the state of the new form fields.

```typescript
// src/components/CreateOffer.tsx

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
// ... add new state for new fields

// ... in the return statement
<form onSubmit={handleSubmit}>
  {/* ... add new form fields here ... */}
</form>
```

---

## 4. How to Add Items

### Adding a New Offer

1.  **Open `src/data/mockOffers.ts`**.
2.  **Add a new offer object** to the `mockOffers` array.
3.  **Ensure the new object follows the `Offer` interface**.

```typescript
// src/data/mockOffers.ts

export const mockOffers: Offer[] = [
  // ... existing offers
  {
    id: "5",
    title: "Graphic Design for Small Business",
    description: "Offering logo and branding design services in exchange for accounting help.",
    offeredBy: "Creative Solutions Inc.",
    status: "Open",
    date: "2025-10-20"
  }
];
```

### Adding a New Offer Status

1.  **Open `src/data/mockOffers.ts`** and add an offer with the new status.
2.  **Open `src/components/OffersPage.tsx`**.
3.  **Locate the `Badge` component** that displays the offer status.
4.  **Add a new case to the `switch` statement** (or modify the conditional logic) to handle the new status and apply the appropriate color.

```typescript
// src/components/OffersPage.tsx

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open": return "bg-green-500";
    case "In Progress": return "bg-yellow-500";
    case "Completed": return "bg-gray-500";
    case "New Status": return "bg-blue-500"; // Add new status color
    default: return "bg-gray-500";
  }
};
```

---

## 5. Future Improvements

- **Dynamic Data**: Offers should be fetched from and created in a database.
- **User Authentication**: Only authenticated users should be able to create and accept offers.
- **Offer Acceptance Flow**: A full workflow for accepting offers, communicating with the offerer, and marking offers as complete should be implemented.
- **Notifications**: Users should receive notifications when their offers are accepted or when there are new messages related to their offers.
