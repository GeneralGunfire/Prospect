import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

await page.route('https://hdofbjgfpbwnzkwoggvj.supabase.co/**', async (route) => {
  const url = route.request().url();
  if (url.includes('/auth/v1/')) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { session: null }, error: null }) });
  } else {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  }
});

await page.addInitScript(() => {
  window.__PLAYWRIGHT_TEST__ = true;
});

const BASE = 'http://localhost:3000';
const pages = [
  'dashboard', 'careers', 'quiz', 'bursaries', 'bursary', 'map',
  'tvet', 'tvet-careers', 'tvet-colleges', 'tvet-funding', 'tvet-requirements',
  'subject-selector', 'library', 'calendar', 'school-assist', 'school-assist-chat',
  'water-dashboard', 'tax-budget', 'cost-of-living', 'civics', 'community-impact',
  'auth', 'impact-auth',
];

await page.setViewportSize({ width: 1440, height: 900 });

for (const p of pages) {
  try {
    await page.goto(`${BASE}/?page=${p}&__test_mode=true`);
    await page.waitForTimeout(2500);
    const errors = await page.evaluate(() => window.__errors || []);
    const title = await page.title();
    const bodyText = await page.locator('body').innerText().catch(() => '');
    const hasError = bodyText.includes('Error') || bodyText.includes('Cannot read') || bodyText.includes('undefined');
    writeFileSync(`c:/tmp/ss-${p}.png`, await page.screenshot({ fullPage: false }));
    console.log(`[${hasError ? 'WARN' : 'OK  '}] ${p}`);
  } catch(e) {
    console.log(`[FAIL] ${p}: ${e.message}`);
  }
}

await browser.close();
