import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test('calendar debug - capture JS errors', async ({ page }) => {
  const errors: string[] = [];
  const logs: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${BASE_URL}/?page=calendar&__test_mode=true`);
  await page.waitForTimeout(5000);
  
  // Get page HTML
  const bodyText = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
  
  console.log('=== ERRORS ===');
  errors.forEach(e => console.log(e));
  console.log('=== BODY ===');
  console.log(bodyText);
  console.log('=== LOGS (last 10) ===');
  logs.slice(-10).forEach(l => console.log(l));
  
  expect(errors).toHaveLength(0);
});
