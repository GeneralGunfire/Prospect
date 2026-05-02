import { scrapeRandWater } from './sources/rand-water.js';
import { scrapeJhbWater } from './sources/jhb-water.js';
import { scrapeCapeown } from './sources/cape-town.js';
import { scrapeEthekwini } from './sources/ethekwini.js';
import { scrapeNmdm } from './sources/nmdm.js';
import { scrapeDwsDams } from './sources/dws-dams.js';
import {
  insertWaterOutage,
  upsertDamLevel,
  logScraperRun,
  deleteExpiredOutages,
} from '../supabase-water.js';

interface RunResult {
  source: string;
  status: 'success' | 'failed';
  outages: number;
  dams: number;
  error?: string;
}

const SCRAPERS = [
  { name: 'rand_water' as const, fn: scrapeRandWater },
  { name: 'jhb_water' as const, fn: scrapeJhbWater },
  { name: 'cape_town' as const, fn: scrapeCapeown },
  { name: 'ethekwini' as const, fn: scrapeEthekwini },
  { name: 'nmdm' as const, fn: scrapeNmdm },
];

async function runDwsDams() {
  console.log('[dws] Scraping all provincial dam levels...');
  try {
    const { dams } = await scrapeDwsDams();
    let added = 0;
    for (const dam of dams) {
      try {
        await upsertDamLevel(dam);
        added++;
      } catch (e) {
        console.warn(`Dam insert failed for ${dam.dam_name}:`, e);
      }
    }
    console.log(`[dws] ✓ ${added}/${dams.length} dams inserted`);
    return added;
  } catch (err) {
    console.error('[dws] failed:', err instanceof Error ? err.message : err);
    return 0;
  }
}

export async function runAllWaterScrapers(): Promise<RunResult[]> {
  console.log(`[${new Date().toISOString()}] Starting water scrapers...`);

  // Clean up old data first
  try {
    await deleteExpiredOutages(30);
    console.log('Cleaned expired outages');
  } catch (e) {
    console.warn('Cleanup failed (non-fatal):', e);
  }

  const results = await Promise.allSettled(
    SCRAPERS.map(async (scraper) => {
      try {
        const data = await scraper.fn();
        let outagesAdded = 0;
        let damsAdded = 0;

        for (const outage of data.outages) {
          try {
            await insertWaterOutage(outage);
            outagesAdded++;
          } catch (e) {
            // Unique constraint = duplicate, skip silently
          }
        }

        for (const dam of data.dams) {
          try {
            await upsertDamLevel(dam);
            damsAdded++;
          } catch (e) {
            console.warn(`Dam insert failed for ${dam.dam_name}:`, e);
          }
        }

        await logScraperRun(scraper.name, 'success', outagesAdded + damsAdded);
        console.log(`[${scraper.name}] ✓ ${outagesAdded} outages, ${damsAdded} dams`);

        return {
          source: scraper.name,
          status: 'success' as const,
          outages: outagesAdded,
          dams: damsAdded,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await logScraperRun(scraper.name, 'failed', 0, msg);
        console.error(`[${scraper.name}] ✗ ${msg}`);
        return {
          source: scraper.name,
          status: 'failed' as const,
          outages: 0,
          dams: 0,
          error: msg,
        };
      }
    })
  );

  return results.map(r => (r.status === 'fulfilled' ? r.value : {
    source: 'unknown',
    status: 'failed' as const,
    outages: 0,
    dams: 0,
    error: r.reason?.message,
  }));
}

// Entry point when run directly
await runDwsDams();
const results = await runAllWaterScrapers();
const failed = results.filter(r => r.status === 'failed');
console.log(`\nDone. ${results.length - failed.length}/${results.length} scrapers succeeded.`);
if (failed.length === results.length) {
  console.error('All scrapers failed!');
  process.exit(1);
}
