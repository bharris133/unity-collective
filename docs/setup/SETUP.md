# Unity Collective - Setup Instructions

Complete guide to setting up the Unity Collective platform for local development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher (Install: `npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))
- **Firebase CLI** (Install: `npm install -g firebase-tools`)
- **Code Editor** (VS Code recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/bharris133/unity-collective.git
cd unity-collective
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
pnpm install

# Install Firebase Functions dependencies
cd functions
pnpm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Configuration (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Optional: Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id
```

Create `functions/.env` for Cloud Functions:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Firebase Setup

#### Initialize Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init

# Select:
# - Hosting
# - Functions
# - Firestore
```

#### Configure Firestore Security Rules

Update `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Vendors collection
    match /vendors/{vendorId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.vendorId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.vendorIds);
      allow write: if request.auth != null;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Offers collection
    match /offers/{offerId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.recipientId == request.auth.uid);
      allow create: if request.auth != null;
    }
  }
}
```

#### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Run Development Server

```bash
# Start frontend development server
pnpm dev

# In another terminal, start Firebase emulators (optional)
firebase emulators:start
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration Details

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → General
4. Scroll to "Your apps" and click "Web" icon
5. Copy the configuration values to your `.env` file

### Stripe Configuration

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your **Publishable Key** (starts with `pk_test_`)
3. Get your **Secret Key** (starts with `sk_test_`)
4. For webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/stripeWebhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook secret (starts with `whsec_`)

### Firebase Functions Environment Variables

```bash
# Set environment variables for Cloud Functions
firebase functions:config:set stripe.secret_key="sk_test_your_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_secret"
```

## 📁 Project Structure

```
unity-collective/
├── src/
│   ├── components/          # React components
│   ├── contexts/            # React contexts (state management)
│   ├── types/               # TypeScript type definitions
│   ├── __tests__/           # Test files
│   ├── App.jsx              # Main app component
│   ├── firebase.js          # Firebase configuration
│   └── main.jsx             # Entry point
├── functions/               # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts         # Functions entry point
│   ├── package.json
│   └── tsconfig.json
├── public/                  # Static assets
├── dist/                    # Production build output
├── .env                     # Environment variables (not in git)
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── vitest.config.ts         # Test configuration
└── README.md                # Project documentation
```

## 🧪 Verify Installation

Run the test suite to verify everything is working:

```bash
pnpm test
```

All 112 tests should pass.

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
pnpm dev --port 3000
```

### Firebase Authentication Errors

1. Enable authentication methods in Firebase Console:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google (optional)

### Stripe Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5001/your-project/us-central1/stripeWebhook
```

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

Restart your TypeScript server in VS Code:
- Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type "TypeScript: Restart TS Server"

## 📚 Next Steps

- Read [TESTING.md](./TESTING.md) for testing guidelines
- Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for development workflows
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## 🆘 Getting Help

- Check the [GitHub Issues](https://github.com/bharris133/unity-collective/issues)
- Review the [Developer Guide](./DEVELOPER_GUIDE.md)
- Contact the development team

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Repository cloned
- [ ] Dependencies installed (frontend + functions)
- [ ] `.env` file created and configured
- [ ] Firebase project created
- [ ] Firestore rules deployed
- [ ] Stripe account configured
- [ ] Development server running
- [ ] All tests passing
- [ ] Firebase emulators working (optional)

**You're ready to start developing! 🚀**
