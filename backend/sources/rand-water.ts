import * as cheerio from 'cheerio';
import type { ScraperResult, ScrapedOutage, ScrapedDam } from '../scraper-config.js';

const BASE_URL = 'https://reports.randwater.co.za';

export async function scrapeRandWater(): Promise<ScraperResult> {
  const outages: ScrapedOutage[] = [];
  const dams: ScrapedDam[] = [];

  try {
    const res = await fetch(BASE_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProspectBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    // Rand Water outage rows — adjust selectors after inspecting live site
    $('table tr, .outage-row, .disruption-item').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length < 3) return;
      const area = cells.eq(0).text().trim();
      const startStr = cells.eq(1).text().trim();
      const desc = cells.eq(2).text().trim();
      if (!area || !startStr) return;

      const start = parseSADate(startStr);
      if (!start) return;

      outages.push({
        province: 'Gauteng',
        municipality: 'Rand Water Area',
        area_affected: area,
        outage_type: 'scheduled_maintenance',
        outage_start: start,
        severity: 'medium',
        description: desc || `Water disruption affecting ${area}`,
        source: 'rand_water',
      });
    });

    // Dam levels
    $('.dam-level, .reservoir-status, table.dam-table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length < 2) return;
      const name = cells.eq(0).text().trim();
      const pctText = cells.eq(1).text().replace('%', '').trim();
      const pct = parseFloat(pctText);
      if (!name || isNaN(pct)) return;

      dams.push({
        province: 'Gauteng',
        dam_name: name,
        current_capacity_percent: pct,
        trend: 'stable',
        source: 'rand_water',
      });
    });
  } catch (err) {
    console.error('[rand_water] scrape failed:', err);
  }

  return { outages, dams };
}

function parseSADate(str: string): string | null {
  // Try ISO first
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString();
  // Try DD/MM/YYYY
  const m = str.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/);
  if (m) {
    const d2 = new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
    if (!isNaN(d2.getTime())) return d2.toISOString();
  }
  return null;
}
