# 🚀 Local Agent Setup & Visual Testing Primer

**Goal**: Set up the Unity Collective application locally and run it for visual testing.

---

## 1. Prerequisites

Ensure you have the following installed:
- **Git**
- **Node.js** (v18 or later)
- **pnpm**

---

## 2. Setup Instructions

Follow these steps to get the application running:

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/bharris133/unity-collective.git
cd unity-collective
```

### **Step 2: Install Dependencies**
```bash
pnpm install
```

### **Step 3: Set Up Environment Variables**
Create a `.env` file by copying the example file:
```bash
cp .env.example .env
```

**Important**: The default settings in `.env` will enable mock data and mock authentication, which is what you need for visual testing.

---

## 3. Running the Application

Start the development server:
```bash
pnpm run dev
```

---

## 4. Verification

Once the server is running, you should see:

```
  VITE v5.2.11  ready in 1.25s

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open your browser to **http://localhost:5173/** to see the application.

---

## 5. Visual Testing

Now that the application is running, your task is to perform a complete visual test.

### **Follow the Visual Testing Checklist**

All testing procedures are documented in:
**`docs/testing/VISUAL_TESTING_GUIDE.md`**

Follow this guide to test all features, including:
- Homepage
- Business Directory
- Community Offers
- Marketplace
- Mock Authentication (use the purple settings icon in the bottom-right)

### **Your Goal**
Verify that all pages render correctly, data is displayed properly, and all interactive elements work as expected.
