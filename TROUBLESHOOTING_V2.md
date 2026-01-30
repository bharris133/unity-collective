# Unity Collective - Troubleshooting Guide

This guide provides solutions to common issues that you may encounter during local development, deployment, or general use of the Unity Collective platform.

## Local Development Issues

### **Issue: `pnpm run dev` fails with a port-in-use error.**

-   **Cause**: Another application on your machine is already using the default port (5173).
-   **Solution**: Run the development server on a different port by using the `--port` flag.
    ```bash
    pnpm run dev --port 5174
    ```

### **Issue: The application loads, but images are broken.**

-   **Cause**: This can happen if the image paths are incorrect or if the assets are not being served correctly.
-   **Solution**:
    1.  Ensure that all image assets are located in the `src/assets` directory.
    2.  Verify that the image paths in your components are correct. For example: `import myImage from ‘../assets/my-image.png’;`
    3.  If using placeholder images (e.g., `/api/placeholder/300/200`), these will appear as broken images locally as they are intended to be replaced by a real backend service.

### **Issue: I get a `404 Not Found` error when I refresh a page other than the homepage.**

-   **Cause**: This is a common issue with Single-Page Applications (SPAs) when the development server is not configured to handle client-side routing correctly. The server looks for a file at the given path instead of serving `index.html`.
-   **Solution**: The Vite development server (`pnpm run dev`) should handle this automatically. If you are using a different server to preview the `dist` build, ensure it is configured for SPAs. For example, with the `serve` package:
    ```bash
    serve dist --single
    ```

### **Issue: I see Firebase or Stripe related errors in the browser console.**

-   **Cause**: The application is attempting to connect to Firebase or Stripe, but the environment variables are not configured correctly.
-   **Solution**:
    1.  Ensure you have a `.env` file in the root of your project.
    2.  Copy the contents of `.env.example` into your `.env` file.
    3.  Fill in the `VITE_FIREBASE_*` and `VITE_STRIPE_PUBLISHABLE_KEY` variables with your **test/development keys** from your Firebase and Stripe dashboards.
    4.  Restart the development server (`pnpm run dev`).

## Deployment Issues

### **Issue: The deployment build fails on Vercel/Netlify.**

-   **Cause**: This can be due to a variety of reasons, including missing dependencies, incorrect build settings, or code that fails to compile.
-   **Solution**:
    1.  **Check the Build Logs**: The first step is always to check the detailed build logs provided by your hosting provider. They will usually contain the specific error message.
    2.  **Run Build Locally**: Try to replicate the issue by running the production build command locally.
        ```bash
        pnpm run build
        ```
    3.  **Check Node.js Version**: Ensure that the Node.js version used by your hosting provider matches the one you are using for development (v22.x).

### **Issue: The deployed site loads, but I get 404 errors on page refresh.**

-   **Cause**: The hosting provider is not correctly configured to handle SPA routing.
-   **Solution**: For Vercel and Netlify, this should be handled automatically when they detect a Vite project. If it is not, you may need to add a rewrite rule. Create a `vercel.json` or `netlify.toml` file in your project root.

    **`vercel.json`**
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```

    **`netlify.toml`**
    ```toml
    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```

## Application Usage Issues

### **Issue: I can add items to the cart, but the final checkout fails.**

-   **Cause**: This is expected behavior if the backend (Firebase Cloud Functions) is not deployed or if the Stripe keys are not configured correctly in the production environment.
-   **Solution**: Follow the `DEPLOYMENT_GUIDE.md` to:
    1.  Deploy the Firebase Cloud Functions.
    2.  Set the production Stripe secret key in the function environment variables.
    3.  Configure the Stripe webhook to handle successful payments.

### **Issue: The Favorites page is blank.**

-   **Cause**: This is a known issue. The `FavoritesPage` component has not yet been implemented.
-   **Solution**: This feature is on the project roadmap. A developer will need to create the `FavoritesPage.tsx` component, wire it up to the `FavoritesContext`, and implement the UI for displaying and managing favorite items.
