## 1. What it Does

The Community Offers (or Barter/Trade) feature allows members to post requests for services or offer their own skills to the community. It is a non-monetary exchange system designed to foster collaboration. Users can browse offers, see their status (open, in-progress, completed), and respond to offers to initiate a conversation.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/components/OffersPage.tsx` | Renders the main page that displays the list of all community offers. |
| `src/data/mockOffers.ts` | Provides the mock data for all offers. |
| `src/components/CreateOffer.jsx` | The component for the form to create a new offer (not yet created). |

## 3. How to Make Changes

### **Changing Offer Card Appearance**

The appearance of each offer card is controlled by the JSX inside the `.map()` loop in `src/components/OffersPage.tsx`. You can modify this JSX to change what information is displayed or how it is styled.

```tsx
// In src/components/OffersPage.tsx

<div key={offer.id} className="border p-4">
  <h3>{offer.title}</h3>
  <p>by {offer.user.name}</p>
  {/* Change the status badge style here */}
  <span className={`status-${offer.status}`}>{offer.status}</span>
</div>
```

### **Modifying Filter Logic**

The filtering logic is handled by `useState` hooks at the top of the `OffersPage` component. You can modify the `filteredOffers` variable to add new filtering capabilities, such as filtering by user.

```tsx
// In src/components/OffersPage.tsx

const filteredOffers = mockOffers.filter(offer => {
  return (
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || offer.status === statusFilter)
    // && offer.user.name === 'John Smith' // Add new filter logic here
  );
});
```

## 4. How to Add Items

### **Adding a New Offer**

To add a new offer to the page, add a new offer object to the `mockOffers` array in `src/data/mockOffers.ts`. Ensure the new object follows the `Offer` interface.

```typescript
// In src/data/mockOffers.ts

export const mockOffers: Offer[] = [
  // ... existing offers
  {
    id: '5',
    title: 'Offering Graphic Design Services',
    description: 'I can create logos, flyers, and social media graphics.',
    user: { id: '6', name: 'Emily White' },
    status: 'open',
    responses: 0,
  },
];
```

### **Adding a New Offer Status**

1.  **Add an offer** with the new status to `src/data/mockOffers.ts`.
2.  **Update the status filter** options in `src/components/OffersPage.tsx` to include the new status.
3.  **Add styling** for the new status badge in your CSS file to ensure it is visually distinct.
