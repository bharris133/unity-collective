import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Hero Section', () => {
    test('should display hero section with correct content', async ({ page }) => {
      // Check main headline
      await expect(page.getByText('Empowering Our Community Through Unity and Economic Strength')).toBeVisible();
      
      // Check sub-headline about five pillars
      await expect(page.getByText(/Building a stronger Black community through the five pillars/)).toBeVisible();
      
      // Check CTA buttons
      await expect(page.getByRole('button', { name: /Join the Movement/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Learn More/i })).toBeVisible();
    });
  });

  test.describe('Community Statistics Dashboard', () => {
    test('should display correct community statistics', async ({ page }) => {
      // Check members stat
      await expect(page.getByText('15,247')).toBeVisible();
      await expect(page.getByText(/members/i)).toBeVisible();
      
      // Check businesses stat
      await expect(page.getByText('3,892')).toBeVisible();
      await expect(page.getByText(/businesses/i)).toBeVisible();
      
      // Check events stat
      await expect(page.getByText('156')).toBeVisible();
      await expect(page.getByText(/events/i)).toBeVisible();
      
      // Check economic impact stat
      await expect(page.getByText('$2.3M')).toBeVisible();
      await expect(page.getByText(/impact/i)).toBeVisible();
    });
  });

  test.describe('The Five Pillars Section', () => {
    test('should display all five pillars', async ({ page }) => {
      await expect(page.getByText('The Five Pillars of Unity Collective')).toBeVisible();
      
      // Check each pillar
      await expect(page.getByText('Unity')).toBeVisible();
      await expect(page.getByText('Economic Control')).toBeVisible();
      await expect(page.getByText('Self-Sufficiency')).toBeVisible();
      await expect(page.getByText('Protection')).toBeVisible();
      await expect(page.getByText('Control of Our Narrative')).toBeVisible();
    });
  });

  test.describe('Featured Businesses Section', () => {
    test('should display featured businesses with correct details', async ({ page }) => {
      await expect(page.getByText('Featured Businesses')).toBeVisible();
      
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
      
      // Check "View All Businesses" button
      await expect(page.getByRole('link', { name: /View All Businesses/i })).toBeVisible();
    });
  });

  test.describe('Upcoming Events Section', () => {
    test('should display upcoming events with correct details', async ({ page }) => {
      await expect(page.getByText('Upcoming Events')).toBeVisible();
      
      // Event 1: Economic Empowerment Webinar
      await expect(page.getByText('Economic Empowerment Webinar')).toBeVisible();
      await expect(page.getByText(/2025-08-25/)).toBeVisible();
      await expect(page.getByText(/Virtual/)).toBeVisible();
      
      // Event 2: Black Business Networking Mixer
      await expect(page.getByText('Black Business Networking Mixer')).toBeVisible();
      await expect(page.getByText(/2025-09-02/)).toBeVisible();
      await expect(page.getByText(/In-Person/)).toBeVisible();
      
      // Event 3: Financial Literacy Workshop
      await expect(page.getByText('Financial Literacy Workshop')).toBeVisible();
      await expect(page.getByText(/2025-09-10/)).toBeVisible();
    });
  });

  test.describe('Newsletter Signup Section', () => {
    test('should display newsletter signup form', async ({ page }) => {
      await expect(page.getByText('Stay Connected')).toBeVisible();
      
      // Check email input field
      const emailInput = page.getByPlaceholder(/email/i);
      await expect(emailInput).toBeVisible();
      
      // Check subscribe button
      await expect(page.getByRole('button', { name: /Subscribe/i })).toBeVisible();
    });
  });
});
