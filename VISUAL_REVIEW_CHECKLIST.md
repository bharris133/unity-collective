'''
# Unity Collective - Visual Review Checklist

**Objective**: To systematically verify that all UI components are rendering correctly using the centralized mock data. This checklist is designed to be used while running the application locally (`pnpm run dev`) with `VITE_USE_MOCK_DATA=true`.

**Instructions**: Go through each page and section of the application and check off the corresponding items to confirm they are displayed correctly.

---

## 1. Homepage (`/`)

### **1.1 Hero Section**

- [ ] **Background Image**: The hero banner image (`hero_banner.png`) is displayed with the Pan-African color gradient overlay.
- [ ] **Main Headline**: The text "Empowering Our Community Through Unity and Economic Strength" is displayed in a large, bold font.
- [ ] **Sub-headline**: The text about the five pillars is displayed below the main headline.
- [ ] **"Join the Movement" Button**: A button with this text is visible and clickable.
- [ ] **"Learn More" Button**: A button with this text is visible and clickable.

### **1.2 Community Statistics Dashboard**

*Data Source: `src/data/mockStats.ts`*

- [ ] **Members Stat**: Displays **15,247** members.
- [ ] **Businesses Stat**: Displays **3,892** businesses.
- [ ] **Events Stat**: Displays **156** events.
- [ ] **Economic Impact Stat**: Displays **$2.3M** economic impact.

### **1.3 The Five Pillars Section**

- [ ] **Section Title**: The title "The Five Pillars of Unity Collective" is displayed.
- [ ] **Pillar 1 (Unity)**: The card for "Unity" is displayed with its icon and description.
- [ ] **Pillar 2 (Economic Control)**: The card for "Economic Control" is displayed with its icon and description.
- [ ] **Pillar 3 (Self-Sufficiency)**: The card for "Self-Sufficiency" is displayed with its icon and description.
- [ ] **Pillar 4 (Protection)**: The card for "Protection" is displayed with its icon and description.
- [ ] **Pillar 5 (Control of Our Narrative)**: The card for "Control of Our Narrative" is displayed with its icon and description.

### **1.4 Featured Businesses Section**

*Data Source: `src/data/mockBusinesses.ts` (first 3 items)*

- [ ] **Section Title**: The title "Featured Businesses" is displayed.
- [ ] **Business Card 1**: Displays "Sankofa Consulting" with category "Business Services", location "Atlanta, GA", and a 4.9-star rating.
- [ ] **Business Card 2**: Displays "Heritage Foods Market" with category "Food & Beverage", location "Detroit, MI", and a 4.8-star rating.
- [ ] **Business Card 3**: Displays "Unity Tech Solutions" with category "Technology", location "Oakland, CA", and a 5.0-star rating.
- [ ] **"View All Businesses" Button**: A button with this text is visible and links to the Business Directory page.

### **1.5 Upcoming Events Section**

*Data Source: `src/data/mockEvents.ts` (first 3 items)*

- [ ] **Section Title**: The title "Upcoming Events" is displayed.
- [ ] **Event 1**: Displays "Economic Empowerment Webinar" for "2025-08-25" and indicates it is a "Virtual" event.
- [ ] **Event 2**: Displays "Black Business Networking Mixer" for "2025-09-02" and indicates it is an "In-Person" event in "Atlanta, GA".
- [ ] **Event 3**: Displays "Financial Literacy Workshop" for "2025-09-10" and indicates it is a "Virtual" event.
- [ ] **"View All Events" Button**: A button with this text is visible and clickable.

### **1.6 Newsletter Signup Section**

- [ ] **Section Title**: The title "Stay Connected" is displayed.
- [ ] **Email Input Field**: An input field for an email address is visible.
- [ ] **"Subscribe" Button**: A button with this text is visible and clickable.

---

## 2. Business Directory Page (`/businesses`)

*Data Source: `src/data/mockBusinesses.ts` (all 6 items)*

- [ ] **Page Title**: The title "Business Directory" is displayed.
- [ ] **Search Bar**: A search bar for filtering businesses is visible.
- [ ] **Filter Dropdowns**: Dropdowns for filtering by category and location are visible.
- [ ] **Business Cards**: All 6 businesses from `mockBusinesses.ts` are displayed as cards.
- [ ] **Card Details**: Each card correctly displays the business name, category, location, and rating.
- [ ] **Clickable Cards**: Clicking on a business card navigates to the corresponding Vendor Storefront page (e.g., `/businesses/1`).

---

## 3. Marketplace Page (`/marketplace`)

*Data Source: `src/data/mockProducts.ts` (all 6 items)*

- [ ] **Page Title**: The title "Marketplace" is displayed.
- [ ] **Search Bar**: A search bar for filtering products is visible.
- [ ] **Filter Dropdowns**: Dropdowns for filtering by category are visible.
- [ ] **Product Cards**: All 6 products from `mockProducts.ts` are displayed as cards.
- [ ] **Card Details**: Each card correctly displays the product name, price (e.g., "$24.99"), and business name.
- [ ] **"Add to Cart" Button**: Each card has a functional "Add to Cart" button.
- [ ] **Clickable Cards**: Clicking on a product card navigates to the corresponding Product Detail page (e.g., `/products/unity-tshirt-001`).

---

## 4. Product Detail Page (e.g., `/products/unity-tshirt-001`)

*Data Source: `src/data/mockProducts.ts` (single item)*

- [ ] **Product Name**: Displays "Unity Collective T-Shirt".
- [ ] **Product Images**: Displays the placeholder image for the product.
- [ ] **Product Price**: Displays the correct price ("$24.99").
- [ ] **Product Description**: Displays "Premium cotton t-shirt with Unity Collective logo".
- [ ] **Business Name**: Displays the seller, "Unity Collective".
- [ ] **Quantity Selector**: A field for selecting the quantity is visible.
- [ ] **"Add to Cart" Button**: A functional "Add to Cart" button is visible.

---

## 5. Shopping Cart

- [ ] **Open Cart**: Clicking the shopping cart icon in the navigation opens the cart view.
- [ ] **Cart Items**: Displays a list of items added to the cart, with correct names, prices, and quantities.
- [ ] **Subtotal**: Correctly calculates and displays the subtotal of all items.
- [ ] **Tax**: Displays a calculated tax amount.
- [ ] **Shipping**: Displays a shipping fee.
- [ ] **Grand Total**: Correctly calculates and displays the grand total.
- [ ] **"Checkout" Button**: A button that navigates to the checkout page is visible.

---

## 6. Offers Page (`/offers`)

*Data Source: `src/data/mockOffers.ts` (all 4 items)*

- [ ] **Page Title**: The title "Community Offers & Barter" is displayed.
- [ ] **"Create Offer" Button**: A button that navigates to the offer creation page is visible.
- [ ] **Search and Filter**: Search bar and filter dropdowns for status are visible.
- [ ] **Offer Cards**: All 4 offers from `mockOffers.ts` are displayed as cards.
- [ ] **Card Details**: Each card correctly displays the offer title, user name, and description.
- [ ] **Status Indicators**: Each card has a colored status indicator:
    - [ ] "Looking for Web Development Services" has an **open** status (e.g., green).
    - [ ] "Offering Catering Services" has an **in-progress** status (e.g., yellow).
    - [ ] "Photography Services Available" has a **completed** status (e.g., gray).
- [ ] **"View/Respond" Button**: Each card has a clickable button to view the offer details.

---

## 7. Messages Page (`/messages`)

*Data Sources: `src/data/mockThreads.ts`, `src/data/mockMessages.ts`*

### **7.1 Thread List View**

- [ ] **Page Layout**: A two-panel layout (thread list on the left, conversation on the right) is displayed.
- [ ] **Thread List**: The list on the left displays all 3 message threads from `mockThreads.ts`.
- [ ] **Thread Details**: Each item in the list correctly displays the participant names, last message, and time.
- [ ] **Unread Indicator**: The thread with "Sarah Johnson" shows an unread count of **2**.
- [ ] **Clickable Threads**: Clicking on a thread in the list opens the conversation in the right panel.

### **7.2 Conversation View** (after clicking a thread)

- [ ] **Header**: The header of the conversation panel displays the names of the participants (e.g., "John Smith, Sarah Johnson").
- [ ] **Message Bubbles**: The conversation history is displayed as a series of message bubbles.
- [ ] **Sender/Receiver Alignment**: Messages from the current user are aligned to the right, and messages from others are aligned to the left.
- [ ] **Message Content**: The content of each message from `mockMessages.ts` is displayed correctly.
- [ ] **Message Input**: A text input field for typing a new message is visible at the bottom.
- [ ] **"Send" Button**: A functional "Send" button is visible next to the input field.
'''
