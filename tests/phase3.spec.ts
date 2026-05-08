import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const TM   = '__test_mode=true';

// ── Dashboard ──────────────────────────────────────────────────────────────────

test.describe('Dashboard — current structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/?${TM}&page=dashboard`);
    await page.waitForTimeout(3500);
  });

  test('renders School Assist header breadcrumb', async ({ page }) => {
    await expect(page.getByText('School Assist')).toBeVisible();
    await expect(page.locator('span').filter({ hasText: /^Dashboard$/ }).first()).toBeVisible();
  });

  test('renders Next Deadline card', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-next-deadline"]')).toBeVisible();
    await expect(page.getByText('Next Deadline')).toBeVisible();
  });

  test('renders Upcoming Deadlines section', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-deadlines"]')).toBeVisible();
    await expect(page.getByText('Upcoming Deadlines')).toBeVisible();
  });

  test('renders Quick Access and Ask AI buttons', async ({ page }) => {
    await expect(page.getByText('Quick Access')).toBeVisible();
    await expect(page.getByText('Ask AI')).toBeVisible();
  });

  test('Full Calendar link navigates to calendar', async ({ page }) => {
    await page.getByText('Full Calendar').click();
    await page.waitForTimeout(1500);
    await expect(page.locator('[data-testid="calendar-day"]').first()).toBeVisible({ timeout: 6000 });
  });

  test('does NOT show old Current APS stat', async ({ page }) => {
    await expect(page.getByText('Current APS')).not.toBeVisible();
  });
});

// ── Community Impact — Discover ───────────────────────────────────────────────

test.describe('Community Impact — Discover tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/?${TM}&page=community-impact`);
    await page.waitForTimeout(3500);
  });

  test('page loads with correct heading', async ({ page }) => {
    await expect(page.getByText('Opportunities near you')).toBeVisible();
  });

  test('standalone header — no school nav links', async ({ page }) => {
    await expect(page.getByText('Community Impact').first()).toBeVisible();
    await expect(page.getByText('Dashboard', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Library', { exact: true })).not.toBeVisible();
  });

  test('three tabs are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="ci-tab-discover"]')).toBeVisible();
    await expect(page.locator('[data-testid="ci-tab-add"]')).toBeVisible();
    await expect(page.locator('[data-testid="ci-tab-my-contributions"]')).toBeVisible();
  });

  test('Discover tab is active by default', async ({ page }) => {
    await expect(page.locator('[data-testid="ci-tab-discover"]')).toHaveClass(/bg-slate-900/);
  });

  test('stats row shows 5 category cards', async ({ page }) => {
    // Labels are 'Schools' in DOM (CSS makes them uppercase visually)
    await expect(page.getByText('Total', { exact: true })).toBeVisible();
    await expect(page.getByText('Schools', { exact: true })).toBeVisible();
    await expect(page.getByText('Colleges', { exact: true })).toBeVisible();
    await expect(page.getByText('Jobs', { exact: true })).toBeVisible();
    await expect(page.getByText('Services', { exact: true })).toBeVisible();
  });

  test('search box is visible', async ({ page }) => {
    await expect(page.getByPlaceholder('Search by name or city…')).toBeVisible();
  });

  test('type filter pills are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^All$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^School$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^College$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Job$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Service$/i })).toBeVisible();
  });

  test('CTA banner is visible', async ({ page }) => {
    await expect(page.getByText('Is your school or local opportunity here?')).toBeVisible();
  });

  test('CTA "Add it now" switches to Add tab', async ({ page }) => {
    await page.getByRole('button', { name: /add it now/i }).click();
    await page.waitForTimeout(400);
    await expect(page.locator('[data-testid="ci-tab-add"]')).toHaveClass(/bg-slate-900/);
    await expect(page.getByText('What are you adding?')).toBeVisible();
  });

  test('searching filters the results count label', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search by name or city…');
    await searchBox.fill('zzznomatchxxx');
    await page.waitForTimeout(400);
    await expect(page.getByText(/0 opportunities found/i)).toBeVisible();
  });
});

// ── Community Impact — Add tab ────────────────────────────────────────────────

test.describe('Community Impact — Add tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/?${TM}&page=community-impact`);
    await page.waitForTimeout(3500);
    await page.locator('[data-testid="ci-tab-add"]').click();
    await page.waitForTimeout(400);
  });

  test('Step 1 shows 4 type options', async ({ page }) => {
    await expect(page.locator('[data-testid="ci-type-school"]')).toBeVisible();
    await expect(page.locator('[data-testid="ci-type-college"]')).toBeVisible();
    await expect(page.locator('[data-testid="ci-type-job"]')).toBeVisible();
    await expect(page.locator('[data-testid="ci-type-service"]')).toBeVisible();
  });

  test('clicking School shows Step 2 form', async ({ page }) => {
    await page.locator('[data-testid="ci-type-school"]').click();
    await page.waitForTimeout(400);
    await expect(page.getByText('Quick details')).toBeVisible();
    await expect(page.locator('[data-testid="ci-form-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="ci-submit-btn"]')).toBeVisible();
  });

  test('empty submit shows validation error', async ({ page }) => {
    await page.locator('[data-testid="ci-type-school"]').click();
    await page.waitForTimeout(400);
    await page.locator('[data-testid="ci-submit-btn"]').click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Name is required.')).toBeVisible();
  });

  test('back button returns to type selection', async ({ page }) => {
    await page.locator('[data-testid="ci-type-college"]').click();
    await page.waitForTimeout(400);
    await page.locator('[data-testid="ci-form-back"]').click();
    await page.waitForTimeout(400);
    await expect(page.getByText('What are you adding?')).toBeVisible();
  });

  test('form fills without error', async ({ page }) => {
    await page.locator('[data-testid="ci-type-job"]').click();
    await page.waitForTimeout(400);

    await page.locator('[data-testid="ci-form-name"]').fill('Sasol Graduate Programme');
    await page.locator('[data-testid="ci-form-province"]').selectOption('Gauteng');
    await page.getByPlaceholder('e.g. Soweto').fill('Johannesburg');

    await expect(page.locator('[data-testid="ci-submit-btn"]')).toBeEnabled();
    // No error message should be showing
    await expect(page.getByText('Name is required.')).not.toBeVisible();
  });
});

// ── Community Impact — My Contributions ──────────────────────────────────────

test.describe('Community Impact — My Contributions tab', () => {
  test('shows email prompt or empty state for guest', async ({ page }) => {
    await page.goto(`${BASE}/?${TM}&page=community-impact`);
    await page.waitForTimeout(3500);
    await page.locator('[data-testid="ci-tab-my-contributions"]').click();
    await page.waitForTimeout(600);
    await expect(
      page.getByText(/Enter your email|No contributions yet/i)
    ).toBeVisible({ timeout: 5000 });
  });
});

// ── Community Impact Auth ─────────────────────────────────────────────────────

test.describe('Community Impact Auth — real form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/?${TM}&page=impact-auth`);
    await page.waitForTimeout(3500);
  });

  test('does NOT show "coming soon" message', async ({ page }) => {
    await expect(page.getByText('This feature is not yet available')).not.toBeVisible();
    await expect(page.getByText('Community Impact is coming soon')).not.toBeVisible();
    await expect(page.getByText('No data is collected yet')).not.toBeVisible();
  });

  test('shows email input', async ({ page }) => {
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });

  test('shows password input', async ({ page }) => {
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('empty submit triggers validation error', async ({ page }) => {
    await page.locator('form button[type="submit"]').click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByText(/please enter your email|incorrect email|something went wrong/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('Get Involved tab shows name field', async ({ page }) => {
    await page.getByRole('button', { name: /get involved/i }).first().click();
    await page.waitForTimeout(400);
    await expect(page.getByPlaceholder('Thabo Nkosi')).toBeVisible();
  });
});
