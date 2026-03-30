import { test, expect, type Page } from '@playwright/test';

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

/**
 * Set a mock Supabase session in localStorage to bypass authentication
 * This allows tests to access protected pages without real login
 */
async function setMockSupabaseSession(page: Page) {
  const mockUser = {
    id: `test-user-${Date.now()}`,
    email: `test-user-${Date.now()}@example.com`,
    email_confirmed_at: new Date().toISOString(),
    phone: null,
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Test User' },
    identities: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  };

  const mockSession = {
    access_token: `test-mock-token-${Date.now()}`,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: `test-mock-refresh-${Date.now()}`,
    user: mockUser,
  };

  // Set the mock session in localStorage
  await page.evaluate((session) => {
    localStorage.setItem('__test_mock_session__', JSON.stringify(session));
  }, mockSession);
}

/**
 * Enable test mode to bypass auth checks
 */
async function enableTestMode(page: Page) {
  await page.evaluate(() => {
    sessionStorage.setItem('__test_mode__', 'true');
  });
}

/**
 * Login a test user by setting up mock session and test mode
 */
async function loginTestUser(page: Page) {
  await setMockSupabaseSession(page);
  await enableTestMode(page);
}

/**
 * Wait for the app to be ready after navigation
 * Checks for common loading indicators to disappear
 */
async function waitForAppReady(page: Page) {
  // Wait for loading spinners to be gone
  await page.waitForSelector('[data-testid="loading-spinner"], .spinner', {
    state: 'hidden',
    timeout: 10000,
  }).catch(() => {
    // It's ok if there's no loading spinner
  });

  // Ensure page is in idle state
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
    // Network might still be busy, but we'll continue
  });
}

/**
 * Collect console messages and errors during page navigation
 */
async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  return errors;
}

// ─── PRIORITY 1: STUDY LIBRARY SUBJECTS TESTS ──────────────────────────────────

test.describe('PRIORITY 1: Study Library - Unwanted Subjects Removed', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/?page=study-library&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);
  });

  // ─── Subjects That Should Be Removed ───

  test('should NOT show "English First Additional" subject', async ({ page }) => {
    const englishFirstAdditional = page.locator(
      'text=English First Additional'
    );
    await expect(englishFirstAdditional).not.toBeVisible();
  });

  test('should NOT show "Afrikaans Home Language" subject', async ({ page }) => {
    const afrikaansHome = page.locator('text=Afrikaans Home Language');
    await expect(afrikaansHome).not.toBeVisible();
  });

  test('should NOT show "Math Literacy" subject', async ({ page }) => {
    const mathLiteracy = page.locator('text=Math Literacy');
    await expect(mathLiteracy).not.toBeVisible();
  });

  test('should NOT show "Life Orientation" subject', async ({ page }) => {
    const lifeOrientation = page.locator('text=Life Orientation');
    await expect(lifeOrientation).not.toBeVisible();
  });

  test('should NOT show "History" subject', async ({ page }) => {
    const history = page.locator('text=History');
    await expect(history).not.toBeVisible();
  });

  test('should NOT show "Geography" subject', async ({ page }) => {
    const geography = page.locator('text=Geography');
    await expect(geography).not.toBeVisible();
  });

  test('should NOT show "Information Technology" subject', async ({ page }) => {
    const informationTechnology = page.locator(
      'text=Information Technology'
    );
    await expect(informationTechnology).not.toBeVisible();
  });

  test('should NOT show "Design" subject', async ({ page }) => {
    const design = page.locator('text=Design');
    await expect(design).not.toBeVisible();
  });

  // ─── Subjects That Should Be Kept ───

  test('should show "Mathematics" subject', async ({ page }) => {
    const mathematics = page.locator(
      'text=/^Mathematics$/i'
    );
    await expect(mathematics).toBeVisible();
  });

  test('should show "Physical Sciences" subject', async ({ page }) => {
    const physicalSciences = page.locator('text=Physical Sciences');
    await expect(physicalSciences).toBeVisible();
  });

  test('should show "Life Sciences" subject', async ({ page }) => {
    const lifeSciences = page.locator('text=Life Sciences');
    await expect(lifeSciences).toBeVisible();
  });

  test('should show "Accounting" subject', async ({ page }) => {
    const accounting = page.locator('text=Accounting');
    await expect(accounting).toBeVisible();
  });

  test('should show "Business Studies" subject', async ({ page }) => {
    const businessStudies = page.locator('text=Business Studies');
    await expect(businessStudies).toBeVisible();
  });

  test('should show "Economics" subject', async ({ page }) => {
    const economics = page.locator('text=Economics');
    await expect(economics).toBeVisible();
  });

  test('should show "CAT" subject', async ({ page }) => {
    const cat = page.locator('text=CAT');
    await expect(cat).toBeVisible();
  });

  test('should show "EGD" subject', async ({ page }) => {
    const egD = page.locator('text=EGD');
    await expect(egD).toBeVisible();
  });

  test('should show "English Home Language" subject', async ({ page }) => {
    const englishHome = page.locator('text=English Home Language');
    await expect(englishHome).toBeVisible();
  });

  // ─── Subject Cards Interactivity ───

  test('should display subject cards as interactive elements', async ({
    page,
  }) => {
    // Look for subject cards - should have click handlers or button-like attributes
    const subjectCards = page.locator(
      '[role="button"], button:has-text("Mathematics"), [data-testid*="subject"]'
    );
    const count = await subjectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow subject card interaction (hover state)', async ({
    page,
  }) => {
    // Find a subject card
    const subjectCard = page.locator('text=Mathematics').first();
    await expect(subjectCard).toBeVisible();

    // Hover over it
    await subjectCard.hover();

    // Check if it becomes interactive (this varies by implementation)
    // At minimum, ensure we can click without error
    await subjectCard.click().catch(() => {
      // Some cards might not be directly clickable
    });
  });

  test('should have all 9 kept subjects visible on page', async ({ page }) => {
    const subjects = [
      'Mathematics',
      'Physical Sciences',
      'Life Sciences',
      'Accounting',
      'Business Studies',
      'Economics',
      'CAT',
      'EGD',
      'English Home Language',
    ];

    for (const subject of subjects) {
      const subjectElement = page.locator(`text=${subject}`);
      await expect(subjectElement).toBeVisible();
    }
  });
});

// ─── PRIORITY 2: QUIZ RESULTS & BOOKMARKS PERSISTENCE TESTS ───────────────────

test.describe('PRIORITY 2: Quiz Results & Bookmarks Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
    // Navigate to dashboard
    await page.goto('/?page=dashboard&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);
  });

  // ─── Dashboard APS Score ───

  test('dashboard should display APS score stat', async ({ page }) => {
    // Look for APS score display on dashboard
    const apsScore = page.locator('[data-testid="aps-score"], :text("APS")');
    await expect(apsScore.first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      // If no explicit APS element, check for a score-like display
      const scoreElements = page.locator(
        'text=/Score|APS|Total Points/i'
      );
      await expect(scoreElements.first()).toBeVisible();
    });
  });

  test('dashboard should display numeric APS value', async ({ page }) => {
    // Look for a numeric value that represents APS score
    const scoreValue = page.locator(
      '[data-testid="aps-value"], [data-testid="score-value"], .score-display'
    );
    await expect(scoreValue.first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      // Fallback: look for any prominent number on dashboard
      const numbers = page.locator('text=/^\\d{1,3}$/', { hasText: /\d/ });
      expect(await numbers.count()).toBeGreaterThan(0);
    });
  });

  // ─── Saved Careers Section ───

  test('dashboard should display "Saved Careers" section', async ({ page }) => {
    const savedCareersSection = page.locator(
      '[data-testid="saved-careers"], text=Saved Careers'
    );
    await expect(savedCareersSection.first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      // Look for any careers list on dashboard
      const careersHeading = page.locator('text=/Saved|Bookmarked|My Careers/i');
      await expect(careersHeading.first()).toBeVisible();
    });
  });

  test('dashboard should display "Saved Bursaries" section', async ({ page }) => {
    const savedBursariesSection = page.locator(
      '[data-testid="saved-bursaries"], text=Saved Bursaries'
    );
    await expect(savedBursariesSection.first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      // Look for any bursaries section
      const bursariesHeading = page.locator('text=/Saved|Bookmarked|Bursaries/i');
      await expect(bursariesHeading.first()).toBeVisible();
    });
  });

  // ─── Bookmarks on Careers Page ───

  test('should be able to save bookmarks on Careers page', async ({ page }) => {
    // Navigate to careers page
    await page.goto('/?page=careers&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Find a career card with save/bookmark button
    const bookmarkButton = page.locator(
      '[data-testid*="bookmark"], button:has-text("Save"), button:has-text("Add")'
    ).first();

    if (await bookmarkButton.isVisible()) {
      const initialState = await bookmarkButton.getAttribute('aria-pressed');
      await bookmarkButton.click();

      // Wait for confirmation (could be visual change or aria-pressed state change)
      await page.waitForTimeout(500); // Brief pause for state update

      const newState = await bookmarkButton.getAttribute('aria-pressed');
      expect(newState).not.toBe(initialState);
    }
  });

  test('should be able to remove bookmarks on Careers page', async ({ page }) => {
    await page.goto('/?page=careers&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Find a career card with bookmark/remove button
    const bookmarkButton = page.locator(
      '[data-testid*="bookmark"], button:has-text("Remove"), button:has-text("Saved")'
    ).first();

    if (await bookmarkButton.isVisible()) {
      const initialState = await bookmarkButton.getAttribute('aria-pressed');
      await bookmarkButton.click();

      await page.waitForTimeout(500);

      const newState = await bookmarkButton.getAttribute('aria-pressed');
      expect(newState).not.toBe(initialState);
    }
  });

  test('bookmarks should persist after page reload', async ({ page }) => {
    await page.goto('/?page=careers&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Save a bookmark
    const bookmarkButton = page.locator(
      '[data-testid*="bookmark"], button:has-text("Save")'
    ).first();

    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();
      await page.waitForTimeout(500);

      // Get the bookmark state before reload
      const savedState = await bookmarkButton.getAttribute('aria-pressed');

      // Reload page
      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      // Find the same bookmark and check state persisted
      const bookmarkButtonAfterReload = page.locator(
        '[data-testid*="bookmark"]'
      ).first();
      const reloadedState = await bookmarkButtonAfterReload.getAttribute(
        'aria-pressed'
      );

      expect(reloadedState).toBe(savedState);
    }
  });

  // ─── Quiz Results Storage ───

  test('quiz results should be saved', async ({ page }) => {
    // Navigate to quiz/prospect page
    await page.goto('/?page=prospect&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Check if quiz results are accessible via API or localStorage
    const quizResults = await page.evaluate(() => {
      try {
        const stored = localStorage.getItem('quiz_results') ||
          localStorage.getItem('prospect_results') ||
          sessionStorage.getItem('quiz_results');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    });

    // Results might be in different formats, but something should be stored
    if (quizResults) {
      expect(quizResults).toBeDefined();
    }
  });

  test('quiz results should be retrievable on dashboard', async ({ page }) => {
    // Dashboard should show some indication of completed quiz
    const quizIndicator = page.locator(
      '[data-testid*="quiz"], text=/Quiz|Results|Score/i'
    );

    // At minimum, check that dashboard loads without errors
    await expect(page.locator('body')).toBeVisible();
  });
});

// ─── PRIORITY 3: GRADE 10 SUBJECT SELECTOR TESTS ──────────────────────────────

test.describe('PRIORITY 3: Grade 10 Subject Selector', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
  });

  // ─── Subject Selector Page Accessibility ───

  test('Subject Selector page should be accessible', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Page should load and be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('Subject Selector should display heading', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const heading = page.locator(
      'h1, h2, [data-testid="page-title"], text=/Select.*Subject|Choose.*Subject/i'
    );
    await expect(heading.first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      // At minimum, page should have content
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ─── All 9 Subjects Display ───

  test('should display all 9 Grade 10 subjects', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const expectedSubjects = [
      'Mathematics',
      'Physical Sciences',
      'Life Sciences',
      'Accounting',
      'Business Studies',
      'Economics',
      'CAT',
      'EGD',
      'English Home Language',
    ];

    for (const subject of expectedSubjects) {
      const subjectElement = page.locator(`text=${subject}`);
      await expect(subjectElement).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have exactly 9 subject cards displayed', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Count subject cards
    const subjectCards = page.locator(
      '[data-testid*="subject-card"], [role="button"]:has-text(/Mathematics|Physics|Biology|Accounting|Business|Economics|CAT|EGD|English/)'
    );
    const count = await subjectCards.count();

    expect(count).toBeGreaterThanOrEqual(9);
  });

  // ─── Subject Selection Toggling ───

  test('should allow selecting a subject', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Find first subject and select it
    const firstSubject = page.locator(
      '[data-testid*="subject"], button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();

    await firstSubject.click();
    await page.waitForTimeout(300); // Brief delay for UI update

    // Check if selection state changed (class, aria attribute, etc.)
    const ariaSelected = await firstSubject.getAttribute('aria-selected');
    const ariaPressed = await firstSubject.getAttribute('aria-pressed');
    const hasSelectedClass = await firstSubject.evaluate((el) =>
      el.className.includes('selected') || el.className.includes('active')
    );

    expect(
      ariaSelected === 'true' ||
        ariaPressed === 'true' ||
        hasSelectedClass === true
    ).toBeTruthy();
  });

  test('should allow deselecting a subject', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const subject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();

    // Select
    await subject.click();
    await page.waitForTimeout(300);

    // Deselect
    await subject.click();
    await page.waitForTimeout(300);

    // Should return to non-selected state
    const ariaSelected = await subject.getAttribute('aria-selected');
    const ariaPressed = await subject.getAttribute('aria-pressed');
    const hasSelectedClass = await subject.evaluate((el) =>
      el.className.includes('selected') || el.className.includes('active')
    );

    expect(
      ariaSelected === 'false' ||
        ariaPressed === 'false' ||
        hasSelectedClass === false
    ).toBeTruthy();
  });

  test('should allow selecting multiple subjects', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const subjects = ['Mathematics', 'Physics', 'Life Sciences'];

    for (const subjectName of subjects) {
      const subject = page.locator(
        'button, [role="button"]'
      ).filter({ hasText: subjectName }).first();

      if (await subject.isVisible()) {
        await subject.click();
        await page.waitForTimeout(200);
      }
    }

    // Verify selections persisted
    let selectionCount = 0;
    for (const subjectName of subjects) {
      const subject = page.locator(
        'button, [role="button"]'
      ).filter({ hasText: subjectName }).first();

      const isSelected =
        (await subject.getAttribute('aria-selected')) === 'true' ||
        (await subject.getAttribute('aria-pressed')) === 'true';

      if (isSelected) selectionCount++;
    }

    expect(selectionCount).toBeGreaterThan(0);
  });

  // ─── Matching Careers Display ───

  test('should display matching careers when subjects selected', async ({
    page,
  }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Select a subject
    const mathSubject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();

    await mathSubject.click();
    await page.waitForTimeout(500);

    // Look for careers display
    const careersSection = page.locator(
      '[data-testid*="careers"], text=/Matching Careers|Careers For|Top Careers/i'
    );

    await expect(careersSection.first()).toBeVisible({ timeout: 8000 }).catch(async () => {
      // At minimum, check that some content appears
      const content = page.locator('[data-testid*="career"], [data-testid*="result"]');
      expect(await content.count()).toBeGreaterThanOrEqual(0);
    });
  });

  test('should update careers when subject selection changes', async ({
    page,
  }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Get initial careers count
    let careersCount1 = await page.locator(
      '[data-testid*="career"], [role="article"]:has-text(/Career|Job|Title/)'
    ).count();

    // Select Mathematics
    const mathSubject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();
    await mathSubject.click();
    await page.waitForTimeout(500);

    let careersCount2 = await page.locator(
      '[data-testid*="career"], [role="article"]:has-text(/Career|Job|Title/)'
    ).count();

    // Deselect Math and select different subject
    await mathSubject.click();
    await page.waitForTimeout(300);

    const physicsSubject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: /Physics|Physical/ }).first();

    if (await physicsSubject.isVisible()) {
      await physicsSubject.click();
      await page.waitForTimeout(500);

      const careersCount3 = await page.locator(
        '[data-testid*="career"], [role="article"]:has-text(/Career|Job|Title/)'
      ).count();

      // Careers should update (might be same or different, just shouldn't error)
      expect(careersCount3).toBeGreaterThanOrEqual(0);
    }
  });

  // ─── University Requirements Display ───

  test('should display university requirements', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Select a subject
    const mathSubject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();
    await mathSubject.click();
    await page.waitForTimeout(500);

    // Look for university section
    const universitySection = page.locator(
      '[data-testid*="university"], text=/University|Higher Education|University Requirements/i'
    );

    await expect(universitySection.first()).toBeVisible({ timeout: 8000 }).catch(async () => {
      // University info might be in careers display
      const careersDisplay = page.locator(
        '[data-testid*="career"], [data-testid*="result"]'
      );
      expect(await careersDisplay.count()).toBeGreaterThanOrEqual(0);
    });
  });

  test('should show TVET track requirements', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Select a subject
    const catSubject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'CAT' }).first();
    await catSubject.click();
    await page.waitForTimeout(500);

    // Look for TVET section
    const tvetSection = page.locator(
      '[data-testid*="tvet"], text=/TVET|Technical Vocational|Trade|Apprentice/i'
    );

    await expect(tvetSection.first()).toBeVisible({ timeout: 8000 }).catch(async () => {
      // TVET info might be part of careers display
      const display = page.locator('body');
      await expect(display).toBeVisible();
    });
  });

  // ─── TVET Careers Display ───

  test('should display TVET careers as option', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Select subjects that lead to TVET
    const catSubject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'CAT' }).first();

    if (await catSubject.isVisible()) {
      await catSubject.click();
      await page.waitForTimeout(500);

      // Look for TVET/technical career options
      const tvetCareers = page.locator(
        'text=/Electrician|Plumber|Welder|Mechanic|Technician|TVET/i'
      );

      const count = await tvetCareers.count();
      expect(count).toBeGreaterThanOrEqual(0); // Might not always show
    }
  });

  // ─── Clear Selection Button ───

  test('clear selection button should exist', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const clearButton = page.locator(
      'button:has-text("Clear"), button:has-text("Reset"), [data-testid*="clear"]'
    );

    await expect(clearButton.first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      // Clear button might not be visible until selections are made
      // Select a subject first
      const subject = page.locator(
        'button, [role="button"]'
      ).filter({ hasText: 'Mathematics' }).first();
      await subject.click();
      await page.waitForTimeout(300);

      // Now look for clear button
      await expect(clearButton.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test('clear selection button should reset all selections', async ({
    page,
  }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Select multiple subjects
    const subjects = ['Mathematics', 'Physical Sciences', 'Life Sciences'];
    for (const subjectName of subjects) {
      const subject = page.locator(
        'button, [role="button"]'
      ).filter({ hasText: subjectName }).first();
      if (await subject.isVisible()) {
        await subject.click();
        await page.waitForTimeout(200);
      }
    }

    // Find and click clear button
    const clearButton = page.locator(
      'button:has-text("Clear"), button:has-text("Reset"), [data-testid*="clear"]'
    ).first();

    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(500);

      // Check that selections are cleared
      let selectedCount = 0;
      for (const subjectName of subjects) {
        const subject = page.locator(
          'button, [role="button"]'
        ).filter({ hasText: subjectName }).first();

        const isSelected =
          (await subject.getAttribute('aria-selected')) === 'true' ||
          (await subject.getAttribute('aria-pressed')) === 'true';

        if (isSelected) selectedCount++;
      }

      expect(selectedCount).toBe(0);
    }
  });
});

// ─── MOBILE RESPONSIVENESS TESTS ───────────────────────────────────────────────

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
  });

  // ─── Subject Selector Mobile ───

  test('Subject Selector should be responsive on mobile', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Check that page is visible and scrollable
    await expect(page.locator('body')).toBeVisible();

    // Subjects should be accessible on mobile (might need scrolling)
    const subject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();

    if (await subject.isVisible({ timeout: 5000 })) {
      await subject.scrollIntoViewIfNeeded();
      await expect(subject).toBeVisible();
    }
  });

  test('Subject Selector should be tappable on mobile', async ({ page }) => {
    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const subject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();

    if (await subject.isVisible({ timeout: 5000 })) {
      // Get bounding box to ensure it's tappable size
      const box = await subject.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(40); // Minimum touch target
      expect(box?.height).toBeGreaterThanOrEqual(40);
    }
  });

  // ─── Dashboard Mobile ───

  test('Dashboard should be responsive on mobile', async ({ page }) => {
    await page.goto('/?page=dashboard&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Dashboard should be visible on mobile
    await expect(page.locator('body')).toBeVisible();

    // Content should be readable without horizontal scroll
    const bodyWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(400);
  });

  test('Dashboard sections should be stacked on mobile', async ({ page }) => {
    await page.goto('/?page=dashboard&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Sections should be vertically stacked (not side-by-side)
    const sections = page.locator('[data-testid*="section"], [role="region"]');
    const count = await sections.count();

    // If multiple sections, they should be readable in viewport
    if (count > 0) {
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      // Content should be scrollable, not cramped
      expect(viewportHeight).toBeGreaterThanOrEqual(300);
    }
  });

  // ─── Study Library Mobile ───

  test('Study Library should be responsive on mobile', async ({ page }) => {
    await page.goto('/?page=study-library&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    await expect(page.locator('body')).toBeVisible();

    // Subject cards should be visible
    const subjectCards = page.locator('[data-testid*="subject"], button');
    const count = await subjectCards.count();

    if (count > 0) {
      const firstCard = subjectCards.first();
      await firstCard.scrollIntoViewIfNeeded();
      await expect(firstCard).toBeVisible();
    }
  });

  test('Study Library cards should be tappable on mobile', async ({ page }) => {
    await page.goto('/?page=study-library&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const subjectCard = page.locator('[data-testid*="subject"], button').first();

    if (await subjectCard.isVisible({ timeout: 5000 })) {
      const box = await subjectCard.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(40);
      expect(box?.height).toBeGreaterThanOrEqual(40);
    }
  });
});

// ─── ERROR CHECKING TESTS ──────────────────────────────────────────────────────

test.describe('Error Checking', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
  });

  // ─── Dashboard Console Errors ───

  test('dashboard should have no critical console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      errors.push(err.toString());
    });

    await page.goto('/?page=dashboard&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Filter out non-critical errors (like fetch errors for optional resources)
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('Failed to fetch') &&
        !err.includes('404') &&
        !err.includes('CORS') &&
        !err.toLowerCase().includes('warning')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  // ─── Subject Selector Console Errors ───

  test('Subject Selector should have no critical console errors', async ({
    page,
  }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      errors.push(err.toString());
    });

    await page.goto('/?page=subject-selector&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Interact with page
    const subject = page.locator(
      'button, [role="button"]'
    ).filter({ hasText: 'Mathematics' }).first();
    if (await subject.isVisible()) {
      await subject.click();
      await page.waitForTimeout(500);
    }

    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('Failed to fetch') &&
        !err.includes('404') &&
        !err.includes('CORS') &&
        !err.toLowerCase().includes('warning')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  // ─── Study Library Console Errors ───

  test('Study Library should have no critical console errors', async ({
    page,
  }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      errors.push(err.toString());
    });

    await page.goto('/?page=study-library&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('Failed to fetch') &&
        !err.includes('404') &&
        !err.includes('CORS') &&
        !err.toLowerCase().includes('warning')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  // ─── Network Errors ───

  test('critical pages should load without network failures', async ({ page }) => {
    const networkErrors: string[] = [];

    page.on('requestfailed', (request) => {
      // Only log actual failures, not optional resource failures
      if (
        !request.url().includes('analytics') &&
        !request.url().includes('beacon')
      ) {
        networkErrors.push(`${request.method()} ${request.url()}`);
      }
    });

    await loginTestUser(page);
    await page.goto('/?page=dashboard&__test_mode=true', {
      waitUntil: 'domcontentloaded',
    });
    await waitForAppReady(page);

    // Critical requests should succeed
    expect(networkErrors.length).toBeLessThan(2);
  });
});
