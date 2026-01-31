# Feature Documentation: Private Messaging

**Author**: Manus AI  
**Date**: January 30, 2026

---

## 1. What it Does

The Private Messaging feature allows users to communicate directly with each other in a secure and private environment. It is essential for facilitating communication related to marketplace transactions, community offers, and general networking.

### Key Functionality

- **Two-Panel Layout**: A list of conversation threads on the left and the selected conversation on the right.
- **Conversation Threads**: Displays a list of all conversations with the most recent message.
- **Message View**: Shows the full history of a selected conversation.
- **Message Sending**: Allows users to send new messages in a conversation.

---

## 2. Files Involved

### Core Component

- **`src/components/MessagesPage.tsx`**: Renders the entire private messaging interface.

### Data Sources

- **`src/data/mockMessages.ts`**: Provides the mock data for all conversation threads and messages.

### UI Components

- **`src/components/ui/card.jsx`**: Used to structure the two-panel layout.
- **`src/components/ui/input.jsx`**: Used for the message input field.
- **`src/components/ui/button.jsx`**: Used for the "Send" button.
- **`src/components/ui/avatar.jsx`**: Used to display user avatars.

---

## 3. How to Make Changes

### Changing the Message Bubble Style

1.  **Open `src/components/MessagesPage.tsx`**.
2.  **Locate the `.map()` loop** that renders the messages for the `selectedThread`.
3.  **Modify the JSX** to change the appearance of the message bubbles. You can change the colors, alignment, and other styles based on whether the message is from the current user or the other user.

```typescript
// src/components/MessagesPage.tsx

<div className="flex flex-col gap-4">
  {selectedThread.messages.map((message) => (
    <div 
      key={message.id}
      className={`flex items-end gap-2 ${message.sender === "You" ? "justify-end" : ""}`}>
      {/* ... modify message bubble style here ... */}
    </div>
  ))}
</div>
```

### Modifying the Send Message Logic

1.  **Open `src/components/MessagesPage.tsx`**.
2.  **Locate the `handleSendMessage` function**.
3.  **Modify the logic** to change how new messages are created and added to the conversation.

```typescript
// src/components/MessagesPage.tsx

const handleSendMessage = () => {
  if (newMessage.trim() === "" || !selectedThread) return;

  const newMsg: Message = {
    id: Date.now().toString(),
    sender: "You",
    text: newMessage,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // ... logic to update the threads state

  setNewMessage("");
};
```

---

## 4. How to Add Items

### Adding a New Conversation Thread

1.  **Open `src/data/mockMessages.ts`**.
2.  **Add a new thread object** to the `mockThreads` array.
3.  **Ensure the new object follows the `Thread` interface**.

```typescript
// src/data/mockMessages.ts

export const mockThreads: Thread[] = [
  // ... existing threads
  {
    id: "4",
    participant: "Community Support",
    avatar: "/api/placeholder/40/40",
    lastMessage: "How can we help you today?",
    timestamp: "9:00 AM",
    unread: 0,
    messages: [
      { id: "msg1", sender: "Community Support", text: "Welcome to Unity Collective! How can we help you today?", timestamp: "9:00 AM" }
    ]
  }
];
```

### Adding a New Message to a Conversation

To add a new message to an existing conversation, you would modify the `messages` array within the corresponding thread object in `src/data/mockMessages.ts`.

---

## 5. Future Improvements

- **Real-Time Messaging**: The messaging system should be connected to a real-time database like Firebase Firestore to enable instant message delivery.
- **User Authentication**: The `currentUser` should be determined by the authenticated user, not hardcoded.
- **New Conversation Creation**: Users should be able to start new conversations with other users, not just reply to existing threads.
- **Search**: A search functionality to find specific messages or conversations would be useful.
- **Rich Media**: The messaging system could be enhanced to support sending images, files, and other rich media.
