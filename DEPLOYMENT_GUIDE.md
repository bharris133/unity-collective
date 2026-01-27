# Unity Collective - Deployment Guide

This guide provides comprehensive instructions for deploying the Unity Collective platform to a permanent, production-ready hosting environment. It covers backend configuration, frontend deployment, and post-launch steps.

## 1. Pre-Deployment: Backend Configuration

Before deploying the frontend, you **must** configure and deploy the production backend, which includes Firebase Cloud Functions and Stripe webhooks.

### **Step 1: Set Up Production Firebase Project**

- Create a new Firebase project dedicated to production.
- Enable **Authentication** (with Email/Password provider), **Firestore**, and **Cloud Functions**.
- Go to **Project Settings** and create a new **Web App**. Copy the configuration keys; you will need them for the frontend deployment.

### **Step 2: Configure and Deploy Cloud Functions**

1.  **Authenticate with Firebase CLI**:
    ```bash
    firebase login
    ```

2.  **Select Your Production Project**:
    ```bash
    firebase use your-production-project-id
    ```

3.  **Set Production Environment Variables**:
    Run the following commands, replacing the placeholders with your **LIVE Stripe keys**.
    ```bash
    # Set the Stripe secret key (sk_live_...)
    firebase functions:config:set stripe.secret_key="your_live_stripe_secret_key"

    # Set the Stripe webhook secret (whsec_...)
    firebase functions:config:set stripe.webhook_secret="your_live_stripe_webhook_secret"
    ```

4.  **Deploy the Functions**:
    ```bash
    firebase deploy --only functions
    ```
    After deployment, Firebase will provide a URL for your `stripeWebhook` function. Copy this URL.

### **Step 3: Configure Production Stripe Webhook**

1.  Go to your **Stripe Dashboard** and ensure you are in **LIVE mode**.
2.  Navigate to **Developers > Webhooks**.
3.  Click **Add endpoint**.
4.  For the **Endpoint URL**, paste the function URL you copied from the Firebase deployment.
5.  For the events to listen to, select `checkout.session.completed`.
6.  Click **Add endpoint**.

Your backend is now ready for production.

## 2. Frontend Deployment Options

We recommend using a modern hosting platform like Vercel or Netlify for the best performance and developer experience.

### **Option 1: Vercel (Recommended)**

1.  **Sign Up**: Create a free Vercel account using your GitHub account.
2.  **Import Project**: In the Vercel dashboard, click **Add New... > Project** and select your `unity-collective` GitHub repository.
3.  **Configure Project**:
    - **Framework Preset**: Vercel will automatically detect **Vite**.
    - **Build and Output Settings**: Defaults are correct (`pnpm run build`, `dist` directory).
    - **Environment Variables**: Add all the `VITE_` variables from your `.env.example` file. Use the **production keys** from your Firebase web app and your **LIVE Stripe Publishable Key** (`pk_live_...`).
4.  **Deploy**: Click the **Deploy** button. Vercel will build and deploy your site.

### **Option 2: Netlify**

1.  **Sign Up**: Create a free Netlify account.
2.  **Import Project**: Click **New site from Git**, choose your Git provider, and select the `unity-collective` repository.
3.  **Configure Build Settings**:
    - **Build command**: `pnpm run build`
    - **Publish directory**: `dist`
4.  **Environment Variables**: Similar to Vercel, add your production `VITE_` keys in the site settings under **Build & deploy > Environment**.
5.  **Deploy**: Click **Deploy site**.

## 3. Post-Deployment

### **Step 1: Add a Custom Domain**

To make your site permanent, add a custom domain you own:

1.  Go to your project's dashboard on Vercel or Netlify.
2.  Navigate to the **Domains** tab.
3.  Add your custom domain and follow the instructions to update your DNS records (usually an `A` or `CNAME` record) with your domain registrar.

Both platforms will automatically provision a free SSL certificate for your domain.

### **Step 2: Final Checks**

- **Test Live Site**: Thoroughly test all features, including user registration, marketplace browsing, and the checkout flow.
- **Analytics**: Add your Google Analytics tracking ID to `index.html` to monitor traffic.
- **SEO**: Add Open Graph (OG) and Twitter meta tags to `index.html` for better social media sharing.

## 4. Continuous Deployment

Both Vercel and Netlify set up a Git integration by default. This means every time you push a new commit to your `main` branch, the platform will automatically trigger a new build and deployment, keeping your live site up-to-date seamlessly.

---

Congratulations! Your Unity Collective platform is now permanently deployed and live on the web. ✊🏿
