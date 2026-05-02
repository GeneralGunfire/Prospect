import * as cheerio from 'cheerio';
import type { ScraperResult, ScrapedOutage, ScrapedDam } from '../scraper-config.js';

export async function scrapeCapeown(): Promise<ScraperResult> {
  const outages: ScrapedOutage[] = [];
  const dams: ScrapedDam[] = [];

  try {
    const res = await fetch('https://www.capetown.gov.za/service-and-support/water-supply-outages', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProspectBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    // Cape Town outage table / list items
    $('table tr, .outage-item, .water-outage, li').each((_, el) => {
      const cells = $(el).find('td');
      if (cells.length >= 2) {
        const area = cells.eq(0).text().trim();
        const dateStr = cells.eq(1).text().trim();
        const desc = cells.eq(2)?.text()?.trim() ?? '';
        if (!area || area.length < 3) return;
        const start = parseSADate(dateStr) ?? new Date().toISOString();
        outages.push({
          province: 'Western Cape',
          municipality: 'City of Cape Town',
          area_affected: area.substring(0, 255),
          outage_type: 'scheduled_maintenance',
          outage_start: start,
          severity: 'medium',
          description: desc || `Outage affecting ${area}`,
          source: 'cape_town',
        });
      }
    });

    // Dam levels — Cape Town publishes dam storage on separate page
    // Pattern: "Theewaterskloof: 82.3%"
    $('body').find('*').each((_, el) => {
      const text = $(el).children().length === 0 ? $(el).text() : '';
      const m = text.match(/^([A-Za-z\s]+(?:Dam|Reservoir))[\s:]+(\d+\.?\d*)%/i);
      if (m) {
        dams.push({
          province: 'Western Cape',
          dam_name: m[1].trim(),
          current_capacity_percent: parseFloat(m[2]),
          trend: 'stable',
          source: 'cape_town',
        });
      }
    });
  } catch (err) {
    console.error('[cape_town] scrape failed:', err);
  }

  return { outages, dams };
}

function parseSADate(str: string): string | null {
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString();
  const m = str.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/);
  if (m) {
    const d2 = new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
    if (!isNaN(d2.getTime())) return d2.toISOString();
  }
  return null;
}
