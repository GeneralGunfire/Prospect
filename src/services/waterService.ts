import { supabase } from '../lib/supabase';

// ── Static JSON (written by GitHub Actions scraper) ───────────────────────────

const WATER_DATA_URL = '/data/water/latest.json';
let _jsonCache: { data: any; ts: number } | null = null;
const JSON_CACHE_TTL = 15 * 60 * 1000; // 15 min

async function fetchWaterJson(): Promise<any | null> {
  if (_jsonCache && Date.now() - _jsonCache.ts < JSON_CACHE_TTL) return _jsonCache.data;
  try {
    const res = await fetch(`${WATER_DATA_URL}?_=${Date.now()}`);
    if (!res.ok) return null;
    const data = await res.json();
    _jsonCache = { data, ts: Date.now() };
    return data;
  } catch {
    return null;
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface WaterAlert {
  id: string;
  province: string;
  municipality?: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas: string[];
  recommendation: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'resolved';
  sourceUrl: string;
  fetchedAt: Date;
}

export interface DamLevel {
  id: string;
  province: string;
  damName: string;
  levelPercent: number;
  trend: 'rising' | 'stable' | 'falling';
  lastUpdated: Date;
  sourceUrl?: string;
}

export interface MaintenanceSchedule {
  id: string;
  province: string;
  title: string;
  startDate: Date;
  endDate: Date;
  affectedAreas: string[];
  expectedImpact: string[];
  sourceUrl: string;
}

export interface WaterRestriction {
  id: string;
  province: string;
  municipality?: string;
  restriction_level: number;
  description: string;
  effective_from: Date;
  effective_until?: Date;
  source?: string;
}

export interface WaterNewsItem {
  id: string;
  headline: string;
  summary?: string;
  news_type: 'historical' | 'policy' | 'research' | 'breaking_alert';
  source?: string;
  published_at?: Date;
  importance_level?: number;
  affected_provinces?: string[];
  tags?: string[];
}

export interface WaterProvinceData {
  alerts: WaterAlert[];
  damLevels: DamLevel[];
  maintenance: MaintenanceSchedule[];
  restrictions: WaterRestriction[];
  lastFetched: Date | null;
  source: 'live' | 'seed';
}

// ── Seed / fallback data ───────────────────────────────────────────────────────

const SEED_ALERTS: WaterAlert[] = [
  {
    id: 'a1', province: 'Gauteng', municipality: 'City of Tshwane',
    title: 'Water Outage — Pretoria East',
    description: 'Scheduled maintenance on the Roodeplaat pipeline causing supply interruption.',
    urgency: 'high', affectedAreas: ['Moreleta Park', 'Faerie Glen', 'Wapadrand'],
    recommendation: 'Store sufficient water before 06:00. Use stored water sparingly.',
    startDate: new Date('2026-04-19T06:00:00'), endDate: new Date('2026-04-19T22:00:00'),
    status: 'active', sourceUrl: 'https://www.tshwane.gov.za', fetchedAt: new Date(),
  },
  {
    id: 'a2', province: 'Gauteng', municipality: 'City of Johannesburg',
    title: 'Boil Water Advisory — Soweto',
    description: 'Possible contamination detected in the distribution network. Boil all water before use.',
    urgency: 'critical', affectedAreas: ['Soweto', 'Diepkloof', 'Dobsonville'],
    recommendation: 'Boil all water for at least 1 minute before drinking, cooking, or brushing teeth.',
    startDate: new Date('2026-04-17T00:00:00'),
    status: 'active', sourceUrl: 'https://www.joburg.org.za', fetchedAt: new Date(),
  },
  {
    id: 'a3', province: 'Western Cape', municipality: 'City of Cape Town',
    title: 'Level 2 Water Restrictions',
    description: 'Ongoing drought conditions require all residents to reduce consumption.',
    urgency: 'medium', affectedAreas: ['All suburbs'],
    recommendation: 'Limit garden watering to twice per week. No filling of pools. Fix leaks immediately.',
    startDate: new Date('2026-03-01T00:00:00'),
    status: 'active', sourceUrl: 'https://www.capetown.gov.za', fetchedAt: new Date(),
  },
  {
    id: 'a4', province: 'KwaZulu-Natal', municipality: 'eThekwini',
    title: 'Low Water Pressure — Durban North',
    description: 'Pump failure causing reduced pressure in northern zones.',
    urgency: 'low', affectedAreas: ['Durban North', 'Umhlanga', 'La Lucia'],
    recommendation: 'Pressure should normalise within 48 hours. Store water as a precaution.',
    startDate: new Date('2026-04-18T00:00:00'),
    status: 'active', sourceUrl: 'https://www.ethekwini.org.za', fetchedAt: new Date(),
  },
  {
    id: 'a5', province: 'Eastern Cape', municipality: 'Nelson Mandela Bay',
    title: 'Level 3 Restrictions — Nelson Mandela Bay',
    description: 'Severe restrictions in place due to low dam levels. All outdoor watering banned.',
    urgency: 'high', affectedAreas: ['Gqeberha', 'Port Elizabeth Central', 'Uitenhage'],
    recommendation: 'Reduce water consumption by 30%. Report leaks immediately to 0800 20 5050.',
    startDate: new Date('2026-02-01T00:00:00'),
    status: 'active', sourceUrl: 'https://www.nelsonmandelabay.gov.za', fetchedAt: new Date(),
  },
];

const SEED_DAMS: DamLevel[] = [
  { id: 'd1', province: 'Gauteng', damName: 'Vaal Dam', levelPercent: 68.4, trend: 'stable', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd2', province: 'Gauteng', damName: 'Sterkfontein Dam', levelPercent: 44.1, trend: 'falling', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd3', province: 'Gauteng', damName: 'Hartebeespoort Dam', levelPercent: 91.7, trend: 'rising', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd4', province: 'Western Cape', damName: 'Theewaterskloof Dam', levelPercent: 82.3, trend: 'rising', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd5', province: 'Western Cape', damName: 'Voëlvlei Dam', levelPercent: 74.6, trend: 'stable', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd6', province: 'Western Cape', damName: 'Berg River Dam', levelPercent: 59.2, trend: 'falling', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd7', province: 'KwaZulu-Natal', damName: 'Pongolapoort Dam', levelPercent: 95.1, trend: 'rising', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd8', province: 'KwaZulu-Natal', damName: 'Midmar Dam', levelPercent: 62.8, trend: 'stable', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd9', province: 'Eastern Cape', damName: 'Katse Dam', levelPercent: 37.5, trend: 'falling', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd10', province: 'Eastern Cape', damName: 'Wriggleswade Dam', levelPercent: 18.2, trend: 'falling', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd11', province: 'Limpopo', damName: 'Tzaneen Dam', levelPercent: 77.3, trend: 'stable', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd12', province: 'Mpumalanga', damName: 'Witbank Dam', levelPercent: 55.9, trend: 'stable', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd13', province: 'Free State', damName: 'Gariep Dam', levelPercent: 83.6, trend: 'rising', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd14', province: 'Northern Cape', damName: 'Vanderkloof Dam', levelPercent: 48.4, trend: 'stable', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
  { id: 'd15', province: 'North West', damName: 'Klerksdorp Dam', levelPercent: 61.1, trend: 'rising', lastUpdated: new Date(), sourceUrl: 'https://www.dws.gov.za' },
];

const SEED_MAINTENANCE: MaintenanceSchedule[] = [
  {
    id: 'm1', province: 'Gauteng', title: 'Pipeline Replacement — Johannesburg CBD',
    startDate: new Date('2026-05-22T06:00:00'), endDate: new Date('2026-05-25T18:00:00'),
    affectedAreas: ['Johannesburg CBD', 'Newtown', 'Braamfontein'],
    expectedImpact: ['06:00–14:00 daily supply interruption', 'Affects approx. 120,000 residents'],
    sourceUrl: 'https://www.joburg.org.za',
  },
  {
    id: 'm2', province: 'Gauteng', title: 'Pump Station Upgrade — Centurion',
    startDate: new Date('2026-06-05T08:00:00'), endDate: new Date('2026-06-07T17:00:00'),
    affectedAreas: ['Centurion', 'Lyttelton', 'Highveld'],
    expectedImpact: ['Reduced pressure 08:00–17:00', 'No complete outage expected'],
    sourceUrl: 'https://www.tshwane.gov.za',
  },
  {
    id: 'm3', province: 'Western Cape', title: 'Water Main Repair — Bellville',
    startDate: new Date('2026-05-24T07:00:00'), endDate: new Date('2026-05-24T20:00:00'),
    affectedAreas: ['Bellville', 'Parow', 'Goodwood'],
    expectedImpact: ['Full outage 07:00–20:00', 'Tanker water will be provided'],
    sourceUrl: 'https://www.capetown.gov.za',
  },
  {
    id: 'm4', province: 'KwaZulu-Natal', title: 'Reservoir Cleaning — Pietermaritzburg',
    startDate: new Date('2026-06-12T06:00:00'), endDate: new Date('2026-06-13T18:00:00'),
    affectedAreas: ['Pietermaritzburg Central', 'Northdale', 'Raisethorpe'],
    expectedImpact: ['Intermittent supply over 2 days', 'Store water in advance'],
    sourceUrl: 'https://www.msunduzi.gov.za',
  },
];

const SEED_RESTRICTIONS: WaterRestriction[] = [
  { id: 'r1', province: 'Western Cape', municipality: 'City of Cape Town', restriction_level: 2, description: 'Level 2 restrictions. Garden watering limited to twice per week before 09:00 or after 18:00.', effective_from: new Date('2026-03-01'), source: 'capetown.gov.za' },
  { id: 'r2', province: 'Eastern Cape', municipality: 'Nelson Mandela Bay', restriction_level: 3, description: 'Level 3 restrictions. All outdoor watering banned. 30% reduction required.', effective_from: new Date('2026-02-01'), source: 'nelsonmandelabay.gov.za' },
  { id: 'r3', province: 'Gauteng', municipality: 'City of Tshwane', restriction_level: 1, description: 'Level 1 voluntary restrictions. Avoid watering during peak hours (10:00–16:00).', effective_from: new Date('2026-04-01'), source: 'tshwane.gov.za' },
];

// ── Supabase live fetch ────────────────────────────────────────────────────────

async function fetchLiveOutages(province: string): Promise<WaterAlert[] | null> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('water_outages')
      .select('*')
      .eq('province', province)
      .or(`outage_end.is.null,outage_end.gte.${now}`)
      .order('outage_start', { ascending: false })
      .limit(20);
    if (error || !data?.length) return null;

    return data.map(r => ({
      id: r.id,
      province: r.province,
      municipality: r.municipality,
      title: r.area_affected ? `Outage — ${r.area_affected}` : 'Water Outage',
      description: r.description ?? '',
      urgency: (r.severity ?? 'medium') as WaterAlert['urgency'],
      affectedAreas: r.area_affected ? [r.area_affected] : [],
      recommendation: 'Store water in advance. Follow official guidance.',
      startDate: new Date(r.outage_start),
      endDate: r.outage_end ? new Date(r.outage_end) : undefined,
      status: 'active' as const,
      sourceUrl: '',
      fetchedAt: new Date(r.scraped_at ?? r.created_at),
    }));
  } catch {
    return null;
  }
}

async function fetchLiveDams(province: string): Promise<DamLevel[] | null> {
  try {
    const { data, error } = await supabase
      .from('dam_levels')
      .select('*')
      .eq('province', province)
      .order('scraped_at', { ascending: false })
      .limit(30);
    if (error || !data?.length) return null;

    const seen = new Set<string>();
    return data
      .filter(d => { if (seen.has(d.dam_name)) return false; seen.add(d.dam_name); return true; })
      .map(d => ({
        id: d.id,
        province: d.province,
        damName: d.dam_name,
        levelPercent: d.current_capacity_percent,
        trend: (d.trend ?? 'stable') as DamLevel['trend'],
        lastUpdated: new Date(d.scraped_at ?? d.created_at),
        sourceUrl: 'https://www.dws.gov.za',
      }));
  } catch {
    return null;
  }
}

async function fetchLiveRestrictions(province: string): Promise<WaterRestriction[] | null> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('water_restrictions')
      .select('*')
      .eq('province', province)
      .lte('effective_from', now)
      .or(`effective_until.is.null,effective_until.gte.${now}`)
      .order('restriction_level', { ascending: false })
      .limit(5);
    if (error || !data?.length) return null;

    return data.map(r => ({
      id: r.id,
      province: r.province,
      municipality: r.municipality,
      restriction_level: r.restriction_level ?? 0,
      description: r.description ?? '',
      effective_from: new Date(r.effective_from),
      effective_until: r.effective_until ? new Date(r.effective_until) : undefined,
      source: r.source,
    }));
  } catch {
    return null;
  }
}

async function fetchLiveMaintenance(province: string): Promise<MaintenanceSchedule[] | null> {
  try {
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .select('*')
      .eq('province', province)
      .gte('scheduled_end', new Date().toISOString())
      .order('scheduled_start', { ascending: true })
      .limit(10);
    if (error || !data?.length) return null;

    return data.map(d => ({
      id: d.id,
      province: d.province,
      title: d.maintenance_type ?? `Maintenance — ${d.area_affected}`,
      startDate: new Date(d.scheduled_start),
      endDate: new Date(d.scheduled_end),
      affectedAreas: d.area_affected ? [d.area_affected] : [],
      expectedImpact: d.expected_impact ? [d.expected_impact] : [],
      sourceUrl: '',
    }));
  } catch {
    return null;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function getWaterDataByProvince(province: string): Promise<WaterProvinceData> {
  // 1. Try static JSON file (written by GitHub Actions scraper)
  const json = await fetchWaterJson();
  if (json) {
    const filterProvince = (arr: any[]) => arr.filter((x: any) => x.province === province);
    return {
      alerts: filterProvince(json.alerts ?? []).map((a: any) => ({
        ...a,
        startDate: new Date(a.startDate),
        endDate: a.endDate ? new Date(a.endDate) : undefined,
        fetchedAt: new Date(a.fetchedAt ?? json.fetched_at),
      })),
      damLevels: filterProvince(json.dams ?? []).map((d: any) => ({
        ...d,
        lastUpdated: new Date(d.lastUpdated ?? json.fetched_at),
      })),
      restrictions: filterProvince(json.restrictions ?? []).map((r: any) => ({
        ...r,
        effective_from: new Date(r.effective_from),
        effective_until: r.effective_until ? new Date(r.effective_until) : undefined,
      })),
      maintenance: filterProvince(json.maintenance ?? []).map((m: any) => ({
        ...m,
        startDate: new Date(m.startDate),
        endDate: new Date(m.endDate),
      })),
      lastFetched: new Date(json.fetched_at),
      source: 'live',
    };
  }

  // 2. Fall back to Supabase
  const [liveOutages, liveDams, liveRestrictions, liveMaintenance] = await Promise.all([
    fetchLiveOutages(province),
    fetchLiveDams(province),
    fetchLiveRestrictions(province),
    fetchLiveMaintenance(province),
  ]);

  const hasLiveData = liveOutages || liveDams;

  return {
    alerts: liveOutages ?? SEED_ALERTS.filter(a => a.province === province),
    damLevels: liveDams ?? SEED_DAMS.filter(d => d.province === province),
    restrictions: liveRestrictions ?? SEED_RESTRICTIONS.filter(r => r.province === province),
    maintenance: liveMaintenance ?? SEED_MAINTENANCE.filter(m => m.province === province),
    lastFetched: hasLiveData ? new Date() : null,
    source: hasLiveData ? 'live' : 'seed',
  };
}

export async function getWaterNews(province?: string, type?: string): Promise<WaterNewsItem[]> {
  try {
    let query = supabase
      .from('water_news')
      .select('*')
      .order('importance_level', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(30);

    if (province && province !== 'All Provinces') {
      query = query.contains('affected_provinces', [province]);
    }
    if (type && type !== 'all') {
      query = query.eq('news_type', type);
    }

    const { data, error } = await query;
    if (error || !data?.length) return SEED_NEWS;

    return data.map(n => ({
      id: n.id,
      headline: n.headline,
      summary: n.summary,
      news_type: n.news_type as WaterNewsItem['news_type'],
      source: n.source,
      published_at: n.published_at ? new Date(n.published_at) : undefined,
      importance_level: n.importance_level,
      affected_provinces: n.affected_provinces ?? [],
      tags: Array.isArray(n.tags) ? n.tags : (n.tags ? JSON.parse(n.tags) : []),
    }));
  } catch {
    return SEED_NEWS;
  }
}

// ── Seed news (fallback) ───────────────────────────────────────────────────────

export const SEED_NEWS: WaterNewsItem[] = [
  {
    id: 'n1',
    headline: 'Cape Town Day Zero Crisis (2018)',
    summary: 'Cape Town nearly ran out of water after severe drought. Level 6B restrictions limited residents to 50L/day. Day Zero was averted through conservation and rainfall.',
    news_type: 'historical',
    source: 'City of Cape Town',
    published_at: new Date('2018-01-15'),
    importance_level: 5,
    affected_provinces: ['Western Cape'],
    tags: ['drought', 'emergency', 'climate', 'day_zero'],
  },
  {
    id: 'n2',
    headline: 'Johannesburg Water Crisis (2023)',
    summary: 'Johannesburg experienced 40+ consecutive days without water in many areas due to aging infrastructure and pump failures. Over 4M residents affected with R2.3B in economic losses.',
    news_type: 'historical',
    source: 'News24',
    published_at: new Date('2023-06-01'),
    importance_level: 4,
    affected_provinces: ['Gauteng'],
    tags: ['infrastructure', 'outage', 'emergency'],
  },
  {
    id: 'n3',
    headline: 'National Water Act Amendment (2022)',
    summary: 'Department of Water and Sanitation updated the water allocation framework to improve drought resilience and equitable access across all 9 provinces.',
    news_type: 'policy',
    source: 'DWS',
    published_at: new Date('2022-07-01'),
    importance_level: 3,
    affected_provinces: ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'],
    tags: ['policy', 'allocation', 'reform'],
  },
  {
    id: 'n4',
    headline: 'Load Shedding Compounds Water Crisis (2023–2024)',
    summary: 'Rolling blackouts disabled water pumps across multiple provinces, compounding existing water shortages. Municipalities struggled to maintain pressure during Stage 4–6 load shedding.',
    news_type: 'historical',
    source: 'News24',
    published_at: new Date('2023-09-01'),
    importance_level: 4,
    affected_provinces: ['Gauteng', 'KwaZulu-Natal', 'Eastern Cape'],
    tags: ['load_shedding', 'infrastructure', 'pump_failure'],
  },
  {
    id: 'n5',
    headline: 'Durban Flooding Damages Water Infrastructure (2022)',
    summary: 'KZN floods caused widespread damage to water and sanitation infrastructure. Over 40,000 households lost access to clean water for weeks after the April 2022 floods.',
    news_type: 'historical',
    source: 'SABC News',
    published_at: new Date('2022-04-12'),
    importance_level: 4,
    affected_provinces: ['KwaZulu-Natal'],
    tags: ['flood', 'infrastructure', 'emergency'],
  },
  {
    id: 'n6',
    headline: 'Eastern Cape Water Emergency Declared (2019)',
    summary: 'Several municipalities in Eastern Cape declared water emergencies after multiple dams fell below 10% capacity. Tanker water deployed to 500,000+ residents.',
    news_type: 'historical',
    source: 'GroundUp',
    published_at: new Date('2019-11-01'),
    importance_level: 4,
    affected_provinces: ['Eastern Cape'],
    tags: ['drought', 'emergency', 'dam'],
  },
  {
    id: 'n7',
    headline: 'DWS National Water Week Report 2024',
    summary: 'Annual report shows 47% of South Africans experience irregular water supply. Infrastructure investment gap estimated at R900B over 10 years.',
    news_type: 'research',
    source: 'DWS',
    published_at: new Date('2024-03-22'),
    importance_level: 3,
    affected_provinces: ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'],
    tags: ['research', 'infrastructure', 'investment'],
  },
  {
    id: 'n8',
    headline: 'Vaal Dam Recovery After Drought (2021)',
    summary: 'After years of decline, the Vaal Dam recovered to above 80% capacity following above-average summer rainfall, providing relief to Gauteng water supply.',
    news_type: 'historical',
    source: 'DWS',
    published_at: new Date('2021-02-01'),
    importance_level: 3,
    affected_provinces: ['Gauteng'],
    tags: ['dam', 'recovery', 'drought'],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getLastFetchLabel(lastFetched: Date | null): string {
  if (!lastFetched) return 'Using demo data';
  const diffMs = Date.now() - lastFetched.getTime();
  const diffM = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffM < 60) return `${diffM} minute${diffM !== 1 ? 's' : ''} ago`;
  if (diffH < 24) return `${diffH} hour${diffH !== 1 ? 's' : ''} ago`;
  return `${Math.floor(diffH / 24)} day${Math.floor(diffH / 24) !== 1 ? 's' : ''} ago`;
}

export const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
];
