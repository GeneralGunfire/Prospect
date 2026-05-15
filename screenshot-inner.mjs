import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

// Intercept Supabase at network level (catches XHR + fetch, not just window.fetch)
await page.route('https://hdofbjgfpbwnzkwoggvj.supabase.co/**', async (route) => {
  const url = route.request().url();
  if (url.includes('/auth/v1/')) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { session: null }, error: null }) });
  } else {
    // REST data queries return plain arrays
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  }
});

await page.addInitScript(() => {
  // withAuth reads this to inject a mock user instead of redirecting to login
  window.__PLAYWRIGHT_TEST__ = true;
});

const pages = [
  { url: 'http://localhost:3000/?page=dashboard&__test_mode=true', file: 'dashboard' },
  { url: 'http://localhost:3000/?page=quiz&__test_mode=true', file: 'quiz' },
  { url: 'http://localhost:3000/?page=careers&__test_mode=true', file: 'careers' },
  { url: 'http://localhost:3000/?page=bursaries&__test_mode=true', file: 'bursaries' },
  { url: 'http://localhost:3000/?page=tvet&__test_mode=true', file: 'tvet' },
  { url: 'http://localhost:3000/?page=auth&__test_mode=true', file: 'auth' },
];

await page.setViewportSize({ width: 1440, height: 900 });

for (const p of pages) {
  await page.goto(p.url);
  await page.waitForTimeout(2000);
  writeFileSync(`c:/tmp/inner-${p.file}-desktop.png`, await page.screenshot({ fullPage: false }));
  console.log(`${p.file} desktop done`);
}

// Mobile shots for key pages
await page.setViewportSize({ width: 390, height: 844 });
for (const p of pages.slice(0, 3)) {
  await page.goto(p.url);
  await page.waitForTimeout(2000);
  writeFileSync(`c:/tmp/inner-${p.file}-mobile.png`, await page.screenshot({ fullPage: false }));
  console.log(`${p.file} mobile done`);
}

await browser.close();
console.log('all done');
