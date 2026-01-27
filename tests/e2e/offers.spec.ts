import { test, expect } from '@playwright/test';

test.describe('Offers Page Visual Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/offers');
  });

  test('should display offers page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Community Offers|Offers/i })).toBeVisible();
  });

  test('should display Create Offer button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Create Offer/i })).toBeVisible();
  });

  test('should display search and filter controls', async ({ page }) => {
    // Check search bar
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display all 4 offers from mock data', async ({ page }) => {
    // Offer 1: Looking for Web Development Services
    await expect(page.getByText('Looking for Web Development Services')).toBeVisible();
    await expect(page.getByText('John Smith')).toBeVisible();
    
    // Offer 2: Offering Catering Services
    await expect(page.getByText('Offering Catering Services')).toBeVisible();
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    
    // Offer 3: Need Logo Design
    await expect(page.getByText('Need Logo Design')).toBeVisible();
    await expect(page.getByText('Marcus Williams')).toBeVisible();
    
    // Offer 4: Photography Services Available
    await expect(page.getByText('Photography Services Available')).toBeVisible();
    await expect(page.getByText('Lisa Brown')).toBeVisible();
  });

  test('should display correct status indicators for offers', async ({ page }) => {
    // Check for status badges/indicators
    // Note: Adjust selectors based on actual implementation
    
    // Open status (green)
    const openBadges = page.getByText(/open/i);
    await expect(openBadges.first()).toBeVisible();
    
    // In-progress status (yellow)
    const inProgressBadges = page.getByText(/in-progress|in progress/i);
    await expect(inProgressBadges.first()).toBeVisible();
    
    // Completed status (gray)
    const completedBadges = page.getByText(/completed/i);
    await expect(completedBadges.first()).toBeVisible();
  });

  test('should display response counts for offers', async ({ page }) => {
    // Offer 1 has 3 responses
    await expect(page.getByText(/3.*response/i)).toBeVisible();
    
    // Offer 2 has 5 responses
    await expect(page.getByText(/5.*response/i)).toBeVisible();
    
    // Offer 3 has 8 responses
    await expect(page.getByText(/8.*response/i)).toBeVisible();
    
    // Offer 4 has 2 responses
    await expect(page.getByText(/2.*response/i)).toBeVisible();
  });

  test('should have clickable View/Respond buttons', async ({ page }) => {
    const viewButtons = page.getByRole('button', { name: /View|Respond/i });
    await expect(viewButtons.first()).toBeVisible();
    
    // Check that we have multiple buttons (one per offer)
    const count = await viewButtons.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
