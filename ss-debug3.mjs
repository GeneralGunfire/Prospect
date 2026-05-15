import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

page.on('pageerror', err => console.log('PAGE ERR:', err.message));

// Intercept ALL Supabase REST and auth calls
await page.route('https://hdofbjgfpbwnzkwoggvj.supabase.co/**', async (route) => {
  const url = route.request().url();
  if (url.includes('/auth/v1/')) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { session: null }, error: null }) });
  } else {
    // REST data queries — Supabase REST returns plain array
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  }
});

await page.addInitScript(() => { window.__PLAYWRIGHT_TEST__ = true; });
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto('http://localhost:3001/?page=dashboard&__test_mode=true');
await page.waitForTimeout(5000);
writeFileSync('c:/tmp/dash-new.png', await page.screenshot({ fullPage: false }));
console.log('dashboard done');

await page.goto('http://localhost:3001/?page=community-impact&__test_mode=true');
await page.waitForTimeout(5000);
writeFileSync('c:/tmp/community-new.png', await page.screenshot({ fullPage: false }));
console.log('community done');

await browser.close();
