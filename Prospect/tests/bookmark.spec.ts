import { test, expect } from '@playwright/test';

test.describe('Bookmark Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a study topic page
    await page.goto('http://localhost:5173/library/mathematics/10/1');
  });

  test('should toggle bookmark on/off', async ({ page }) => {
    // Get the bookmark button
    const bookmarkButton = page.getByTestId('bookmark-button');

    // Initially should show "Save Lesson"
    await expect(bookmarkButton).toContainText('Save Lesson');

    // Click to save
    await bookmarkButton.click();

    // Should now show "Saved"
    await expect(bookmarkButton).toContainText('Saved');

    // Click to unsave
    await bookmarkButton.click();

    // Should be back to "Save Lesson"
    await expect(bookmarkButton).toContainText('Save Lesson');
  });

  test('should persist bookmark in localStorage', async ({ page }) => {
    const bookmarkButton = page.getByTestId('bookmark-button');

    // Click to save
    await bookmarkButton.click();
    await expect(bookmarkButton).toContainText('Saved');

    // Refresh the page
    await page.reload();

    // Should still show "Saved"
    await expect(bookmarkButton).toContainText('Saved');
  });

  test('bookmark icon should be filled when saved', async ({ page }) => {
    const bookmarkButton = page.getByTestId('bookmark-button');
    const bookmarkIcon = bookmarkButton.locator('svg');

    // Initially unfilled
    let classList = await bookmarkIcon.evaluate(el => el.className.baseVal);
    expect(classList).not.toContain('fill-secondary');

    // Click to save
    await bookmarkButton.click();

    // Should be filled
    classList = await bookmarkIcon.evaluate(el => el.className.baseVal);
    expect(classList).toContain('fill-secondary');
  });
});
