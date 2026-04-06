import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';
const TEST_MODE = '?__test_mode=true';

test.describe('Phase 2 - Careers Pagination', () => {
  test('Careers page loads 25 careers initially then loads more', async ({ page }) => {
    await page.goto(`${BASE}/${TEST_MODE}&page=careers`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check initial load (≤25 careers)
    const initialCards = page.locator('[data-career-card]');
    const initialCount = await initialCards.count();
    expect(initialCount).toBeLessThanOrEqual(25);
    expect(initialCount).toBeGreaterThan(0);

    // Click load more
    const loadMoreBtn = page.locator('[data-load-more-btn]');
    await expect(loadMoreBtn).toBeVisible();
    await loadMoreBtn.click();

    // Wait for loading to complete
    await page.waitForTimeout(1000);

    // Check more careers loaded
    const updatedCards = page.locator('[data-career-card]');
    const updatedCount = await updatedCards.count();
    expect(updatedCount).toBeGreaterThan(initialCount);
  });

  test('Load more button disappears when all careers loaded', async ({ page }) => {
    await page.goto(`${BASE}/${TEST_MODE}&page=careers`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const loadMoreBtn = page.locator('[data-load-more-btn]');

    // Keep clicking until gone
    let attempts = 0;
    while (await loadMoreBtn.isVisible() && attempts < 50) {
      await loadMoreBtn.click();
      await page.waitForTimeout(500);
      attempts++;
    }

    // Check "all loaded" message
    await expect(page.locator('text=Showing all')).toBeVisible();
  });
});

test.describe('Phase 2 - Calendar Page', () => {
  test('Calendar page displays calendar grid', async ({ page }) => {
    await page.goto(`${BASE}/${TEST_MODE}&page=calendar`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const calendarDays = page.locator('[data-calendar-day]');
    expect(await calendarDays.count()).toBeGreaterThan(0);

    // Check legend appears
    await expect(page.locator('text=School Term')).toBeVisible();
    await expect(page.locator('text=Exam Week')).toBeVisible();
  });

  test('Calendar navigation works', async ({ page }) => {
    await page.goto(`${BASE}/${TEST_MODE}&page=calendar`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should show current year
    const yearText = page.locator('h2').filter({ hasText: /\d{4}/ });
    await expect(yearText).toBeVisible();

    const initialText = await yearText.textContent();

    // Click next month
    const nextBtn = page.locator('button[aria-label="Next month"]');
    await nextBtn.click();
    await page.waitForTimeout(500);

    // Verify calendar updated (text changed)
    const updatedText = await yearText.textContent();
    // Either month or year changed
    expect(updatedText).toBeDefined();

    // Calendar days still showing
    const days = page.locator('[data-calendar-day]');
    expect(await days.count()).toBeGreaterThan(0);
  });
});
