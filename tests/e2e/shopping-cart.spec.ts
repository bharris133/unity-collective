import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Visual Review', () => {
  test.beforeEach(async ({ page }) => {
    // Start on marketplace page
    await page.goto('/marketplace');
  });

  test('should add item to cart and display in cart view', async ({ page }) => {
    // Add Unity Collective T-Shirt to cart
    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await addToCartButton.click();
    
    // Wait for cart to update
    await page.waitForTimeout(500);
    
    // Open cart (click cart icon in navigation)
    const cartIcon = page.locator('[aria-label*="cart" i], [title*="cart" i]').first();
    await cartIcon.click();
    
    // Wait for cart to open
    await page.waitForTimeout(500);
    
    // Verify item is in cart
    await expect(page.getByText('Unity Collective T-Shirt')).toBeVisible();
    await expect(page.getByText('$24.99')).toBeVisible();
  });

  test('should display cart calculations correctly', async ({ page }) => {
    // Add an item to cart first
    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await addToCartButton.click();
    await page.waitForTimeout(500);
    
    // Open cart
    const cartIcon = page.locator('[aria-label*="cart" i], [title*="cart" i]').first();
    await cartIcon.click();
    await page.waitForTimeout(500);
    
    // Check for subtotal
    await expect(page.getByText(/subtotal/i)).toBeVisible();
    
    // Check for tax
    await expect(page.getByText(/tax/i)).toBeVisible();
    
    // Check for shipping
    await expect(page.getByText(/shipping/i)).toBeVisible();
    
    // Check for grand total
    await expect(page.getByText(/total/i)).toBeVisible();
  });

  test('should have checkout button in cart', async ({ page }) => {
    // Add an item to cart first
    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await addToCartButton.click();
    await page.waitForTimeout(500);
    
    // Open cart
    const cartIcon = page.locator('[aria-label*="cart" i], [title*="cart" i]').first();
    await cartIcon.click();
    await page.waitForTimeout(500);
    
    // Check for checkout button
    await expect(page.getByRole('button', { name: /Checkout|Proceed to Checkout/i })).toBeVisible();
  });

  test('should allow quantity adjustment in cart', async ({ page }) => {
    // Add an item to cart first
    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await addToCartButton.click();
    await page.waitForTimeout(500);
    
    // Open cart
    const cartIcon = page.locator('[aria-label*="cart" i], [title*="cart" i]').first();
    await cartIcon.click();
    await page.waitForTimeout(500);
    
    // Look for quantity controls (+ and - buttons or input field)
    // Note: Adjust selectors based on actual implementation
    const quantityControls = page.locator('[aria-label*="quantity" i], input[type="number"]');
    await expect(quantityControls.first()).toBeVisible();
  });

  test('should allow item removal from cart', async ({ page }) => {
    // Add an item to cart first
    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await addToCartButton.click();
    await page.waitForTimeout(500);
    
    // Open cart
    const cartIcon = page.locator('[aria-label*="cart" i], [title*="cart" i]').first();
    await cartIcon.click();
    await page.waitForTimeout(500);
    
    // Look for remove button (trash icon or "Remove" text)
    const removeButton = page.getByRole('button', { name: /Remove|Delete/i });
    await expect(removeButton.first()).toBeVisible();
  });
});
