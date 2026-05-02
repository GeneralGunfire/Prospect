-- Allow scraper (service role / anon) to insert into scraper_logs and dam_levels
-- Run this in Supabase SQL editor

-- scraper_logs: allow insert from any source
CREATE POLICY "Allow insert scraper_logs" ON scraper_logs FOR INSERT WITH CHECK (true);

-- dam_levels: allow insert (scrapers write new snapshots)
CREATE POLICY "Allow insert dam_levels" ON dam_levels FOR INSERT WITH CHECK (true);

-- water_outages: allow insert (scrapers write outages)
CREATE POLICY "Allow insert water_outages" ON water_outages FOR INSERT WITH CHECK (true);

-- water_restrictions: allow insert
CREATE POLICY "Allow insert water_restrictions" ON water_restrictions FOR INSERT WITH CHECK (true);

-- maintenance_schedules: allow insert
CREATE POLICY "Allow insert maintenance_schedules" ON maintenance_schedules FOR INSERT WITH CHECK (true);

-- water_news: allow insert
CREATE POLICY "Allow insert water_news" ON water_news FOR INSERT WITH CHECK (true);
