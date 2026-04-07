import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test('calendar page renders without blank screen', async ({ page }) => {
  // Navigate with test mode auth bypass and direct to calendar page
  await page.goto(`${BASE_URL}/?page=calendar&__test_mode=true`);

  // Should see the year calendar sidebar
  await page.waitForSelector('[data-testid="year-calendar"]', { timeout: 10000 });

  // Month selector should have 12 months
  const monthButtons = page.locator('[data-testid="month-selector-btn"]');
  await expect(monthButtons).toHaveCount(12);

  // Current month header should be visible
  await expect(page.locator('[data-testid="current-month"]')).toBeVisible();

  // Calendar days should render
  const days = page.locator('[data-testid="calendar-day"]');
  const count = await days.count();
  expect(count).toBeGreaterThan(0);

  // Page should NOT be blank — verify key UI elements
  await expect(page.locator('h1').filter({ hasText: 'Study Calendar' })).toBeVisible();

  console.log(`Calendar page OK — ${count} days rendered`);
});
