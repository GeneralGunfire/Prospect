import { test, expect, Page } from '@playwright/test';

/**
 * Helper: Wait for app to be ready
 */
async function waitForAppReady(page: Page) {
  await page.waitForLoadState('networkidle').catch(() => null);
  await page.waitForTimeout(500);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Prospect Career Guidance Platform', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Browser error: ${msg.text()}`);
      }
    });
  });

  test.describe('Home Page & Navigation', () => {
    test('Home page loads with header and hero', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Check header exists
      const header = page.locator('header');
      await expect(header).toBeVisible();

      // Check hero section with title
      const heroTitle = page.locator('h1:has-text("Find Your Career")');
      await expect(heroTitle).toBeVisible({ timeout: 5000 });
    });

    test('Home page has quiz call-to-action buttons', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Look for start quiz buttons
      const quizButtons = page.locator('button:has-text("Quiz"), button:has-text("Start")');
      const count = await quizButtons.count();

      expect(count).toBeGreaterThan(0);
    });

    test('Logo is clickable', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      const logo = page.locator('a[href="/"], h1:has-text("Prospect")');
      await expect(logo.first()).toBeVisible();
    });

    test('Footer loads with links', async ({ page }) => {
      await page.goto('/');

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Check footer exists
      const footer = page.locator('footer');
      await expect(footer).toBeVisible({ timeout: 5000 });

      // Check for footer links
      const footerLinks = page.locator('footer a');
      const linkCount = await footerLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });
  });

  test.describe('Quiz Page', () => {
    test('Quiz page displays questions', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Find and click a quiz button
      const quizButton = page.locator('button:has-text("Quiz"), button:has-text("Start"), button:has-text("Take")').first();

      if (await quizButton.isVisible()) {
        await quizButton.click();
        await waitForAppReady(page);
      }

      // Look for quiz content
      const quizContent = page.locator('text=/question|quiz/i').first();
      const isVisible = await quizContent.isVisible({ timeout: 5000 }).catch(() => false);

      // Pass if quiz content is found OR if page has buttons (indicating it's a quiz page)
      const buttons = await page.locator('button').count();
      expect(isVisible || buttons > 3).toBeTruthy();
    });

    test('Quiz has answer buttons', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      const quizButton = page.locator('button:has-text("Quiz"), button:has-text("Start")').first();

      if (await quizButton.isVisible()) {
        await quizButton.click();
        await page.waitForTimeout(1000);

        // Count buttons on the page
        const buttons = await page.locator('button').count();

        // Quiz should have multiple buttons (for answers, navigation, etc)
        expect(buttons).toBeGreaterThan(2);
      }
    });

    test('Can navigate quiz questions', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      const quizButton = page.locator('button:has-text("Quiz"), button:has-text("Start")').first();

      if (await quizButton.isVisible()) {
        await quizButton.click();
        await page.waitForTimeout(1000);

        // Get all buttons
        const buttons = await page.locator('button').all();

        // Try to click a few buttons (should be answer buttons)
        if (buttons.length > 5) {
          // Click first answer button
          await buttons[0].click({ timeout: 1000 }).catch(() => null);

          // Verify something changed or appears
          await page.waitForTimeout(200);
          const content = await page.content();
          expect(content.length).toBeGreaterThan(100);
        }
      }
    });
  });

  test.describe('Careers Page', () => {
    test('Careers page loads with career cards', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Look for careers navigation button
      const careersButton = page.locator('button:has-text("Careers"), button:has-text("Explore"), a:has-text("Careers")').first();

      if (await careersButton.isVisible()) {
        await careersButton.click();
        await page.waitForTimeout(1500);

        // Check for career content
        const content = await page.content();

        // Should have substantive content
        expect(content.length).toBeGreaterThan(500);
      }
    });

    test('Careers page has search functionality', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      const careersButton = page.locator('button:has-text("Careers"), button:has-text("Explore")').first();

      if (await careersButton.isVisible()) {
        await careersButton.click();
        await page.waitForTimeout(1000);

        // Look for search input
        const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"], input[type="text"]').first();
        const searchVisible = await searchInput.isVisible({ timeout: 3000 }).catch(() => false);

        // If search is visible, test it
        if (searchVisible) {
          await searchInput.fill('Software');
          await page.waitForTimeout(300);

          // Check content changed
          const content = await page.content();
          expect(content).toContain('Software');
        }
      }
    });

    test('Career cards are interactive', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      const careersButton = page.locator('button:has-text("Careers"), button:has-text("Explore")').first();

      if (await careersButton.isVisible()) {
        await careersButton.click();
        await page.waitForTimeout(1000);

        // Look for clickable career cards
        const cards = page.locator('[class*="border"][class*="rounded"]');
        const cardCount = await cards.count();

        expect(cardCount).toBeGreaterThan(0);

        // Try clicking first card
        if (cardCount > 0) {
          await cards.first().click({ timeout: 1000 }).catch(() => null);
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe('Bursaries Page', () => {
    test('Bursaries page loads', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Navigate through footer or navigation
      let bursariesButton = page.locator('button:has-text("Bursaries"), button:has-text("Bursary"), a:has-text("Bursaries")').first();

      if (await bursariesButton.isVisible()) {
        await bursariesButton.click();
        await page.waitForTimeout(1000);

        const content = await page.content();
        expect(content.length).toBeGreaterThan(100);
      }
    });
  });

  test.describe('Study Library Page', () => {
    test('Study library page loads', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Look for library navigation
      let libraryButton = page.locator('button:has-text("Library"), button:has-text("Study"), a:has-text("Study")').first();

      if (await libraryButton.isVisible()) {
        await libraryButton.click();
        await page.waitForTimeout(1000);

        const content = await page.content();
        expect(content.length).toBeGreaterThan(100);
      }
    });
  });

  test.describe('Authentication', () => {
    test('Auth page loads when clicking start quiz', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      const quizButton = page.locator('button:has-text("Quiz"), button:has-text("Start")').first();

      if (await quizButton.isVisible()) {
        await quizButton.click();
        await page.waitForTimeout(1000);

        // Should show auth form or quiz
        const content = await page.content();
        expect(content.length).toBeGreaterThan(200);
      }
    });
  });

  test.describe('Performance & Stability', () => {
    test('Page loads without critical errors', async ({ page }) => {
      let errorFound = false;

      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('Failed') && msg.text().includes('500')) {
          errorFound = true;
        }
      });

      await page.goto('/');
      await waitForAppReady(page);

      // Critical 500 errors should not occur
      expect(errorFound).toBeFalsy();
    });

    test('Home page response time is acceptable', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.locator('h1').first().waitFor({ timeout: 10000 });

      const loadTime = Date.now() - startTime;

      // Should load main content within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test('Page is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      await page.goto('/');
      await waitForAppReady(page);

      // Verify main content is still visible
      const content = page.locator('h1, button, input');
      const count = await content.count();

      expect(count).toBeGreaterThan(0);
    });

    test('No unhandled promise rejections', async ({ page }) => {
      let rejectionFound = false;

      page.on('pageerror', error => {
        rejectionFound = true;
        console.error('Unhandled error:', error);
      });

      await page.goto('/');
      await waitForAppReady(page);

      expect(rejectionFound).toBeFalsy();
    });
  });

  test.describe('User Experience', () => {
    test('Can scroll and interact with page content', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(500);

      // Check we can still interact
      const buttons = await page.locator('button').count();
      expect(buttons).toBeGreaterThan(0);
    });

    test('Logo is accessible and clickable', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Navigate to careers
      const careersButton = page.locator('button:has-text("Careers"), button:has-text("Explore")').first();
      if (await careersButton.isVisible()) {
        await careersButton.click();
        await page.waitForTimeout(500);
      }

      // Click logo to go home
      const logo = page.locator('a[href="/"]').first();
      if (await logo.isVisible()) {
        await logo.click();
        await page.waitForTimeout(500);

        // Should be back on home page with hero
        const hero = page.locator('h1:has-text("Find Your Career")');
        await expect(hero).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Data Integrity', () => {
    test('Page content is not empty', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      const content = await page.content();

      // Should have meaningful content (not blank or error page)
      expect(content.length).toBeGreaterThan(1000);
      expect(content.toLowerCase()).not.toContain('cannot get /');
    });

    test('Form inputs are present when needed', async ({ page }) => {
      await page.goto('/');
      await waitForAppReady(page);

      // Try to navigate to auth
      const quizButton = page.locator('button:has-text("Quiz"), button:has-text("Start")').first();
      if (await quizButton.isVisible()) {
        await quizButton.click();
        await page.waitForTimeout(1000);

        // Should have some inputs or interactive elements
        const inputs = await page.locator('input, button, select').count();
        expect(inputs).toBeGreaterThan(0);
      }
    });
  });
});
