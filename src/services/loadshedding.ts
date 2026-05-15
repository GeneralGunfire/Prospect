export type AlertType = 'transformer_fault' | 'substation_overload' | 'cable_fault' | 'planned_maintenance' | 'unplanned_outage' | 'other';
export type AlertUrgency = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'upcoming' | 'resolved';

export interface PowerAlert {
  id: string;
  province: string;
  municipality?: string;
  area: string;
  title: string;
  description: string;
  type: AlertType;
  urgency: AlertUrgency;
  startDate: string;
  estimatedRestoration?: string;
  status: AlertStatus;
  sourceUrl: string;
}

export interface LoadSheddingData {
  currentStage: number;
  suspended: boolean;
  suspendedSince?: string;
  statusText: string;
  statusNote: string;
  forecast: Array<{ date: string; stage: number }>;
  updatedAt: string;
  source: string;
  scrapedAt: string;
  alerts?: PowerAlert[];
}

export interface StageInfo {
  name: string;
  hours: string;
  colorBg: string;
  colorText: string;
}

const DATA_URL = '/data/loadshedding/latest.json';

let _cache: { data: LoadSheddingData; ts: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

export async function fetchLoadShedding(): Promise<LoadSheddingData> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) return _cache.data;

  try {
    const res = await fetch(`${DATA_URL}?_=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: LoadSheddingData = await res.json();
    _cache = { data, ts: Date.now() };
    return data;
  } catch (err) {
    console.error('Load shedding data fetch failed:', err);
    return {
      currentStage: 0,
      suspended: true,
      suspendedSince: '2024-03-26',
      statusText: 'No Load Shedding',
      statusNote: 'Status data is temporarily unavailable. Load shedding has been suspended since 26 March 2024.',
      forecast: [],
      updatedAt: new Date().toISOString(),
      source: 'loadshedding.eskom.co.za',
      scrapedAt: new Date().toISOString(),
      alerts: [],
    };
  }
}

export function getStageInfo(stage: number): StageInfo {
  if (stage === 0) return { name: 'No Load Shedding', hours: 'No scheduled outages', colorBg: 'bg-green-50', colorText: 'text-green-800' };
  if (stage <= 2)  return { name: `Stage ${stage}`, hours: 'Approximately 1 hour per day', colorBg: 'bg-yellow-50', colorText: 'text-yellow-800' };
  if (stage <= 4)  return { name: `Stage ${stage}`, hours: 'Approximately 2 hours per day', colorBg: 'bg-orange-50', colorText: 'text-orange-800' };
  if (stage <= 6)  return { name: `Stage ${stage}`, hours: `Approximately ${stage <= 5 ? 3 : '3–4'} hours per day`, colorBg: 'bg-red-50', colorText: 'text-red-800' };
  return { name: `Stage ${stage}`, hours: 'Approximately 4+ hours per day', colorBg: 'bg-red-100', colorText: 'text-red-900' };
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  transformer_fault:    'Transformer Fault',
  substation_overload:  'Substation Overload',
  cable_fault:          'Cable Fault',
  planned_maintenance:  'Planned Maintenance',
  unplanned_outage:     'Unplanned Outage',
  other:                'Alert',
};

export const SA_PROVINCES = [
  'All Provinces',
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape',
];
