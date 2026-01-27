import { test, expect } from '@playwright/test';

test.describe('Messages Page Visual Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/messages');
  });

  test('should display messages page with two-panel layout', async ({ page }) => {
    // Check that the page has loaded
    await expect(page.getByRole('heading', { name: /Messages/i })).toBeVisible();
  });

  test.describe('Thread List View', () => {
    test('should display all 3 message threads', async ({ page }) => {
      // Thread 1: John Smith & Sarah Johnson
      await expect(page.getByText('Sarah Johnson')).toBeVisible();
      await expect(page.getByText(/That sounds great! When can we start?/)).toBeVisible();
      
      // Thread 2: John Smith & Marcus Williams
      await expect(page.getByText('Marcus Williams')).toBeVisible();
      await expect(page.getByText(/I can help with that. Let me send you my portfolio./)).toBeVisible();
      
      // Thread 3: John Smith & Lisa Brown
      await expect(page.getByText('Lisa Brown')).toBeVisible();
      await expect(page.getByText(/Thanks for your interest! Here are the details.../)).toBeVisible();
    });

    test('should display unread count for threads with unread messages', async ({ page }) => {
      // Thread 1 has 2 unread messages
      await expect(page.getByText('2')).toBeVisible();
    });

    test('should display related offer titles', async ({ page }) => {
      // Thread 1 related to "Looking for Web Development Services"
      await expect(page.getByText('Looking for Web Development Services')).toBeVisible();
      
      // Thread 2 related to "Need Logo Design"
      await expect(page.getByText('Need Logo Design')).toBeVisible();
      
      // Thread 3 related to "Offering Catering Services"
      await expect(page.getByText('Offering Catering Services')).toBeVisible();
    });
  });

  test.describe('Conversation View', () => {
    test('should display conversation when clicking a thread', async ({ page }) => {
      // Click on the first thread
      await page.getByText('Sarah Johnson').click();
      
      // Wait for conversation to load
      await page.waitForTimeout(500);
      
      // Check that conversation messages are displayed
      await expect(page.getByText(/Hi! I saw your offer for web development/)).toBeVisible();
      await expect(page.getByText(/Great! What kind of projects have you worked on?/)).toBeVisible();
      await expect(page.getByText(/I specialize in React and Node.js/)).toBeVisible();
      await expect(page.getByText(/That sounds great! When can we start?/)).toBeVisible();
    });

    test('should display message input and send button', async ({ page }) => {
      // Click on the first thread
      await page.getByText('Sarah Johnson').click();
      
      // Wait for conversation to load
      await page.waitForTimeout(500);
      
      // Check for message input field
      const messageInput = page.getByPlaceholder(/Type a message|Message/i);
      await expect(messageInput).toBeVisible();
      
      // Check for send button
      await expect(page.getByRole('button', { name: /Send/i })).toBeVisible();
    });

    test('should display participant names in header', async ({ page }) => {
      // Click on the first thread
      await page.getByText('Sarah Johnson').click();
      
      // Wait for conversation to load
      await page.waitForTimeout(500);
      
      // Check that participant names are in the header
      await expect(page.getByText(/John Smith|Sarah Johnson/)).toBeVisible();
    });
  });

  test('should have search functionality', async ({ page }) => {
    // Check for search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });
});
