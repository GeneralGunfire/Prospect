import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

page.on('pageerror', err => console.log('PAGE ERR:', err.message));

await page.route('https://hdofbjgfpbwnzkwoggvj.supabase.co/**', async (route) => {
  const url = route.request().url();
  if (url.includes('/auth/v1/')) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { session: null }, error: null }) });
  } else {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  }
});

await page.addInitScript(() => { window.__PLAYWRIGHT_TEST__ = true; });
await page.setViewportSize({ width: 1440, height: 900 });

const pages = [
  'dashboard', 'community-impact', 'load-shedding', 'matric-exam-dates',
  'school-assist', 'water-dashboard', 'careers', 'quiz',
];

for (const p of pages) {
  await page.goto(`http://localhost:3001/?page=${p}&__test_mode=true`);
  await page.waitForTimeout(3000);
  writeFileSync(`c:/tmp/check-${p}.png`, await page.screenshot({ fullPage: false }));
  console.log(`${p} done`);
}

await browser.close();
