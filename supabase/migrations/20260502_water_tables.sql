-- Water Dashboard Tables

CREATE TABLE IF NOT EXISTS water_outages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province VARCHAR(50) NOT NULL,
  municipality VARCHAR(100),
  area_affected VARCHAR(255),
  outage_type VARCHAR(50),
  outage_start TIMESTAMP NOT NULL,
  outage_end TIMESTAMP,
  severity VARCHAR(20),
  description TEXT,
  source VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(province, municipality, area_affected, outage_start, source)
);

CREATE TABLE IF NOT EXISTS dam_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province VARCHAR(50) NOT NULL,
  dam_name VARCHAR(100) NOT NULL,
  current_capacity_percent FLOAT NOT NULL,
  trend VARCHAR(20),
  last_week_percent FLOAT,
  last_month_percent FLOAT,
  critical_level_percent FLOAT DEFAULT 20,
  source VARCHAR(50),
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS water_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province VARCHAR(50) NOT NULL,
  municipality VARCHAR(100),
  restriction_level INT,
  description TEXT,
  effective_from TIMESTAMP NOT NULL,
  effective_until TIMESTAMP,
  details JSONB,
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province VARCHAR(50) NOT NULL,
  area_affected VARCHAR(255),
  maintenance_type VARCHAR(100),
  scheduled_start TIMESTAMP NOT NULL,
  scheduled_end TIMESTAMP NOT NULL,
  expected_impact TEXT,
  alternative_supply VARCHAR(255),
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS water_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  summary TEXT,
  news_type VARCHAR(50),
  source VARCHAR(100),
  published_at TIMESTAMP,
  importance_level INT,
  affected_provinces TEXT[],
  tags JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scraper_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50),
  status VARCHAR(20),
  records_found INT,
  error_message TEXT,
  run_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_water_outages_province ON water_outages(province);
CREATE INDEX IF NOT EXISTS idx_water_outages_start ON water_outages(outage_start DESC);
CREATE INDEX IF NOT EXISTS idx_dam_levels_province ON dam_levels(province);
CREATE INDEX IF NOT EXISTS idx_dam_levels_scraped ON dam_levels(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_restrictions_province ON water_restrictions(province);
CREATE INDEX IF NOT EXISTS idx_maintenance_province ON maintenance_schedules(province);
CREATE INDEX IF NOT EXISTS idx_water_news_type ON water_news(news_type);

-- RLS: allow anon read
ALTER TABLE water_outages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dam_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read water_outages" ON water_outages FOR SELECT USING (true);
CREATE POLICY "Public read dam_levels" ON dam_levels FOR SELECT USING (true);
CREATE POLICY "Public read water_restrictions" ON water_restrictions FOR SELECT USING (true);
CREATE POLICY "Public read maintenance_schedules" ON maintenance_schedules FOR SELECT USING (true);
CREATE POLICY "Public read water_news" ON water_news FOR SELECT USING (true);

-- Seed: historical water news
INSERT INTO water_news (headline, summary, news_type, source, published_at, importance_level, affected_provinces, tags)
VALUES
  ('Cape Town Day Zero Crisis (2018)', 'Cape Town nearly ran out of water after severe drought. Level 6B restrictions imposed — residents limited to 50L/day. Day Zero was averted through conservation and small rains.', 'historical', 'capetown.gov.za', '2018-01-15', 5, ARRAY['Western Cape'], '["drought","emergency","climate","day_zero"]'),
  ('Johannesburg Water Crisis (2023)', 'Johannesburg experienced 40+ consecutive days without water in many areas due to aging infrastructure and pump failures. Estimated 4M+ residents affected with R2.3B economic losses.', 'historical', 'news24.com', '2023-06-01', 4, ARRAY['Gauteng'], '["infrastructure","outage","emergency"]'),
  ('National Water Act Amendment (2022)', 'Department of Water and Sanitation updated the water allocation framework to improve drought resilience and equitable access across all 9 provinces.', 'policy', 'dws.gov.za', '2022-07-01', 3, ARRAY['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'], '["policy","allocation","reform"]'),
  ('Load Shedding Worsens Water Crisis (2023–2024)', 'Rolling blackouts disabled water pumps across multiple provinces, compounding existing water shortages. Municipalities struggled to maintain pressure during Stage 4–6 load shedding.', 'historical', 'news24.com', '2023-09-01', 4, ARRAY['Gauteng','KwaZulu-Natal','Eastern Cape'], '["load_shedding","infrastructure","pump_failure"]'),
  ('Durban Flooding Infrastructure Damage (2022)', 'KZN floods caused widespread damage to water and sanitation infrastructure. Over 40,000 households lost access to clean water for weeks following the April 2022 floods.', 'historical', 'sabc.co.za', '2022-04-12', 4, ARRAY['KwaZulu-Natal'], '["flood","infrastructure","emergency"]'),
  ('Vaal Dam Recovery After Drought (2021)', 'After years of decline, the Vaal Dam recovered to above 80% capacity following above-average summer rainfall, offering relief to Gauteng water supply.', 'historical', 'dws.gov.za', '2021-02-01', 3, ARRAY['Gauteng'], '["dam","recovery","drought"]'),
  ('Eastern Cape Water Crisis Declared (2019)', 'Several municipalities in Eastern Cape declared water emergencies after multiple dams fell below 10% capacity. Tanker water deployed to 500,000+ residents.', 'historical', 'groundup.org.za', '2019-11-01', 4, ARRAY['Eastern Cape'], '["drought","emergency","dam"]'),
  ('National Water Week 2024 Report', 'DWS released annual report showing 47% of South Africans experience irregular water supply. Infrastructure investment gap estimated at R900B over 10 years.', 'research', 'dws.gov.za', '2024-03-22', 3, ARRAY['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'], '["research","infrastructure","investment"]')
ON CONFLICT DO NOTHING;

-- Seed: current restrictions
INSERT INTO water_restrictions (province, municipality, restriction_level, description, effective_from, source)
VALUES
  ('Western Cape', 'City of Cape Town', 2, 'Level 2 water restrictions in effect. Garden watering limited to twice per week before 09:00 or after 18:00. No pool filling or car washing with hosepipe.', '2026-03-01', 'capetown.gov.za'),
  ('Eastern Cape', 'Nelson Mandela Bay', 3, 'Level 3 restrictions. All outdoor watering banned. Businesses must reduce consumption by 30%. Fines apply for violations.', '2026-02-01', 'nelsonmandelabay.gov.za'),
  ('Gauteng', 'City of Tshwane', 1, 'Level 1 restrictions. Voluntary 10% reduction requested. Avoid watering during peak hours.', '2026-04-01', 'tshwane.gov.za')
ON CONFLICT DO NOTHING;
