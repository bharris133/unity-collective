# Firebase Setup Guide

**Date**: January 30, 2026  
**Repository**: https://github.com/bharris133/unity-collective  
**Status**: ✅ Up-to-date

---

## 1. Overview

This guide is the **single source of truth** for setting up and configuring Firebase for the Unity Collective application. It covers creating a Firebase project, configuring your local environment, and setting up the required services.

---

## 2. Creating a Firebase Project

1.  **Go to the Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  **Create a new project**: Click "Add project" and follow the on-screen instructions.
3.  **Enable services**: In your new project, enable the following services:
    -   **Authentication**: For user sign-up and sign-in.
    -   **Firestore Database**: For data storage.
    -   **Cloud Functions**: For backend logic.
    -   **Storage**: For file uploads (e.g., product images).

---

## 3. Configuring Your Local Environment

### **Step 1: Get Firebase Credentials**

1.  In your Firebase project, go to **Project settings** (click the gear icon).
2.  Under the **General** tab, find the **Your apps** section.
3.  Click the **Web** icon (`</>`) to create a new web app configuration.
4.  Copy the `firebaseConfig` object. It will look like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "...",
      appId: "..."
    };
    ```

### **Step 2: Update Your `.env` File**

1.  Create a `.env` file if you don't have one:
    ```bash
    cp .env.example .env
    ```

2.  Open the `.env` file and fill in the Firebase credentials from the `firebaseConfig` object:

    ```
    VITE_FIREBASE_API_KEY=your-apiKey-here
    VITE_FIREBASE_AUTH_DOMAIN=your-authDomain-here
    VITE_FIREBASE_PROJECT_ID=your-projectId-here
    VITE_FIREBASE_STORAGE_BUCKET=your-storageBucket-here
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messagingSenderId-here
    VITE_FIREBASE_APP_ID=your-appId-here
    ```

### **Step 3: Set Data Source to Live**

To use your live Firebase data, set the following in your `.env` file:

```
VITE_USE_MOCK_DATA=false
```

For more details, see the [Data Source Switching Guide](./DATA_SOURCE_SWITCHING_GUIDE.md).

---

## 4. Setting Up Firestore

### **Creating Collections**

In the Firestore Database section of the Firebase console, create the following collections:

-   `businesses`
-   `products`
-   `offers`
-   `events`
-   `users`
-   `messages`

### **Security Rules**

It is **critical** to set up security rules to protect your data. A basic set of rules might look like this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access for most collections
    match /{collection}/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }

    // Restrict access to user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Note**: These are basic rules. You should refine them based on your application's specific needs.

---

## 5. Setting Up Authentication

1.  In the Firebase console, go to the **Authentication** section.
2.  Under the **Sign-in method** tab, enable the sign-in providers you want to support (e.g., Email/Password, Google, etc.).

---

This centralized guide should be the single source of truth for Firebase setup. All other documents should reference this guide instead of duplicating the information.
