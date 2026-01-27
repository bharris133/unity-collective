import { test, expect } from '@playwright/test';

test.describe('Marketplace Visual Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace');
  });

  test('should display marketplace page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Marketplace/i })).toBeVisible();
  });

  test('should display search and filter controls', async ({ page }) => {
    // Check search bar
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    // Check filter dropdowns (if present)
    // Note: Adjust selectors based on actual implementation
  });

  test('should display all 6 products from mock data', async ({ page }) => {
    // Product 1: Unity Collective T-Shirt
    await expect(page.getByText('Unity Collective T-Shirt')).toBeVisible();
    await expect(page.getByText('$24.99')).toBeVisible();
    
    // Product 2: Heritage Blend Coffee
    await expect(page.getByText('Heritage Blend Coffee')).toBeVisible();
    await expect(page.getByText('$18.99')).toBeVisible();
    
    // Product 3: Business Strategy Guide
    await expect(page.getByText('Business Strategy Guide')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    
    // Product 4: Unity Collective Hoodie
    await expect(page.getByText('Unity Collective Hoodie')).toBeVisible();
    await expect(page.getByText('$49.99')).toBeVisible();
    
    // Product 5: African Spice Collection
    await expect(page.getByText('African Spice Collection')).toBeVisible();
    await expect(page.getByText('$34.99')).toBeVisible();
    
    // Product 6: Web Development Course
    await expect(page.getByText('Web Development Course')).toBeVisible();
    await expect(page.getByText('$199.99')).toBeVisible();
  });

  test('should display Add to Cart buttons for all products', async ({ page }) => {
    const addToCartButtons = page.getByRole('button', { name: /Add to Cart/i });
    await expect(addToCartButtons.first()).toBeVisible();
    
    // Check that we have multiple Add to Cart buttons (one per product)
    const count = await addToCartButtons.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should be able to add product to cart', async ({ page }) => {
    // Click the first "Add to Cart" button
    const firstAddToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await firstAddToCartButton.click();
    
    // Wait for cart to update (adjust selector based on implementation)
    // This might show a notification or update a cart icon badge
    await page.waitForTimeout(500);
  });

  test('should navigate to product detail page when clicking product', async ({ page }) => {
    // Click on the first product
    await page.getByText('Unity Collective T-Shirt').click();
    
    // Wait for navigation
    await page.waitForURL(/\/products\/.+/);
    
    // Verify we're on the product detail page
    await expect(page.getByText('Unity Collective T-Shirt')).toBeVisible();
    await expect(page.getByText('$24.99')).toBeVisible();
  });
});
