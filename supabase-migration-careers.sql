-- Supabase Migration: Create careers table
-- This creates the comprehensive careers database for the Prospect platform

CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  day_in_the_life TEXT NOT NULL,

  -- RIASEC Match (0-100 per type)
  riasec_match JSONB NOT NULL DEFAULT '{
    "realistic": 50,
    "investigative": 50,
    "artistic": 50,
    "social": 50,
    "enterprising": 50,
    "conventional": 50
  }',

  -- Matric Requirements
  matric_requirements JSONB NOT NULL DEFAULT '{
    "requiredSubjects": [],
    "recommendedSubjects": [],
    "minimumAps": 20
  }',

  -- Study Path
  study_path JSONB NOT NULL DEFAULT '{
    "primaryOption": "",
    "secondaryOption": null,
    "timeToQualify": "3-4 years",
    "nqfLevel": 6
  }',

  -- Providers
  providers JSONB NOT NULL DEFAULT '{
    "universities": [],
    "tvetColleges": [],
    "apprenticeshipBodies": []
  }',

  -- Job Demand
  job_demand JSONB NOT NULL DEFAULT '{
    "level": "medium",
    "growthOutlook": "Stable",
    "growthPercentage": 5
  }',

  -- Job Locations
  job_locations JSONB NOT NULL DEFAULT '{
    "provinces": [],
    "hotspots": [],
    "remoteViable": false
  }',

  -- Salary (ZAR monthly)
  salary JSONB NOT NULL DEFAULT '{
    "entryLevel": 20000,
    "midLevel": 40000,
    "senior": 80000,
    "currency": "ZAR"
  }',

  -- Arrays
  top_employers TEXT[] DEFAULT '{}',
  industry_type TEXT,
  relevant_bursaries TEXT[] DEFAULT '{}',
  nsfas_eligible BOOLEAN DEFAULT false,

  -- Career Progression
  career_progression JSONB NOT NULL DEFAULT '{
    "entryRole": "",
    "midRole": "",
    "seniorRole": ""
  }',

  -- Skills and keywords
  skills TEXT[] DEFAULT '{}',
  common_misconceptions TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_careers_category ON public.careers(category);
CREATE INDEX idx_careers_title ON public.careers USING GIN(to_tsvector('english', title));
CREATE INDEX idx_careers_keywords ON public.careers USING GIN(keywords);

-- Row Level Security
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to SELECT all careers
CREATE POLICY "Allow authenticated users to view careers"
  ON public.careers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only service role can insert/update/delete careers (admin only)
CREATE POLICY "Allow only service role to manage careers"
  ON public.careers
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.careers TO authenticated;

-- Example insert (uncomment to add sample data):
-- INSERT INTO public.careers (
--   id, title, category, description, day_in_the_life,
--   riasec_match, matric_requirements, study_path, providers,
--   job_demand, job_locations, salary, top_employers, industry_type,
--   relevant_bursaries, nsfas_eligible, career_progression, skills,
--   common_misconceptions, keywords
-- ) VALUES (
--   'medical-doctor',
--   'Medical Doctor',
--   'university',
--   'Diagnose and treat illnesses and injuries in patients.',
--   'You arrive at the hospital for ward rounds...',
--   '{"realistic": 45, "investigative": 85, "artistic": 20, "social": 80, "enterprising": 55, "conventional": 70}',
--   '{"requiredSubjects": ["Mathematics", "Life Sciences", "Physical Sciences"], "recommendedSubjects": ["English"], "minimumAps": 40}',
--   '{"primaryOption": "MBChB degree - 6 years", "secondaryOption": "Internship + Community Service - 3 years", "timeToQualify": "9 years", "nqfLevel": 8}',
--   '{"universities": ["UCT", "Wits", "UP", "Stellenbosch", "UKZN"]}',
--   '{"level": "high", "growthOutlook": "Growing steadily", "growthPercentage": 8}',
--   '{"provinces": ["Gauteng", "Western Cape", "KwaZulu-Natal"], "hotspots": ["Johannesburg", "Cape Town", "Durban"], "remoteViable": false}',
--   '{"entryLevel": 35000, "midLevel": 65000, "senior": 120000, "currency": "ZAR"}',
--   '["Netcare", "Mediclinic", "Public hospitals"]',
--   'Healthcare',
--   '["Department of Health"]',
--   true,
--   '{"entryRole": "Intern/Community Service Doctor", "midRole": "Medical Officer/Specialist", "seniorRole": "Consultant/Specialist Surgeon"}',
--   '["Diagnosis", "Communication", "Critical thinking", "Empathy"]',
--   '["It''s only for top students", "You work alone", "No work-life balance"]',
--   '["doctor", "physician", "healthcare", "medicine"]'
-- );
