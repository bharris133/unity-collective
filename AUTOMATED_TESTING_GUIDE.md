# Unity Collective - Automated Testing Guide

This guide explains how to run the automated visual review test suite using Playwright. These tests are designed to verify that all UI components are rendering correctly with the mock data, based on the `VISUAL_REVIEW_CHECKLIST.md`.

## Prerequisites

1.  **Node.js and pnpm**: Ensure you have Node.js (v22.x) and pnpm installed.
2.  **Dependencies**: Install all project dependencies:
    ```bash
    pnpm install
    ```
3.  **Playwright Browsers**: Install the necessary Playwright browsers (this only needs to be done once):
    ```bash
    npx playwright install chromium
    ```

## How to Run the Tests

### **Step 1: Configure Your Environment**

Ensure your `.env` file is configured to use mock data. If you don’t have a `.env` file, create one:

```bash
cp .env.example .env
```

Then, make sure the following line is present and set to `true`:

```
VITE_USE_MOCK_DATA=true
```

### **Step 2: Run the Tests**

There are two ways to run the tests: with a graphical user interface (UI Mode) or in the command line (Headless Mode).

#### **Option A: UI Mode (Recommended for Local Development)**

Playwright's UI Mode provides a rich, interactive experience for running and debugging tests.

1.  **Start UI Mode**:
    ```bash
    pnpm exec playwright test --ui
    ```

2.  **Use the UI**:
    -   A browser window will open with the Playwright Test runner.
    -   You can select which tests to run (all, a single file, or a single test).
    -   Watch the tests run in real-time.
    -   Click on any step to see a DOM snapshot of the application at that moment.
    -   Use the "time travel" feature to debug issues.

#### **Option B: Headless Mode (for CI/CD or quick checks)**

This runs the tests in the background without opening a browser window. The results will be printed to the console.

1.  **Run all tests**:
    ```bash
    pnpm exec playwright test
    ```

2.  **Run a specific test file**:
    ```bash
    pnpm exec playwright test tests/e2e/homepage.spec.ts
    ```

3.  **Run tests in a specific browser**:
    ```bash
    pnpm exec playwright test --project=chromium
    ```

### **Step 3: View the Test Report**

After the tests have finished running in headless mode, a detailed HTML report is generated.

1.  **Open the report**:
    ```bash
    pnpm exec playwright show-report
    ```

2.  This will open a web page in your browser where you can:
    -   See a summary of all test runs.
    -   Filter by passed, failed, or skipped tests.
    -   Click on a test to see detailed steps, screenshots (on failure), and traces.

## Test File Structure

-   **Location**: All end-to-end tests are located in the `tests/e2e/` directory.
-   **Naming Convention**: Test files are named `[page-name].spec.ts`.

### **Current Test Files**:

| File | Purpose |
|------|---------|
| `homepage.spec.ts` | Verifies all sections of the homepage. |
| `business-directory.spec.ts` | Verifies the business directory page. |
| `marketplace.spec.ts` | Verifies the marketplace page. |
| `shopping-cart.spec.ts` | Verifies shopping cart functionality. |
| `offers.spec.ts` | Verifies the community offers page. |
| `messages.spec.ts` | Verifies the private messaging page. |

## Writing New Tests

When adding new features, you should also add new tests. Follow the existing pattern:

1.  **Create a new file** in `tests/e2e/` (e.g., `new-feature.spec.ts`).
2.  **Import `test` and `expect`** from `@playwright/test`.
3.  **Use `test.describe()`** to group related tests.
4.  **Use `test()`** to define individual test cases.
5.  **Use `expect()`** with Playwright's locators to make assertions about the page.

### **Example Test Case**:

```typescript
import { test, expect } from '@playwright/test';

test('should display the new feature title', async ({ page }) => {
  // Navigate to the new feature page
  await page.goto('/new-feature');
  
  // Assert that the title is visible
  await expect(page.getByRole('heading', { name: /New Feature/i })).toBeVisible();
});
```

## Best Practices

-   **Use Locators**: Prefer user-facing locators like `getByRole`, `getByText`, and `getByLabel` over CSS selectors. This makes tests more resilient to code changes.
-   **Use `test.describe()`**: Group related tests for better organization.
-   **Use `test.beforeEach()`**: Use hooks to set up common state for tests (e.g., navigating to a page).
-   **Keep Tests Independent**: Each test should be able to run on its own without depending on other tests.

By following this guide, you can easily run and expand the automated visual review test suite, ensuring the quality and stability of the Unity Collective platform.
