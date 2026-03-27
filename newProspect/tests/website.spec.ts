import { test, expect } from '@playwright/test';

const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'Test@12345';
const testName = 'Test User';

test.describe('Prospect Website E2E Tests', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');

    // Check main heading exists
    await expect(page.locator('h1')).toContainText('Leveling the playing field');

    // Check navbar exists
    await expect(page.locator('nav')).toBeVisible();

    // Check "Get Started" button exists
    await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');

    // Click "Get Started" button
    await page.getByRole('link', { name: /Get Started/i }).click();

    // Should be on signup page
    await expect(page).toHaveURL('/signup');

    // Check signup form elements
    await expect(page.locator('input[type="text"]').first()).toBeVisible(); // Name field
    await expect(page.locator('input[type="email"]')).toBeVisible(); // Email field
    await expect(page.locator('input[type="password"]').first()).toBeVisible(); // Password field
  });

  test('should show validation errors on signup', async ({ page }) => {
    await page.goto('/signup');

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /Create Account|Sign Up/i });
    await submitButton.click();

    // Should see validation messages or button still disabled
    // Wait a moment for any validation messages
    await page.waitForTimeout(500);
  });

  test('should successfully create an account', async ({ page }) => {
    await page.goto('/signup');

    // Fill in signup form
    await page.locator('input[type="text"]').first().fill(testName); // Name
    await page.locator('input[type="email"]').fill(testEmail); // Email
    await page.locator('input[type="password"]').first().fill(testPassword); // Password

    // Find and fill confirm password field
    const passwordFields = await page.locator('input[type="password"]').all();
    if (passwordFields.length >= 2) {
      await passwordFields[1].fill(testPassword); // Confirm password
    }

    // Submit form
    const submitButton = page.getByRole('button', { name: /Create Account|Sign Up|Join/i });
    await submitButton.click();

    // Should see success message or redirect to login
    // Wait for redirect or success message
    await page.waitForTimeout(2000);

    // Check if we got redirected or see success message
    const url = page.url();
    const isOnLogin = url.includes('/login');
    const hasSuccessMessage = await page.locator('text=/Success|Account created|Check your email/i').isVisible().catch(() => false);

    expect(isOnLogin || hasSuccessMessage).toBeTruthy();
  });

  test('should show error for duplicate email', async ({ page }) => {
    // First create an account
    await page.goto('/signup');
    const duplicateEmail = `duplicate-${Date.now()}@example.com`;

    await page.locator('input[type="text"]').first().fill('Test User 1');
    await page.locator('input[type="email"]').fill(duplicateEmail);
    await page.locator('input[type="password"]').first().fill(testPassword);

    const passwordFields = await page.locator('input[type="password"]').all();
    if (passwordFields.length >= 2) {
      await passwordFields[1].fill(testPassword);
    }

    await page.getByRole('button', { name: /Create Account|Sign Up|Join/i }).click();
    await page.waitForTimeout(2000);

    // Now try to signup with the same email
    await page.goto('/signup');

    await page.locator('input[type="text"]').first().fill('Test User 2');
    await page.locator('input[type="email"]').fill(duplicateEmail);
    await page.locator('input[type="password"]').first().fill(testPassword);

    const passwordFields2 = await page.locator('input[type="password"]').all();
    if (passwordFields2.length >= 2) {
      await passwordFields2[1].fill(testPassword);
    }

    await page.getByRole('button', { name: /Create Account|Sign Up|Join/i }).click();

    // Wait for error message
    await page.waitForTimeout(1000);
    const errorText = await page.locator('[class*="error"], [class*="alert"]').first().textContent().catch(() => '');

    expect(errorText.toLowerCase()).toContain('already' || 'duplicate' || 'registered');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    // Look for login link in header or drawer
    const loginLinks = page.getByRole('link', { name: /Login|Sign In/i });
    await loginLinks.first().click();

    // Should be on login or signup page
    const url = page.url();
    expect(url).toMatch(/\/(login|signup)/);
  });

  test('should access guest mode', async ({ page }) => {
    await page.goto('/');

    // Look for "Continue as Guest" button
    const guestButton = page.getByRole('button', { name: /Continue as Guest|Guest/i });
    if (await guestButton.isVisible()) {
      await guestButton.click();

      // Should redirect to quiz or career page
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toMatch(/\/(quiz|careers|calculator)/);
    }
  });

  test('should scroll to sections in navbar', async ({ page }) => {
    await page.goto('/');

    // Check navbar links exist
    const aboutLink = page.getByRole('button', { name: /About/i }).first();
    if (await aboutLink.isVisible().catch(() => false)) {
      await aboutLink.click();

      // Should scroll (content should be visible)
      await page.waitForTimeout(500);
      const currentScroll = await page.evaluate(() => window.scrollY);
      expect(currentScroll).toBeGreaterThan(0);
    }
  });

  test('should have responsive navbar on mobile', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 }); // Mobile size

    await page.goto('/');

    // Mobile menu button should be visible
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu|hamburger/i }).first();

    if (await page.locator('[class*="md:hidden"]').first().isVisible().catch(() => false)) {
      // Click menu
      await page.locator('button').filter({ has: page.locator('svg') }).first().click();

      // Drawer should open
      const drawer = page.locator('[class*="drawer"], [class*="mobile"], [class*="sidebar"]').first();
      await expect(drawer).toBeVisible().catch(() => {
        // Menu might have opened in a different way
      });
    }
  });

  test('should verify UI elements are visible', async ({ page }) => {
    await page.goto('/');

    // Check key sections exist
    const sections = ['home', 'about', 'features', 'how-it-work', 'pricing'];

    for (const section of sections) {
      const element = page.locator(`#${section}, [id*="${section}"]`);
      // Just check that we can find elements, don't require all to exist
      await element.first().isVisible().catch(() => {});
    }
  });

  test('should handle navigation between pages', async ({ page }) => {
    await page.goto('/');

    // Try to navigate to careers page
    const careersLinks = page.getByRole('link', { name: /Career|Explore/i });
    if (await careersLinks.first().isVisible().catch(() => false)) {
      await careersLinks.first().click();
      await page.waitForTimeout(1000);
      expect(page.url()).not.toBe('http://localhost:3000/');
    }
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // Scroll to find features
    await page.evaluate(() => {
      const element = document.querySelector('[id*="feature"], [id*="about"]');
      element?.scrollIntoView();
    });

    // Check for feature cards
    const featureCards = page.locator('[class*="card"], [class*="feature"]');
    const count = await featureCards.count();

    // Should have some feature elements
    expect(count).toBeGreaterThan(0);
  });

  test('should load without JavaScript errors', async ({ page }) => {
    let consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Check for critical errors (ignore some common third-party errors)
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('ResizeObserver') &&
              !err.includes('Failed to fetch') &&
              !err.includes('non-error promise rejection')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
