import { supabase } from '../lib/supabase';

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

export interface WaterProvinceData {
  alerts: WaterAlert[];
  damLevels: DamLevel[];
  maintenance: MaintenanceSchedule[];
  lastFetched: Date | null;
}

// ── Seed / fallback data ───────────────────────────────────────────────────────

const SEED_ALERTS: WaterAlert[] = [
  {
    id: 'a1', province: 'Gauteng', municipality: 'City of Tshwane',
    title: 'Water Outage — Pretoria East', description: 'Scheduled maintenance on the Roodeplaat pipeline causing supply interruption.',
    urgency: 'high', affectedAreas: ['Moreleta Park', 'Faerie Glen', 'Wapadrand'],
    recommendation: 'Store sufficient water before 06:00. Use stored water sparingly.',
    startDate: new Date('2026-04-19T06:00:00'), endDate: new Date('2026-04-19T22:00:00'),
    status: 'active', sourceUrl: 'https://www.tshwane.gov.za', fetchedAt: new Date(),
  },
  {
    id: 'a2', province: 'Gauteng', municipality: 'City of Johannesburg',
    title: 'Boil Water Advisory — Soweto', description: 'Possible contamination detected in the distribution network. Boil all water before use.',
    urgency: 'critical', affectedAreas: ['Soweto', 'Diepkloof', 'Dobsonville'],
    recommendation: 'Boil all water for at least 1 minute before drinking, cooking, or brushing teeth.',
    startDate: new Date('2026-04-17T00:00:00'),
    status: 'active', sourceUrl: 'https://www.joburg.org.za', fetchedAt: new Date(),
  },
  {
    id: 'a3', province: 'Western Cape', municipality: 'City of Cape Town',
    title: 'Level 2 Water Restrictions', description: 'Ongoing drought conditions require all residents to reduce consumption.',
    urgency: 'medium', affectedAreas: ['All suburbs'],
    recommendation: 'Limit garden watering to twice per week. No filling of pools. Fix leaks immediately.',
    startDate: new Date('2026-03-01T00:00:00'),
    status: 'active', sourceUrl: 'https://www.capetown.gov.za', fetchedAt: new Date(),
  },
  {
    id: 'a4', province: 'KwaZulu-Natal', municipality: 'eThekwini',
    title: 'Low Water Pressure — Durban North', description: 'Pump failure causing reduced pressure in northern zones.',
    urgency: 'low', affectedAreas: ['Durban North', 'Umhlanga', 'La Lucia'],
    recommendation: 'Pressure should normalise within 48 hours. Store water as a precaution.',
    startDate: new Date('2026-04-18T00:00:00'),
    status: 'active', sourceUrl: 'https://www.ethekwini.org.za', fetchedAt: new Date(),
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
    startDate: new Date('2026-04-22T06:00:00'), endDate: new Date('2026-04-25T18:00:00'),
    affectedAreas: ['Johannesburg CBD', 'Newtown', 'Braamfontein'],
    expectedImpact: ['06:00–14:00 daily supply interruption', 'Affects approx. 120,000 residents'],
    sourceUrl: 'https://www.joburg.org.za',
  },
  {
    id: 'm2', province: 'Gauteng', title: 'Pump Station Upgrade — Centurion',
    startDate: new Date('2026-05-05T08:00:00'), endDate: new Date('2026-05-07T17:00:00'),
    affectedAreas: ['Centurion', 'Lyttelton', 'Highveld'],
    expectedImpact: ['Reduced pressure 08:00–17:00', 'No complete outage expected'],
    sourceUrl: 'https://www.tshwane.gov.za',
  },
  {
    id: 'm3', province: 'Western Cape', title: 'Water Main Repair — Bellville',
    startDate: new Date('2026-04-24T07:00:00'), endDate: new Date('2026-04-24T20:00:00'),
    affectedAreas: ['Bellville', 'Parow', 'Goodwood'],
    expectedImpact: ['Full outage 07:00–20:00', 'Tanker water will be provided'],
    sourceUrl: 'https://www.capetown.gov.za',
  },
  {
    id: 'm4', province: 'KwaZulu-Natal', title: 'Reservoir Cleaning — Pietermaritzburg',
    startDate: new Date('2026-05-12T06:00:00'), endDate: new Date('2026-05-13T18:00:00'),
    affectedAreas: ['Pietermaritzburg Central', 'Northdale', 'Raisethorpe'],
    expectedImpact: ['Intermittent supply over 2 days', 'Store water in advance'],
    sourceUrl: 'https://www.msunduzi.gov.za',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function filterByProvince<T extends { province: string }>(items: T[], province: string): T[] {
  return items.filter(i => i.province === province);
}

// ── Service functions ──────────────────────────────────────────────────────────

export async function getWaterDataByProvince(province: string): Promise<WaterProvinceData> {
  try {
    const { data, error } = await supabase
      .from('water_data')
      .select('*')
      .eq('province', province)
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        alerts: filterByProvince(SEED_ALERTS, province),
        damLevels: filterByProvince(SEED_DAMS, province),
        maintenance: filterByProvince(SEED_MAINTENANCE, province),
        lastFetched: null,
      };
    }

    const alerts: WaterAlert[] = data
      .filter(r => r.data_type === 'alert')
      .map(r => ({
        id: r.id,
        province: r.province,
        municipality: r.municipality,
        title: r.title,
        description: r.description,
        urgency: r.urgency as WaterAlert['urgency'],
        affectedAreas: tryParseJSON(r.affected_areas, []),
        recommendation: r.recommendation ?? '',
        startDate: new Date(r.start_date),
        endDate: r.end_date ? new Date(r.end_date) : undefined,
        status: r.status as WaterAlert['status'],
        sourceUrl: r.source_url ?? '',
        fetchedAt: new Date(r.fetched_at),
      }));

    const damLevels: DamLevel[] = data
      .filter(r => r.data_type === 'dam_level')
      .map(r => ({
        id: r.id,
        province: r.province,
        damName: r.dam_name ?? r.title,
        levelPercent: r.dam_level_percent ?? 0,
        trend: (r.dam_level_trend ?? 'stable') as DamLevel['trend'],
        lastUpdated: new Date(r.updated_at),
        sourceUrl: r.source_url,
      }));

    const maintenance: MaintenanceSchedule[] = data
      .filter(r => r.data_type === 'maintenance')
      .map(r => ({
        id: r.id,
        province: r.province,
        title: r.title,
        startDate: new Date(r.start_date),
        endDate: new Date(r.end_date),
        affectedAreas: tryParseJSON(r.affected_areas, []),
        expectedImpact: tryParseJSON(r.description, [r.description]),
        sourceUrl: r.source_url ?? '',
      }));

    const lastFetched = data[0]?.fetched_at ? new Date(data[0].fetched_at) : null;

    // Fall back to seed data per section if Supabase returned nothing for that type
    return {
      alerts: alerts.length > 0 ? alerts : filterByProvince(SEED_ALERTS, province),
      damLevels: damLevels.length > 0 ? damLevels : filterByProvince(SEED_DAMS, province),
      maintenance: maintenance.length > 0 ? maintenance : filterByProvince(SEED_MAINTENANCE, province),
      lastFetched,
    };
  } catch {
    return {
      alerts: filterByProvince(SEED_ALERTS, province),
      damLevels: filterByProvince(SEED_DAMS, province),
      maintenance: filterByProvince(SEED_MAINTENANCE, province),
      lastFetched: null,
    };
  }
}

function tryParseJSON<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value)) return value as unknown as T;
  if (typeof value !== 'string') return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

export function getLastFetchLabel(lastFetched: Date | null): string {
  if (!lastFetched) return 'Using demo data';
  const diffMs = Date.now() - lastFetched.getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffM = Math.floor(diffMs / 60_000);
  if (diffM < 60) return `${diffM} minute${diffM !== 1 ? 's' : ''} ago`;
  if (diffH < 24) return `${diffH} hour${diffH !== 1 ? 's' : ''} ago`;
  return `${Math.floor(diffH / 24)} day${Math.floor(diffH / 24) !== 1 ? 's' : ''} ago`;
}

export const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
];
