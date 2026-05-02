import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Outages ────────────────────────────────────────────────────────────────────

export async function insertWaterOutage(outage: {
  province: string;
  municipality?: string;
  area_affected: string;
  outage_type?: string;
  outage_start: string;
  outage_end?: string;
  severity: string;
  description: string;
  source: string;
}) {
  const { data, error } = await supabase
    .from('water_outages')
    .upsert([outage], { onConflict: 'province,municipality,area_affected,outage_start,source' })
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function getOutagesByProvince(province: string) {
  const { data, error } = await supabase
    .from('water_outages')
    .select('*')
    .eq('province', province)
    .or(`outage_end.is.null,outage_end.gte.${new Date().toISOString()}`)
    .order('outage_start', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function deleteExpiredOutages(daysOld = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  const { error } = await supabase
    .from('water_outages')
    .delete()
    .lt('outage_end', cutoff.toISOString());
  if (error) throw error;
}

// ── Dam Levels ─────────────────────────────────────────────────────────────────

export async function upsertDamLevel(dam: {
  province: string;
  dam_name: string;
  current_capacity_percent: number;
  trend: string;
  last_week_percent?: number;
  last_month_percent?: number;
  source: string;
}) {
  const { data, error } = await supabase
    .from('dam_levels')
    .insert([{ ...dam, scraped_at: new Date().toISOString() }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function getDamLevelsByProvince(province: string) {
  // Get latest record per dam
  const { data, error } = await supabase
    .from('dam_levels')
    .select('*')
    .eq('province', province)
    .order('scraped_at', { ascending: false })
    .limit(30);
  if (error) throw error;

  // Deduplicate: keep latest per dam_name
  const seen = new Set<string>();
  return (data ?? []).filter(d => {
    if (seen.has(d.dam_name)) return false;
    seen.add(d.dam_name);
    return true;
  });
}

// ── Restrictions ───────────────────────────────────────────────────────────────

export async function getRestrictionsForProvince(province: string) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('water_restrictions')
    .select('*')
    .eq('province', province)
    .lte('effective_from', now)
    .or(`effective_until.is.null,effective_until.gte.${now}`)
    .order('restriction_level', { ascending: false })
    .limit(5);
  if (error) throw error;
  return data ?? [];
}

// ── Maintenance ────────────────────────────────────────────────────────────────

export async function getMaintenanceForProvince(province: string) {
  const { data, error } = await supabase
    .from('maintenance_schedules')
    .select('*')
    .eq('province', province)
    .gte('scheduled_end', new Date().toISOString())
    .order('scheduled_start', { ascending: true })
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

// ── News ───────────────────────────────────────────────────────────────────────

export async function getWaterNews(province?: string, type?: string) {
  let query = supabase
    .from('water_news')
    .select('*')
    .order('importance_level', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(20);

  if (province && province !== 'All') {
    query = query.contains('affected_provinces', [province]);
  }
  if (type) {
    query = query.eq('news_type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ── Scraper Logs ───────────────────────────────────────────────────────────────

export async function logScraperRun(
  source: string,
  status: 'success' | 'failed' | 'partial',
  recordsFound: number,
  errorMessage?: string
) {
  const { error } = await supabase.from('scraper_logs').insert([{
    source,
    status,
    records_found: recordsFound,
    error_message: errorMessage ?? null,
    run_at: new Date().toISOString(),
  }]);
  if (error) console.error('Failed to log scraper run:', error);
}
