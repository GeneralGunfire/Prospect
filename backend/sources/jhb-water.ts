import * as cheerio from 'cheerio';
import type { ScraperResult, ScrapedOutage } from '../scraper-config.js';

export async function scrapeJhbWater(): Promise<ScraperResult> {
  const outages: ScrapedOutage[] = [];

  try {
    const res = await fetch('https://www.jhbwater.co.za/service-disruptions', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProspectBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    // JHB Water disruption cards/rows
    $('.disruption, .outage, article, .field-item, table tr').each((_, el) => {
      const text = $(el).text().trim();
      if (!text || text.length < 20) return;

      const areaMatch = text.match(/(?:affecting?|area:|suburb[s]?:?)\s*([A-Za-z\s,]+)/i);
      const dateMatch = text.match(/(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4})/);

      const area = areaMatch?.[1]?.trim() ?? $(el).find('h3,h4,.title').first().text().trim();
      if (!area || area.length < 3) return;

      const start = dateMatch ? parseSADate(dateMatch[1]) : new Date().toISOString();
      if (!start) return;

      const desc = text.substring(0, 200);
      const severity = /emergency|burst|critical/i.test(desc) ? 'high' : 'medium';

      outages.push({
        province: 'Gauteng',
        municipality: 'City of Johannesburg',
        area_affected: area.substring(0, 255),
        outage_type: /burst/i.test(desc) ? 'burst_pipe' : 'scheduled_maintenance',
        outage_start: start,
        severity,
        description: desc,
        source: 'jhb_water',
      });
    });
  } catch (err) {
    console.error('[jhb_water] scrape failed:', err);
  }

  return { outages, dams: [] };
}

function parseSADate(str: string): string | null {
  const m = str.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/);
  if (m) {
    const d = new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}
