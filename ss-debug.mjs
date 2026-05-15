import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

// Log console errors
page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE ERR:', msg.text()); });
page.on('pageerror', err => console.log('PAGE ERR:', err.message));

await page.addInitScript(() => {
  window.__PLAYWRIGHT_TEST__ = true;
  const origFetch = window.fetch;
  window.fetch = async (url, opts) => {
    if (typeof url === 'string' && url.includes('supabase')) {
      return new Response(JSON.stringify({ data: { session: null }, error: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return origFetch(url, opts);
  };
});

await page.setViewportSize({ width: 1440, height: 900 });

await page.goto('http://localhost:3001/?page=dashboard&__test_mode=true');
await page.waitForTimeout(5000);
const html = await page.content();
console.log('Body excerpt:', (await page.locator('body').innerHTML()).substring(0, 500));
writeFileSync('c:/tmp/ss-dashboard2.png', await page.screenshot({ fullPage: false }));

await page.goto('http://localhost:3001/?page=community-impact&__test_mode=true');
await page.waitForTimeout(5000);
console.log('Community body:', (await page.locator('body').innerHTML()).substring(0, 500));
writeFileSync('c:/tmp/ss-community2.png', await page.screenshot({ fullPage: false }));

await browser.close();
