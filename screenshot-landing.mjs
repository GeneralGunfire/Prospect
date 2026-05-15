import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

await page.addInitScript(() => {
  const origFetch = window.fetch;
  window.fetch = async (url, opts) => {
    if (typeof url === 'string' && url.includes('supabase')) {
      return new Response(JSON.stringify({ data: { session: null }, error: null }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
    return origFetch(url, opts);
  };
});

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/');
await page.waitForFunction(() => document.body.textContent?.includes('Know your'), { timeout: 15000 });
await page.waitForTimeout(1000);

// How it works section
await page.evaluate(() => window.scrollTo(0, 3400));
await page.waitForTimeout(800);
writeFileSync('c:/tmp/howitworks.png', await page.screenshot());
console.log('howitworks done');

// Discovery grid
await page.evaluate(() => window.scrollTo(0, 4300));
await page.waitForTimeout(800);
writeFileSync('c:/tmp/discovery.png', await page.screenshot());

// Footer
await page.evaluate(() => window.scrollTo(0, 99999));
await page.waitForTimeout(800);
writeFileSync('c:/tmp/footer.png', await page.screenshot());

// Mobile hero
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:3000/');
await page.waitForFunction(() => document.body.textContent?.includes('Know your'), { timeout: 15000 });
await page.waitForTimeout(800);
writeFileSync('c:/tmp/after-home-mobile.png', await page.screenshot({ fullPage: false }));

// Mobile scroll to features
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(600);
writeFileSync('c:/tmp/mobile-features.png', await page.screenshot());

console.log('all done');
await browser.close();
