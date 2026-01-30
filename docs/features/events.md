## 1. What it Does

The Events feature allows the platform to showcase upcoming community events, such as webinars, networking mixers, workshops, and conferences. Users can browse events, see details (date, time, location, type), and potentially RSVP or register. Events are displayed on the homepage and may have a dedicated events page.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/App.jsx` | Contains the `HomePage` component, which displays a preview of upcoming events. |
| `src/data/mockEvents.ts` | Provides the mock data for all events. |

## 3. How to Make Changes

### **Changing Event Card Appearance**

The appearance of event cards on the homepage is controlled by the JSX inside the `.map()` loop in the `HomePage` component in `src/App.jsx`. You can modify this to change what information is displayed or how it is styled.

```jsx
// In src/App.jsx, inside HomePage

{upcomingEvents.map(event => (
  <div key={event.id} className="event-card">
    <h3>{event.title}</h3>
    <p>{event.date}</p>
    <p>{event.type}</p>
    {/* Add a location or description here */}
  </div>
))}
```

### **Creating a Dedicated Events Page**

If you want a full events page (e.g., `/events`), you would:

1.  **Create a new component** (e.g., `EventsPage`) in `src/App.jsx`.
2.  **Import `mockEvents`** and render all events (not just the first 3).
3.  **Add a route** for `/events` in the `Routes` section.

```jsx
// In src/App.jsx

function EventsPage() {
  return (
    <div>
      <h1>Upcoming Events</h1>
      {mockEvents.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.date} - {event.type}</p>
        </div>
      ))}
    </div>
  );
}

// In the Routes section:
<Route path="/events" element={<EventsPage />} />
```

## 4. How to Add Items

### **Adding a New Event**

To add a new event, add a new event object to the `mockEvents` array in `src/data/mockEvents.ts`. Ensure the new object follows the `Event` interface.

```typescript
// In src/data/mockEvents.ts

export const mockEvents: Event[] = [
  // ... existing events
  {
    id: '6',
    title: 'Black Business Expo',
    date: '2025-10-15',
    type: 'In-Person',
    location: 'Los Angeles, CA',
    description: 'A large expo featuring Black-owned businesses.',
  },
];
```

### **Adding an RSVP Feature**

To allow users to RSVP to events, you would:

1.  **Create a state variable** (or use a context) to track which events the user has RSVP'd to.
2.  **Add an "RSVP" button** to each event card.
3.  **Update the state** when the button is clicked.

```jsx
// In src/App.jsx, inside EventsPage

const [rsvpEvents, setRsvpEvents] = useState([]);

const handleRSVP = (eventId) => {
  setRsvpEvents(prev => [...prev, eventId]);
};

return (
  <div>
    {mockEvents.map(event => (
      <div key={event.id}>
        <h3>{event.title}</h3>
        <button onClick={() => handleRSVP(event.id)}>
          {rsvpEvents.includes(event.id) ? 'RSVP\'d' : 'RSVP'}
        </button>
      </div>
    ))}
  </div>
);
```
