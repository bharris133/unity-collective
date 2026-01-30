## 1. What it Does

The Community Hub is a central gathering place for community members to access resources, view announcements, participate in discussions, and stay informed about community activities. It serves as a social and informational center within the Unity Collective platform.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/App.jsx` | Contains the `CommunityPage` component, which renders the community hub (currently a placeholder). |

## 3. How to Make Changes

### **Changing the Page Layout**

The layout of the `CommunityPage` is defined in `src/App.jsx`. Currently, it is likely a placeholder with minimal content. You can modify the JSX to add sections for announcements, discussions, resources, etc.

```jsx
// In src/App.jsx, inside CommunityPage

function CommunityPage() {
  return (
    <div>
      <h1>Community Hub</h1>
      <section>
        <h2>Announcements</h2>
        {/* Add announcement cards here */}
      </section>
      <section>
        <h2>Discussions</h2>
        {/* Add discussion threads here */}
      </section>
    </div>
  );
}
```

### **Adding a New Section**

To add a new section to the Community Hub (e.g., "Featured Resources"), you would:

1.  **Add a new `<section>` element** in the `CommunityPage` component.
2.  **Populate it with content** (e.g., a list of resources from a mock data file).

## 4. How to Add Items

### **Adding an Announcement**

If you create a mock data file for announcements (e.g., `src/data/mockAnnouncements.ts`), you can add a new announcement by adding a new object to the array.

```typescript
// In src/data/mockAnnouncements.ts

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Feature Launch',
    content: 'We are excited to announce...',
    date: '2025-08-20',
  },
  // Add new announcement here
];
```

Then, in the `CommunityPage` component, you would import this data and map over it to display each announcement.

### **Adding a Discussion Thread**

Similar to announcements, you would create a mock data file for discussion threads and add new threads by adding objects to the array. You would then render these threads in the `CommunityPage` component.
