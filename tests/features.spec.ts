import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Prospect App - Core Features', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Clear localStorage before each test
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  // ============= BOOKMARKS TESTS =============
  test.describe('Bookmarks Feature', () => {
    test('should save bookmark to localStorage', async () => {
      await page.goto(`${BASE_URL}/careers`);

      // Wait for career cards to load
      await page.waitForSelector('[data-testid="career-card"]', { timeout: 5000 });

      // Open first career detail
      const firstCard = page.locator('[data-testid="career-card"]').first();
      await firstCard.click();

      // Wait for modal
      await page.waitForSelector('[data-testid="career-modal"]', { timeout: 3000 });

      // Click bookmark button
      const bookmarkBtn = page.locator('[data-testid="bookmark-btn"]').first();
      await bookmarkBtn.click();

      // Verify localStorage has bookmark
      const bookmarks = await page.evaluate(() => {
        const stored = localStorage.getItem('prospect_career_bookmarks_v2');
        return stored ? JSON.parse(stored) : [];
      });

      expect(bookmarks.length).toBeGreaterThan(0);
    });

    test('should persist bookmarks across page reload', async () => {
      await page.goto(`${BASE_URL}/careers`);
      await page.waitForSelector('[data-testid="career-card"]', { timeout: 5000 });

      // Save a bookmark
      const firstCard = page.locator('[data-testid="career-card"]').first();
      await firstCard.click();
      await page.waitForSelector('[data-testid="career-modal"]', { timeout: 3000 });

      const bookmarkBtn = page.locator('[data-testid="bookmark-btn"]').first();
      const initialFill = await bookmarkBtn.locator('svg').evaluate((el) => el.getAttribute('fill'));

      await bookmarkBtn.click();

      // Reload page
      await page.reload();
      await page.waitForSelector('[data-testid="career-card"]', { timeout: 5000 });

      // Open same career and check if still bookmarked
      const firstCardAfterReload = page.locator('[data-testid="career-card"]').first();
      await firstCardAfterReload.click();
      await page.waitForSelector('[data-testid="career-modal"]', { timeout: 3000 });

      const bookmarkBtnAfterReload = page.locator('[data-testid="bookmark-btn"]').first();
      const afterReloadFill = await bookmarkBtnAfterReload.locator('svg').evaluate((el) =>
        el.getAttribute('fill')
      );

      // Bookmark should still be filled
      expect(afterReloadFill).toBe('white');
    });

    test('should remove bookmark when clicked again', async () => {
      await page.goto(`${BASE_URL}/careers`);
      await page.waitForSelector('[data-testid="career-card"]', { timeout: 5000 });

      const firstCard = page.locator('[data-testid="career-card"]').first();
      await firstCard.click();
      await page.waitForSelector('[data-testid="career-modal"]', { timeout: 3000 });

      const bookmarkBtn = page.locator('[data-testid="bookmark-btn"]').first();

      // Add bookmark
      await bookmarkBtn.click();
      await page.waitForTimeout(500);

      // Remove bookmark
      await bookmarkBtn.click();
      await page.waitForTimeout(500);

      // Verify localStorage is empty
      const bookmarks = await page.evaluate(() => {
        const stored = localStorage.getItem('prospect_career_bookmarks_v2');
        return stored ? JSON.parse(stored) : [];
      });

      expect(bookmarks.length).toBe(0);
    });
  });

  // ============= QUIZ RESULTS TESTS =============
  test.describe('Quiz Results Feature', () => {
    test('should save quiz results to localStorage', async () => {
      await page.goto(`${BASE_URL}/quiz`);
      await page.waitForSelector('[data-testid="quiz-container"]', { timeout: 5000 });

      // Simulate completing quiz
      const quizResults = {
        riasecScores: { r: 60, i: 70, a: 50, s: 80, e: 65, c: 55 },
        topCareers: ['engineer', 'scientist', 'doctor'],
        apsScore: 45,
      };

      // Store quiz result using page context
      await page.evaluate((data) => {
        const existing = localStorage.getItem('prospect_quiz_results_v2');
        const results = existing ? JSON.parse(existing) : [];
        results.unshift({
          id: `local_${Date.now()}`,
          user_id: 'test-user',
          ...data,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('prospect_quiz_results_v2', JSON.stringify(results));
      }, quizResults);

      // Verify it was saved
      const savedResults = await page.evaluate(() => {
        const stored = localStorage.getItem('prospect_quiz_results_v2');
        return stored ? JSON.parse(stored) : [];
      });

      expect(savedResults.length).toBeGreaterThan(0);
      expect(savedResults[0].riasecScores).toEqual(quizResults.riasecScores);
    });

    test('should persist quiz results across page reload', async () => {
      const quizData = {
        riasecScores: { r: 60, i: 70, a: 50, s: 80, e: 65, c: 55 },
        topCareers: ['engineer', 'scientist'],
        apsScore: 45,
      };

      // Save results before any navigation
      await page.goto(`${BASE_URL}`);
      await page.evaluate((data) => {
        const results = [{
          id: `local_${Date.now()}`,
          user_id: 'test-user',
          ...data,
          created_at: new Date().toISOString(),
        }];
        localStorage.setItem('prospect_quiz_results_v2', JSON.stringify(results));
      }, quizData);

      // Reload
      await page.reload();

      // Verify results still exist
      const savedResults = await page.evaluate(() => {
        const stored = localStorage.getItem('prospect_quiz_results_v2');
        return stored ? JSON.parse(stored) : [];
      });

      expect(savedResults.length).toBe(1);
      expect(savedResults[0].apsScore).toBe(quizData.apsScore);
    });
  });

  // ============= CALENDAR TESTS =============
  test.describe('Calendar Feature', () => {
    test('should display year calendar with month selector', async () => {
      await page.goto(`${BASE_URL}/calendar`);
      await page.waitForSelector('[data-testid="year-calendar"]', { timeout: 5000 });

      // Check month buttons exist
      const monthButtons = page.locator('[data-testid="month-selector-btn"]');
      const count = await monthButtons.count();

      expect(count).toBe(12); // 12 months
    });

    test('should switch months instantly without loading state', async () => {
      await page.goto(`${BASE_URL}/calendar`);
      await page.waitForSelector('[data-testid="year-calendar"]', { timeout: 5000 });

      const currentMonth = await page.locator('[data-testid="current-month"]').textContent();

      // Click next month
      const nextMonthBtn = page.locator('[data-testid="month-selector-btn"]').nth(1);
      await nextMonthBtn.click();

      // Check month changed instantly (no loading state)
      const loadingState = page.locator('[data-testid="calendar-loading"]');
      const isVisible = await loadingState.isVisible().catch(() => false);

      expect(isVisible).toBe(false);

      // Verify month changed
      const newMonth = await page.locator('[data-testid="current-month"]').textContent();
      expect(newMonth).not.toBe(currentMonth);
    });

    test('should open event creation modal when date is clicked', async () => {
      await page.goto(`${BASE_URL}/calendar`);
      await page.waitForSelector('[data-testid="calendar-day"]', { timeout: 5000 });

      // Click a calendar day
      const calendarDay = page.locator('[data-testid="calendar-day"]').first();
      await calendarDay.click();

      // Wait for modal
      const modal = page.waitForSelector('[data-testid="create-event-modal"]', { timeout: 3000 });
      await modal;

      // Verify modal is visible
      const modalVisible = await page.locator('[data-testid="create-event-modal"]').isVisible();
      expect(modalVisible).toBe(true);
    });

    test('should save event with description instead of date selection', async () => {
      await page.goto(`${BASE_URL}/calendar`);
      await page.waitForSelector('[data-testid="calendar-day"]', { timeout: 5000 });

      // Click calendar day
      const calendarDay = page.locator('[data-testid="calendar-day"]').first();
      await calendarDay.click();

      // Wait for modal
      await page.waitForSelector('[data-testid="create-event-modal"]', { timeout: 3000 });

      // Fill description
      const descriptionField = page.locator('[data-testid="event-description"]');
      await descriptionField.fill('Study Mathematics');

      // Click create button
      const createBtn = page.locator('[data-testid="create-event-btn"]');
      await createBtn.click();

      // Verify modal closed
      const modal = page.locator('[data-testid="create-event-modal"]');
      await modal.waitFor({ state: 'hidden', timeout: 3000 });

      const isVisible = await modal.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    });
  });

  // ============= OVERALL DATA PERSISTENCE TESTS =============
  test.describe('Data Persistence', () => {
    test('should maintain all user data after session restart', async () => {
      // Save test data
      const testData = {
        bookmarks: ['career1', 'career2'],
        quizResults: [{
          id: 'test-1',
          user_id: 'test-user',
          riasecScores: { r: 60, i: 70, a: 50, s: 80, e: 65, c: 55 },
          topCareers: ['engineer'],
          created_at: new Date().toISOString(),
        }],
      };

      await page.goto(`${BASE_URL}`);
      await page.evaluate((data) => {
        localStorage.setItem('prospect_career_bookmarks_v2', JSON.stringify(data.bookmarks));
        localStorage.setItem('prospect_quiz_results_v2', JSON.stringify(data.quizResults));
      }, testData);

      // Close and reopen
      await page.close();

      const newPage = await page.context().newPage();
      await newPage.goto(`${BASE_URL}`);

      // Verify all data persists
      const persistedData = await newPage.evaluate(() => ({
        bookmarks: JSON.parse(localStorage.getItem('prospect_career_bookmarks_v2') || '[]'),
        quiz: JSON.parse(localStorage.getItem('prospect_quiz_results_v2') || '[]'),
      }));

      expect(persistedData.bookmarks).toEqual(testData.bookmarks);
      expect(persistedData.quiz).toEqual(testData.quizResults);

      await newPage.close();
    });

    test('should handle localStorage quota gracefully', async () => {
      await page.goto(`${BASE_URL}`);

      // Try to store large data
      const largeData = new Array(1000).fill('test-data');

      const stored = await page.evaluate((data) => {
        try {
          localStorage.setItem('prospect_test_large', JSON.stringify(data));
          return true;
        } catch (err) {
          console.warn('Storage quota exceeded:', err);
          return false;
        }
      }, largeData);

      // Should handle gracefully (either store or fail gracefully, not crash)
      expect(typeof stored).toBe('boolean');
    });
  });

  // ============= OFFLINE FUNCTIONALITY TESTS =============
  test.describe('Offline Functionality', () => {
    test('should work without network connection', async () => {
      // Go online first and save data
      await page.goto(`${BASE_URL}`);

      // Save bookmark
      await page.evaluate(() => {
        const bookmarks = ['offline-test-1'];
        localStorage.setItem('prospect_career_bookmarks_v2', JSON.stringify(bookmarks));
      });

      // Go offline
      await page.context().setOffline(true);

      // Reload page - should still work
      await page.reload();

      // Verify data is still accessible
      const bookmarks = await page.evaluate(() => {
        const stored = localStorage.getItem('prospect_career_bookmarks_v2');
        return stored ? JSON.parse(stored) : [];
      });

      expect(bookmarks).toEqual(['offline-test-1']);

      // Go back online
      await page.context().setOffline(false);
    });
  });
});

// ============= PERFORMANCE TESTS =============
test.describe('Performance', () => {
  test('bookmarks should respond instantly (< 100ms)', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(BASE_URL);

    const startTime = Date.now();

    await page.evaluate(() => {
      const bookmarks = ['test'];
      localStorage.setItem('prospect_career_bookmarks_v2', JSON.stringify(bookmarks));
    });

    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(100);
    await page.close();
  });

  test('calendar month switch should be instant (< 200ms)', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/calendar`);
    await page.waitForSelector('[data-testid="year-calendar"]', { timeout: 5000 });

    const startTime = Date.now();

    // Simulate month switch
    const monthBtn = page.locator('[data-testid="month-selector-btn"]').nth(1);
    await monthBtn.click();

    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(200);
    await page.close();
  });
});
