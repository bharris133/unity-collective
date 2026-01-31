# Deployment Procedures Guide

**Date**: January 30, 2026  
**Repository**: https://github.com/bharris133/unity-collective  
**Status**: ✅ Up-to-date

---

## 1. Overview

This guide is the **single source of truth** for deploying the Unity Collective application. It covers environment setup, building the application, and deploying to a hosting provider.

---

## 2. Environment Setup

### **Prerequisites**

-   Node.js (v18 or later)
-   pnpm
-   Firebase CLI

### **Local Setup**

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/bharris133/unity-collective.git
    cd unity-collective
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Set up environment variables**:
    ```bash
    cp .env.example .env
    ```
    Fill in the required values in the `.env` file. For more details, see the [Firebase Setup Guide](../development/FIREBASE_SETUP_GUIDE.md).

---

## 3. Building for Production

To create a production-ready build of the application, run the following command:

```bash
pnpm run build
```

This will create a `dist` directory with the optimized and minified application files.

---

## 4. Deployment

We recommend deploying the application to a modern hosting provider that supports Node.js and has a global CDN, such as Vercel, Netlify, or Firebase Hosting.

### **Deploying to Vercel (Recommended)**

1.  **Import your project** into Vercel.
2.  **Configure the project settings**:
    -   **Build Command**: `pnpm run build`
    -   **Output Directory**: `dist`
    -   **Install Command**: `pnpm install`
3.  **Add your environment variables** in the Vercel project settings.
4.  **Deploy!** Vercel will automatically build and deploy your application.

### **Deploying to Firebase Hosting**

1.  **Initialize Firebase Hosting**:
    ```bash
    firebase init hosting
    ```
    -   Select your Firebase project.
    -   Set `dist` as the public directory.
    -   Configure as a single-page app (rewrite all URLs to /index.html).

2.  **Deploy**:
    ```bash
    firebase deploy --only hosting
    ```

---

## 5. Troubleshooting

### **Build Fails**

-   Ensure all dependencies are installed correctly (`pnpm install`).
-   Check that your Node.js version is compatible.

### **Deployment Fails**

-   Verify that all environment variables are set correctly in your hosting provider's settings.
-   Check the build logs for any errors.

### **Application Errors**

-   Check the browser console for any runtime errors.
-   Ensure your Firebase security rules are configured correctly.

---

This centralized guide should be the single source of truth for all deployment procedures. All other documents should reference this guide instead of duplicating the information.
