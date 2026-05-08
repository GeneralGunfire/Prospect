import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const TEST_MODE = '?__test_mode=true';

test.describe('Phase 2 - Careers Pagination', () => {
  test('Careers page loads 25 careers initially then loads more', async ({ page }) => {
    await page.goto(`${BASE}/${TEST_MODE}&page=careers`);
    await page.locator('[data-career-card]').first().waitFor({ state: 'visible', timeout: 10000 });

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
    await page.locator('[data-career-card]').first().waitFor({ state: 'visible', timeout: 10000 });

    const loadMoreBtn = page.locator('[data-load-more-btn]');

    // Keep clicking until gone
    let attempts = 0;
    while (await loadMoreBtn.isVisible() && attempts < 30) {
      await loadMoreBtn.click();
      await page.waitForTimeout(100);
      attempts++;
    }

    // Check "all loaded" message
    await expect(page.locator('text=Showing all')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Phase 2 - Calendar Page', () => {
  test('Calendar page displays calendar grid', async ({ page }) => {
    await page.goto(`${BASE}/${TEST_MODE}&page=calendar`);
    await page.locator('[data-testid="calendar-day"]').first().waitFor({ state: 'visible', timeout: 10000 });

    // CalendarPageNew uses data-testid="calendar-day"
    const calendarDays = page.locator('[data-testid="calendar-day"]');
    expect(await calendarDays.count()).toBeGreaterThan(0);

    // Check terms tab exists
    await expect(page.locator('button', { hasText: 'terms' })).toBeVisible();
  });

  test('Calendar navigation works', async ({ page }) => {
    await page.goto(`${BASE}/${TEST_MODE}&page=calendar`);
    await page.locator('[data-testid="calendar-day"]').first().waitFor({ state: 'visible', timeout: 10000 });

    // Month heading visible
    const monthHeading = page.locator('h3').filter({ hasText: /January|February|March|April|May|June|July|August|September|October|November|December/ }).first();
    await expect(monthHeading).toBeVisible();

    // Click ChevronRight — second nav button in the calendar header area
    await page.locator('[data-testid="calendar-day"]').first().waitFor({ state: 'visible' });
    // Find next/prev buttons by their position in the nav div
    const navButtons = page.locator('button').filter({ hasText: '' }).filter({ has: page.locator('svg') });
    const rightArrow = navButtons.last();
    await rightArrow.click();
    await page.waitForTimeout(500);

    // Calendar days still showing
    const days = page.locator('[data-testid="calendar-day"]');
    expect(await days.count()).toBeGreaterThan(0);
  });
});
