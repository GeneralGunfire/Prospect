export const SCRAPER_CONFIG = {
  rand_water: {
    name: 'Rand Water',
    url: 'https://reports.randwater.co.za',
    province: 'Gauteng',
    timeout: 15000,
  },
  jhb_water: {
    name: 'Johannesburg Water',
    url: 'https://www.jhbwater.co.za/service-disruptions',
    province: 'Gauteng',
    timeout: 15000,
  },
  cape_town: {
    name: 'City of Cape Town',
    url: 'https://www.capetown.gov.za/service-and-support/water-supply-outages',
    province: 'Western Cape',
    timeout: 15000,
  },
  ethekwini: {
    name: 'eThekwini Water',
    url: 'https://www.durban.gov.za/City_Services/Water_and_Sanitation/water-outages',
    province: 'KwaZulu-Natal',
    timeout: 15000,
  },
  nmdm: {
    name: 'Nelson Mandela Bay',
    url: 'https://www.nelsonmandelabay.gov.za/water-service-alerts',
    province: 'Eastern Cape',
    timeout: 15000,
  },
} as const;

export type ScraperSource = keyof typeof SCRAPER_CONFIG;

export interface ScrapedOutage {
  province: string;
  municipality?: string;
  area_affected: string;
  outage_type: string;
  outage_start: string;
  outage_end?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
}

export interface ScrapedDam {
  province: string;
  dam_name: string;
  current_capacity_percent: number;
  trend: 'rising' | 'stable' | 'falling';
  last_week_percent?: number;
  source: string;
}

export interface ScraperResult {
  outages: ScrapedOutage[];
  dams: ScrapedDam[];
}
