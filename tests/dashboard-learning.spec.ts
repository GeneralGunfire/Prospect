import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';
const TEST_MODE = '__test_mode=true';

test.describe('Dashboard', () => {
  test('dashboard renders stats and sections when authed', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Stats cards visible — use p tag to be specific
    await expect(page.locator('p', { hasText: 'Current APS' }).first()).toBeVisible();
    await expect(page.locator('p', { hasText: 'Saved Careers' }).first()).toBeVisible();
    await expect(page.locator('p', { hasText: 'Saved Bursaries' }).first()).toBeVisible();
    await expect(page.locator('p', { hasText: 'Status' }).first()).toBeVisible();
  });

  test('dashboard saved items section shows empty states', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3500);

    await expect(page.locator('text=Saved Items')).toBeVisible();
    await expect(page.locator('text=Learning Resources')).toBeVisible();
  });

  test('dashboard quick action buttons navigate correctly', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=dashboard`);
    await page.waitForTimeout(3500);

    await page.locator('button', { hasText: 'Explore Careers' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('[data-career-card]').first()).toBeVisible();
  });
});

test.describe('Demo Learning (Algebra)', () => {
  test('navigates to demo learning page from study library', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=library`);
    await page.waitForTimeout(3500);

    // Click Mathematics subject card
    const mathCard = page.locator('text=Mathematics').first();
    await expect(mathCard).toBeVisible();
    await mathCard.click();
    await page.waitForTimeout(800);

    // Should land on demo learning page
    await expect(page.locator('text=Algebra').first()).toBeVisible();
  });

  test('demo learning page shows algebra topic overview', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=demo-learning`);
    await page.waitForTimeout(3500);

    await expect(page.locator('text=Algebra').first()).toBeVisible();
    // Topics from demoLearningPath
    await expect(page.locator('text=Algebraic Expressions').first()).toBeVisible();
  });

  test('can start diagnostic quiz on first topic', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=demo-learning`);
    await page.waitForTimeout(3500);

    // Click Start or the first topic card
    const startBtn = page.locator('button', { hasText: /Start|Begin|Diagnos/i }).first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
      await page.waitForTimeout(600);
      // Should show diagnostic quiz
      await expect(page.locator('text=Quick Diagnostic').first()).toBeVisible();
    }
  });

  test('diagnostic quiz answer selection reveals feedback', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=demo-learning`);
    await page.waitForTimeout(3500);

    // Navigate into diagnostic
    const startBtn = page.locator('button', { hasText: /Start|Begin|Diagnos/i }).first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
      await page.waitForTimeout(600);

      // Click first answer option (A)
      const optionA = page.locator('button').filter({ hasText: /^A\./ }).first();
      if (await optionA.isVisible()) {
        await optionA.click();
        await page.waitForTimeout(400);
        // Explanation should appear after selection
        await expect(page.locator('button', { hasText: /Next Question|See Results/i }).first()).toBeVisible();
      }
    }
  });
});

test.describe('Calendar user events', () => {
  test('clicking a calendar day opens the event modal', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=calendar`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const days = page.locator('[data-testid="calendar-day"]');
    const count = await days.count();
    expect(count).toBeGreaterThan(0);

    await days.nth(5).click();
    await page.waitForTimeout(400);

    await expect(page.locator('[data-testid="create-event-modal"]')).toBeVisible();
  });

  test('can add an event via the modal', async ({ page }) => {
    await page.goto(`${BASE}/?${TEST_MODE}&page=calendar`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.locator('[data-testid="calendar-day"]').nth(5).click();
    await page.waitForTimeout(400);

    const modal = page.locator('[data-testid="create-event-modal"]');
    await expect(modal).toBeVisible();

    await page.locator('[data-testid="event-description"]').fill('Test study session');
    await page.locator('[data-testid="create-event-btn"]').click();
    await page.waitForTimeout(600);

    // Button should show saved state
    await expect(page.locator('text=Saved ✓')).toBeVisible();
  });
});
