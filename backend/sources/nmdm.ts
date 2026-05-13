import * as cheerio from 'cheerio';
import type { ScraperResult, ScrapedOutage } from '../scraper-config.js';

export async function scrapeNmdm(): Promise<ScraperResult> {
  const outages: ScrapedOutage[] = [];

  try {
    const res = await fetch('https://www.nelsonmandelabay.gov.za/water-service-alerts', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProspectBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    $('table tr, .alert-item, .service-alert, article').each((_, el) => {
      const cells = $(el).find('td');
      if (cells.length >= 2) {
        const area = cells.eq(0).text().trim();
        const dateStr = cells.eq(1).text().trim();
        const desc = cells.eq(2)?.text()?.trim() ?? '';
        if (!area || area.length < 3) return;

        const start = parseSADate(dateStr) ?? new Date().toISOString();
        const severity = /critical|emergency|burst/i.test(desc) ? 'high' : 'medium';

        outages.push({
          province: 'Eastern Cape',
          municipality: 'Nelson Mandela Bay',
          area_affected: area.substring(0, 255),
          outage_type: /burst/i.test(desc) ? 'burst_pipe' : 'scheduled_maintenance',
          outage_start: start,
          severity,
          description: desc || `NMBM outage: ${area}`,
          source: 'nmdm',
        });
      }
    });
  } catch (err) {
    console.error('[nmdm] scrape failed:', err);
  }

  return { outages, dams: [] };
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
