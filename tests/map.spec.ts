import { test, expect, Page } from '@playwright/test';

// ─── Helper: Set up mock Supabase session ──────────────────────────────────

/**
 * Set a mock Supabase session in localStorage so withAuth accepts it
 * This bypasses the need for real authentication
 */
async function setMockSupabaseSession(page: Page) {
  const mockUser = {
    id: 'test-user-map-123',
    email: 'test-map@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: null,
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Test Map User' },
    identities: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  };

  const mockSession = {
    access_token: 'test-mock-token-map',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'test-mock-refresh-map',
    user: mockUser,
  };

  // Set the mock session in localStorage
  // withAuth checks for this key first before calling Supabase API
  await page.evaluate((session) => {
    localStorage.setItem('__test_mock_session__', JSON.stringify(session));
  }, mockSession);
}

/**
 * Navigate to the map page with mocked Supabase authentication
 */
async function navigateToMapPageWithAuth(page: Page) {
  // First navigate to establish context
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Set the mock session in localStorage
  // This must be done after goto() but before navigating to /map
  await setMockSupabaseSession(page);

  // Now navigate to /map
  // The withAuth wrapper will find the mock session in localStorage
  // and allow the component to render without making real API calls
  await page.goto('/map', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Wait for the map page to initialize
  await page.waitForTimeout(1500);
}

test.describe('Map Feature', () => {
  test.beforeEach(async ({ page, context }) => {
    // Mock geolocation
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: -26.2023, longitude: 28.0436 }); // Johannesburg
  });

  // Helper to select a location on the map
  async function selectLocation(page: Page) {
    const input = page.locator('input[placeholder*="location"]');
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill('Johannesburg');

    const suggestion = page.locator('button').filter({ has: page.locator('text=Johannesburg') }).first();
    await suggestion.waitFor({ state: 'visible', timeout: 5000 });
    await suggestion.click();

    // Wait for map to load
    const mapContainer = page.locator('canvas');
    await mapContainer.waitFor({ state: 'visible', timeout: 10000 });
  }

  test.describe('Location Input', () => {
    test('should render location input on initial load', async ({ page }) => {
      // Navigate to map with mocked auth
      await navigateToMapPageWithAuth(page);

      // Check for location input heading
      const heading = page.locator('text=Job Market Map 🗺️');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Check for location input
      const input = page.locator('input[placeholder*="location"]');
      await expect(input).toBeVisible();

      // Check for both buttons
      const searchBtn = page.locator('button:has-text("Search")');
      const geoBtn = page.locator('button:has-text("Use My Location")');
      await expect(searchBtn).toBeVisible();
      await expect(geoBtn).toBeVisible();
    });

    test('should accept city input and show autocomplete', async ({ page }) => {
      // Navigate to map with mocked auth
      await navigateToMapPageWithAuth(page);

      const input = page.locator('input[placeholder*="location"]');
      await expect(input).toBeVisible({ timeout: 10000 });

      // Type a city name
      await input.fill('Johan');

      // Wait for suggestions to appear
      const suggestions = page.locator('text=Johannesburg');
      await expect(suggestions).toBeVisible({ timeout: 5000 });
    });

    test('should select a city from autocomplete', async ({ page }) => {
      // Navigate to map with mocked auth
      await navigateToMapPageWithAuth(page);

      const input = page.locator('input[placeholder*="location"]');
      await expect(input).toBeVisible({ timeout: 10000 });

      // Type city name
      await input.fill('Cape');

      // Wait and click suggestion
      const suggestion = page.locator('button:has-text("Cape Town")').first();
      await suggestion.waitFor({ state: 'visible', timeout: 5000 });
      await suggestion.click();

      // Should transition to exploring step
      const mapContainer = page.locator('canvas');
      await expect(mapContainer).toBeVisible({ timeout: 10000 });
    });

    test('should handle manual form submission', async ({ page }) => {
      // Navigate to map with mocked auth
      await navigateToMapPageWithAuth(page);

      const input = page.locator('input[placeholder*="location"]');
      await expect(input).toBeVisible({ timeout: 10000 });

      // Type and select first suggestion
      await input.fill('Johannesburg');

      // Click the first suggestion
      const suggestion = page.locator('button').filter({ has: page.locator('text=Johannesburg') }).first();
      await suggestion.waitFor({ state: 'visible', timeout: 5000 });
      await suggestion.click();

      // Verify map loads
      const mapContainer = page.locator('canvas');
      await expect(mapContainer).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Map Display', () => {
    test('should display map with markers after location selection', async ({ page }) => {
      // Navigate to map with mocked auth
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);

      // Map should be visible
      const mapContainer = page.locator('canvas');
      await expect(mapContainer).toBeVisible();
    });

    test('should show user location label in header', async ({ page }) => {
      // Navigate to map with mocked auth
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);

      // Check header shows location
      const header = page.locator('text=/📍.*Johannesburg/');
      await expect(header).toBeVisible({ timeout: 5000 });
    });

    test('should display province in header', async ({ page }) => {
      // Navigate to map with mocked auth
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);

      // Check province is displayed
      const provinceText = page.locator('text=Gauteng');
      await expect(provinceText).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Navigation & Tabs', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to map and select location
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);
    });

    test('should display tab navigation buttons', async ({ page }) => {
      const careersTab = page.locator('button:has-text("💼 Careers")');
      const collegesTab = page.locator('button:has-text("🎓 Colleges")');
      const insightsTab = page.locator('button:has-text("📊 Insights")');

      await expect(careersTab).toBeVisible();
      await expect(collegesTab).toBeVisible();
      await expect(insightsTab).toBeVisible();
    });

    test('should show careers tab content by default', async ({ page }) => {
      // Careers tab should be active and show content
      const careerContent = page.locator('text=/careers in Gauteng/i');
      await expect(careerContent).toBeVisible({ timeout: 5000 });
    });

    test('should switch to colleges tab', async ({ page }) => {
      const collegesTab = page.locator('button:has-text("🎓 Colleges")');
      await collegesTab.click();

      // Should show college content
      const collegeHeader = page.locator('text=/Universities & Colleges/');
      await expect(collegeHeader).toBeVisible({ timeout: 5000 });
    });

    test('should switch to insights tab', async ({ page }) => {
      const insightsTab = page.locator('button:has-text("📊 Insights")');
      await insightsTab.click();

      // Should show insights content
      const jobMarketHeader = page.locator('text=Job Market');
      await expect(jobMarketHeader).toBeVisible({ timeout: 5000 });
    });

    test('should show back button', async ({ page }) => {
      const backBtn = page.locator('button:has-text("Back")');
      await expect(backBtn).toBeVisible();
    });

    test('should return to location input on back button click', async ({ page }) => {
      const backBtn = page.locator('button:has-text("Back")');
      await backBtn.click();

      // Should show location input again
      const heading = page.locator('text=Job Market Map 🗺️');
      await expect(heading).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Search Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to map and select location
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);
    });

    test('should have search box visible', async ({ page }) => {
      const searchBox = page.locator('input[placeholder*="Search"]');
      await expect(searchBox).toBeVisible();
    });

    test('should filter careers by search query', async ({ page }) => {
      const searchBox = page.locator('input[placeholder*="Search"]');

      // Search for a specific career
      await searchBox.fill('Software');

      // Wait a moment for results to filter
      await page.waitForTimeout(500);

      // Results should be filtered
      const resultArea = page.locator('text=/careers in Gauteng/i');
      await expect(resultArea).toBeVisible();
    });
  });

  test.describe('Layer Controls', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to map and select location
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);
    });

    test('should show layer control checkboxes', async ({ page }) => {
      const demandLabel = page.locator('text=🔥 Demand');
      await expect(demandLabel).toBeVisible();
    });

    test('should toggle layer visibility', async ({ page }) => {
      // Find and click demand layer checkbox
      const demandCheckbox = page.locator('label:has-text("Demand") input').first();

      const isChecked = await demandCheckbox.isChecked();
      await demandCheckbox.click();

      // Verify state changed
      const newState = await demandCheckbox.isChecked();
      expect(newState).toBe(!isChecked);
    });
  });

  test.describe('Insights Tab', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to map and select location
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);

      // Click insights tab
      const insightsTab = page.locator('button:has-text("📊 Insights")');
      await insightsTab.click();
    });

    test('should display job market statistics', async ({ page }) => {
      const jobMarket = page.locator('text=Job Market');
      await expect(jobMarket).toBeVisible();

      // Should show career count
      const careerCount = page.locator('text=/\\d+\\+ Careers/i').first();
      await expect(careerCount).toBeVisible({ timeout: 5000 });
    });

    test('should display industry breakdown', async ({ page }) => {
      const industrySection = page.locator('text=Industry Breakdown');

      // Scroll to find it if needed
      if (!(await industrySection.isVisible())) {
        await page.locator('div.overflow-y-auto').evaluate(el => {
          el.scrollTop = el.scrollHeight;
        });
      }

      await expect(industrySection).toBeVisible({ timeout: 5000 });
    });

    test('should display education landscape', async ({ page }) => {
      const educationSection = page.locator('text=Education Landscape');

      if (!(await educationSection.isVisible())) {
        await page.locator('div.overflow-y-auto').evaluate(el => {
          el.scrollTop = el.scrollHeight;
        });
      }

      await expect(educationSection).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Careers Tab', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to map and select location
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);
    });

    test('should display career cards', async ({ page }) => {
      // Career cards should be visible
      const contentArea = page.locator('text=/careers in Gauteng/i');
      await expect(contentArea).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Colleges Tab', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to map and select location
      await navigateToMapPageWithAuth(page);
      await selectLocation(page);

      // Click colleges tab
      const collegesTab = page.locator('button:has-text("🎓 Colleges")');
      await collegesTab.click();
    });

    test('should show universities and TVET sub-tabs', async ({ page }) => {
      const universitiesTab = page.locator('text=Universities');
      const tvetTab = page.locator('text=TVET');

      await expect(universitiesTab).toBeVisible({ timeout: 5000 });
      await expect(tvetTab).toBeVisible({ timeout: 5000 });
    });

    test('should display universities by default', async ({ page }) => {
      // Should show college list
      const collegeList = page.locator('text=/Universities & Colleges/');
      await expect(collegeList).toBeVisible({ timeout: 5000 });
    });

    test('should switch between universities and TVET', async ({ page }) => {
      const tvetTab = page.locator('button:has-text("🏗️ TVET")').first();

      await tvetTab.click();

      // Content should update
      const content = page.locator('[class*="border"][class*="rounded"]').first();
      await expect(content).toBeVisible({ timeout: 5000 });
    });
  });
});
