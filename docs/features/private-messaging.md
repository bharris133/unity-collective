## 1. What it Does

The Private Messaging feature allows users to communicate directly with each other in a secure, private environment. It is designed to facilitate conversations related to community offers, business inquiries, or general networking. The interface is a classic two-panel layout with a list of conversation threads on the left and the selected conversation on the right.

## 2. Files Involved

| File | Purpose |
| :--- | :--- |
| `src/components/MessagesPage.tsx` | Renders the entire two-panel messaging interface. |
| `src/data/mockThreads.ts` | Provides the mock data for the list of conversation threads. |
| `src/data/mockMessages.ts` | Provides the mock data for the messages within each conversation. |

## 3. How to Make Changes

### **Changing the Layout**

The two-panel layout is controlled by the JSX in `src/components/MessagesPage.tsx`. You can adjust the relative widths of the panels or change the overall structure by modifying the flexbox or grid classes.

### **Changing Message Bubble Appearance**

The appearance of each message bubble is controlled by the JSX inside the `.map()` loop that renders the messages of the `selectedThread`. You can change the colors, add timestamps, or add read receipts by editing this section.

```tsx
// In src/components/MessagesPage.tsx

<div key={message.id} className={`message-bubble ${message.sender.id === currentUser.id ? 'sent' : 'received'}`}>
  <p>{message.text}</p>
  {/* Add a timestamp here */}
</div>
```

### **Modifying Message Sending Logic**

The logic for sending a new message would be in the event handler for the "Send" button in `src/components/MessagesPage.tsx`. You can modify this to add validation (e.g., prevent sending empty messages) or to integrate with a backend API.

```tsx
// In src/components/MessagesPage.tsx

const handleSendMessage = () => {
  if (newMessage.trim() === '') return; // Validation
  // Add logic to send the message
  setNewMessage(''); // Clear the input
};
```

## 4. How to Add Items

### **Adding a New Conversation Thread**

To add a new conversation thread, add a new thread object to the `mockThreads` array in `src/data/mockThreads.ts`. You will also need to add corresponding messages to `mockMessages.ts` using the same `threadId`.

```typescript
// In src/data/mockThreads.ts

export const mockThreads: Thread[] = [
  // ... existing threads
  {
    id: '4',
    participants: [{ id: '1', name: 'John Smith' }, { id: '5', name: 'New User' }],
    lastMessage: 'Hello, I saw your offer...',
    lastMessageTime: '10:00 AM',
    unreadCount: 1,
    relatedOffer: { id: '1', title: 'Looking for Web Development Services' },
  },
];
```

```typescript
// In src/data/mockMessages.ts

export const mockMessages: { [threadId: string]: Message[] } = {
  // ... existing messages
  '4': [
    { id: 'm1', sender: { id: '5', name: 'New User' }, text: 'Hello, I saw your offer...', timestamp: '10:00 AM' },
  ],
};
```

### **Adding a Message to an Existing Thread**

To add a new message to an existing conversation, add a new message object to the corresponding array in `mockMessages.ts`.

```typescript
// In src/data/mockMessages.ts

export const mockMessages: { [threadId: string]: Message[] } = {
  '1': [
    // ... existing messages
    { id: 'm5', sender: { id: '1', name: 'John Smith' }, text: 'Sounds good!', timestamp: '11:00 AM' },
  ],
};
```
