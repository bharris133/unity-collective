import { test, expect } from '@playwright/test';

test.describe('Business Directory Visual Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/businesses');
  });

  test('should display business directory page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Business Directory/i })).toBeVisible();
  });

  test('should display search bar', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display all 6 businesses from mock data', async ({ page }) => {
    // Business 1: Sankofa Consulting
    await expect(page.getByText('Sankofa Consulting')).toBeVisible();
    await expect(page.getByText('Business Services')).toBeVisible();
    await expect(page.getByText('Atlanta, GA')).toBeVisible();
    await expect(page.getByText('4.9')).toBeVisible();
    
    // Business 2: Heritage Foods Market
    await expect(page.getByText('Heritage Foods Market')).toBeVisible();
    await expect(page.getByText('Food & Beverage')).toBeVisible();
    await expect(page.getByText('Detroit, MI')).toBeVisible();
    await expect(page.getByText('4.8')).toBeVisible();
    
    // Business 3: Unity Tech Solutions
    await expect(page.getByText('Unity Tech Solutions')).toBeVisible();
    await expect(page.getByText('Technology')).toBeVisible();
    await expect(page.getByText('Oakland, CA')).toBeVisible();
    await expect(page.getByText('5.0')).toBeVisible();
    
    // Business 4: Afrocentric Books & Art
    await expect(page.getByText('Afrocentric Books & Art')).toBeVisible();
    await expect(page.getByText('Retail')).toBeVisible();
    await expect(page.getByText('Chicago, IL')).toBeVisible();
    await expect(page.getByText('4.7')).toBeVisible();
    
    // Business 5: Wellness by Imani
    await expect(page.getByText('Wellness by Imani')).toBeVisible();
    await expect(page.getByText('Healthcare')).toBeVisible();
    await expect(page.getByText('Houston, TX')).toBeVisible();
    await expect(page.getByText('4.9')).toBeVisible();
    
    // Business 6: Black Excellence Academy
    await expect(page.getByText('Black Excellence Academy')).toBeVisible();
    await expect(page.getByText('Education')).toBeVisible();
    await expect(page.getByText('Philadelphia, PA')).toBeVisible();
    await expect(page.getByText('5.0')).toBeVisible();
  });

  test('should display verified badges for all businesses', async ({ page }) => {
    // All mock businesses are verified
    // Check for verified icon or badge (adjust selector based on implementation)
    const verifiedBadges = page.locator('[aria-label*="verified" i], [title*="verified" i]');
    const count = await verifiedBadges.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should navigate to vendor storefront when clicking business', async ({ page }) => {
    // Click on the first business
    await page.getByText('Sankofa Consulting').click();
    
    // Wait for navigation
    await page.waitForURL(/\/businesses\/\d+/);
    
    // Verify we're on the vendor storefront page
    await expect(page.getByText('Sankofa Consulting')).toBeVisible();
    await expect(page.getByText('Strategic business consulting for Black entrepreneurs')).toBeVisible();
  });

  test('should display business descriptions', async ({ page }) => {
    await expect(page.getByText('Strategic business consulting for Black entrepreneurs')).toBeVisible();
    await expect(page.getByText('Authentic African and Caribbean cuisine and groceries')).toBeVisible();
    await expect(page.getByText('Custom software development and IT services')).toBeVisible();
  });
});
