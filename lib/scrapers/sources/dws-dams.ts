import * as cheerio from 'cheerio';
import type { ScrapedDam } from '../scraper-config.js';

const PROVINCE_MAP: Record<string, string> = {
  EC: 'Eastern Cape',
  FS: 'Free State',
  G:  'Gauteng',
  KN: 'KwaZulu-Natal',
  LP: 'Limpopo',
  M:  'Mpumalanga',
  NC: 'Northern Cape',
  NW: 'North West',
  WC: 'Western Cape',
};

// Columns: dam_name, river, photo, indicators, FSC(Mm³), this_week%, last_week%, last_year%
function parseDamRows(html: string, province: string): ScrapedDam[] {
  const $ = cheerio.load(html);
  const dams: ScrapedDam[] = [];

  $('tr').each((_, row) => {
    const cells = $(row).find('td').map((_, td) => $(td).text().trim()).get();
    if (cells.length < 7) return;

    const name = cells[0]?.replace(/#/g, '').trim();
    const thisWeek = parseFloat(cells[5]);
    const lastWeek = parseFloat(cells[6]);

    // Skip header rows, total rows, and dams with no valid percentage
    if (!name || !name.match(/Dam$/i) || isNaN(thisWeek)) return;
    if (name.length > 80) return; // skip garbled header rows
    if (thisWeek > 110) return; // skip overflow dams (above capacity)

    const pct = Math.min(100, thisWeek);
    const trend: 'rising' | 'stable' | 'falling' =
      !isNaN(lastWeek)
        ? thisWeek > lastWeek + 0.5 ? 'rising'
        : thisWeek < lastWeek - 0.5 ? 'falling'
        : 'stable'
      : 'stable';

    dams.push({
      province,
      dam_name: name.replace(/#$/, '').trim(),
      current_capacity_percent: pct,
      trend,
      last_week_percent: isNaN(lastWeek) ? undefined : Math.min(100, lastWeek),
      source: 'dws',
    });
  });

  return dams;
}

export async function scrapeDwsDams(): Promise<{ dams: ScrapedDam[] }> {
  const allDams: ScrapedDam[] = [];

  await Promise.all(
    Object.entries(PROVINCE_MAP).map(async ([code, province]) => {
      try {
        const url = `https://www.dws.gov.za/Hydrology/Weekly/ProvinceWeek.aspx?region=${code}`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProspectBot/1.0)' },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const dams = parseDamRows(html, province);
        allDams.push(...dams);
        console.log(`[dws] ${province}: ${dams.length} dams`);
      } catch (err) {
        console.error(`[dws] ${province} failed:`, err instanceof Error ? err.message : err);
      }
    })
  );

  return { dams: allDams };
}
