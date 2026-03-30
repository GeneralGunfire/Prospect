# Prospect Careers System — Build & Integration Guide

## Overview
This guide explains the comprehensive careers system built for Prospect, including:
- **28 initial careers** with complete data (university, TVET, and trade categories)
- **Career detail modal** with 12 information sections
- **Advanced filtering** by category, RIASEC personality types, demand level, and salary
- **Supabase integration** for scalable data storage
- **Responsive design** matching existing Prospect pages

## Files Created

### Data & Types
- **`src/data/careersTypes.ts`** — TypeScript interface for CareerFull objects
- **`src/data/careersFullData.ts`** — 28 initial career records with complete information

### Services
- **`src/lib/careersService.ts`** — Supabase queries, search, filtering, caching, similarity matching

### Components
- **`src/components/CareerDetailModal.tsx`** — Full-featured modal showing all career details (12 sections)

### Pages
- **`src/pages/CareersPageNew.tsx`** — Enhanced careers listing with search, filters, and modal integration

### Database
- **`supabase-migration-careers.sql`** — Supabase table creation script and RLS policies

---

## Quick Start

### Step 1: Create the Supabase Table
1. Go to your Supabase project dashboard
2. Open the SQL editor
3. Copy-paste the contents of `supabase-migration-careers.sql`
4. Execute the SQL

This creates:
- `public.careers` table with full schema
- RLS policies (authenticated users can SELECT, only service role can INSERT/UPDATE)
- Indexes on category, title, and keywords for performance

### Step 2: Bulk Insert Career Data
After the table exists, you can populate it with career data:

```typescript
// In src/lib/careersService.ts, add this function:
export async function bulkInsertCareers(careers: CareerFull[]): Promise<void> {
  const { error } = await supabase
    .from('careers')
    .insert(careers.map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      description: c.description,
      day_in_the_life: c.dayInTheLife,
      riasec_match: c.riasecMatch,
      matric_requirements: c.matricRequirements,
      study_path: c.studyPath,
      providers: c.providers,
      job_demand: c.jobDemand,
      job_locations: c.jobLocations,
      salary: c.salary,
      top_employers: c.topEmployers,
      industry_type: c.industryType,
      relevant_bursaries: c.relevantBursaries,
      nsfas_eligible: c.nsfasEligible,
      career_progression: c.careerProgression,
      skills: c.skills,
      common_misconceptions: c.commonMisconceptions,
      keywords: c.keywords,
    })));

  if (error) {
    console.error('Error bulk inserting careers:', error);
    throw error;
  }
}
```

Then run it once:
```typescript
import { allCareersFullData } from '../data/careersFullData';
import { bulkInsertCareers } from '../lib/careersService';

// In a setup page or useEffect:
await bulkInsertCareers(allCareersFullData);
```

### Step 3: Replace CareersPage in App.tsx
Replace the old CareersPage with CareersPageNew:

```typescript
// src/App.tsx
import CareersPageNew from './pages/CareersPageNew';

// In the page rendering logic:
{page === 'careers' && <CareersPageNew user={user} onNavigate={navigate} />}

// Remove the old import:
// import CareersPage from './pages/CareersPage';
```

### Step 4: (Optional) Enhance Modal Navigation
The modal includes CTAs to navigate to Study Library and Bursaries pages. To wire these up, update `CareersPageNew.tsx`:

```typescript
const handleModalNavigate = (page: string, filter?: any) => {
  setShowDetailModal(false);
  // Route to the target page with filters
  // You may need to add filter support to other pages
  onNavigate(page as any, filter);
};
```

---

## What You Get

### Career Detail Modal (12 Sections)

1. **Header** — Career title, category badge, demand badge, save button
2. **Quick Overview** — Description + "day in the life"
3. **RIASEC Match** — Visual 6-code breakdown with top 3 highlighted
4. **Education & Study Path** — Matric requirements, study options, NQF level, where to study
5. **Job Market** — Demand level, growth outlook, top locations, employers
6. **Salary Progression** — Entry / Mid / Senior salary visualization
7. **Career Progression** — Entry → Mid → Senior role progression
8. **Required Skills** — Skill badges (problem-solving, communication, etc.)
9. **Common Misconceptions** — Myths about the career + why they're wrong
10. **Bursaries & Funding** — Relevant bursary links, NSFAS eligibility
11. **CTAs (Call-to-Action)** — "Start Studying", "Find Bursaries" buttons
12. **Similar Careers** — 3-5 related careers with RIASEC similarity matching

### Search & Filtering
- **Search bar** — By career title, description, or keywords
- **Category filter** — University, TVET, Trade, Digital, Creative, Business
- **RIASEC filter** — 6 personality type buttons (R, I, A, S, E, C)
- **Live filtering** — Results update instantly as you filter
- **Filter count badge** — Shows number of active filters

### Design Features
- Matches existing Prospect pages 100% (colors, typography, spacing)
- Responsive design (desktop modal, mobile full-page)
- AppHeader integration with logout
- Loading states and error handling
- Smooth animations (motion/react)
- Saved careers to localStorage

---

## Data Structure

### Career Object
```typescript
{
  id: string;                           // kebab-case unique ID
  title: string;                        // Career name
  category: 'university' | 'tvet' | 'trade' | 'digital' | 'creative' | 'business';
  description: string;                  // 2-3 sentences
  dayInTheLife: string;                // Typical day description
  riasecMatch: {
    realistic: number;                  // 0-100 for each type
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  matricRequirements: {
    requiredSubjects: string[];        // e.g., ["Mathematics", "Physical Sciences"]
    recommendedSubjects: string[];
    minimumAps: number;                // e.g., 24
  };
  studyPath: {
    primaryOption: string;              // e.g., "University - 4 years"
    secondaryOption?: string;           // e.g., "TVET - 3 years"
    timeToQualify: string;
    nqfLevel: number;                  // 5-10
  };
  providers: {
    universities?: string[];
    tvetColleges?: string[];
    apprenticeshipBodies?: string[];
  };
  jobDemand: {
    level: 'high' | 'medium' | 'low';
    growthOutlook: string;             // e.g., "Growing rapidly"
    growthPercentage: number;          // e.g., 12
  };
  jobLocations: {
    provinces: string[];
    hotspots: string[];               // Top 5-10 cities
    remoteViable: boolean;
  };
  salary: {
    entryLevel: number;                // Monthly ZAR
    midLevel: number;
    senior: number;
    currency: 'ZAR';
  };
  topEmployers: string[];
  industryType: string;
  relevantBursaries: string[];         // Bursary IDs
  nsfasEligible: boolean;
  careerProgression: {
    entryRole: string;
    midRole: string;
    seniorRole: string;
  };
  skills: string[];
  commonMisconceptions: string[];
  keywords: string[];                  // For search: ["doctor", "medicine", "healthcare"]
}
```

---

## Adding More Careers

To expand beyond the initial 28 careers to 80-400+:

### Option 1: Add to careersFullData.ts
1. Open `src/data/careersFullData.ts`
2. Add new career objects to the array following the schema
3. Include all required fields
4. Use realistic SA context (universities, TVET colleges, salaries, employers)

### Option 2: Bulk Upload from CSV
1. Create a CSV with career data
2. Write a script to parse CSV → CareerFull[] objects
3. Call `bulkInsertCareers()` to load into Supabase

### Option 3: Import from External Source
1. Download career data from labour statistics (Stats SA, SETA reports)
2. Transform to CareerFull format
3. Insert into Supabase

---

## Performance Considerations

### Caching
The system includes localStorage caching:
- **First load**: Fetches all careers from Supabase
- **Subsequent loads**: Uses 24-hour cache
- **Benefit**: Reduces Supabase queries and improves page load speed

```typescript
// Auto-enabled in careersService.ts
const cached = getCareersCache();
if (cached) return cached;  // Use cache

const fresh = await fetchAllCareers();
saveCareersCache(fresh);    // Update cache
```

### Indexing
SQL migration creates indexes on:
- `category` — Filter by career type
- `title` (full-text) — Search by name
- `keywords` (array GIN) — Search by tags

This ensures filtering remains fast even with 400+ careers.

### Pagination (Future)
To add pagination:
```typescript
const itemsPerPage = 20;
const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);
const paginatedCareers = filteredCareers.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
```

---

## Design Consistency

This implementation uses:

| Element | Style |
|---------|-------|
| **Colors** | Primary: #1e293b (navy), Accent: #1B5E20 (green), Gold: #F9A825 |
| **Typography** | Same fonts as BursariesPage, uppercase tracking, Tailwind sizes |
| **Spacing** | Matches existing pages (pt-24, px-4, gap-6, etc.) |
| **Cards** | Same shadow, border-radius, hover effects |
| **Buttons** | Navy background, gold accents, rounded-xl |
| **Mobile** | Hamburger menu, responsive grid, full-page modal on small screens |
| **Animations** | Framer Motion (motion/react), fade + slide on open |

---

## Future Enhancements

### v2: Career Comparison
- Select 2-3 careers side-by-side
- Compare salary, demand, study path, locations
- Export comparison as PDF

### v3: AI Matching
- Integrate user's quiz RIASEC scores
- Highlight best-match careers at top
- Suggest careers based on scores

### v4: Job Listings
- Pull live job postings from job boards
- Show available jobs for each career
- Link to apply

### v5: Salary Trends
- Track salary data over time
- Show salary growth curves
- Regional salary variations

---

## Troubleshooting

### Modal not opening?
- Check `showDetailModal` state is toggling
- Verify `CareerDetailModal` import in CareersPageNew
- Check console for errors

### Filters not working?
- Verify `selectedCategory` and `selectedRIASEC` states update
- Check `filteredCareers` useMemo logic
- Ensure career data includes all required fields

### Supabase errors?
- Verify table was created: `SELECT * FROM careers LIMIT 1;`
- Check RLS policies: Authenticated users can SELECT
- Verify env vars are set: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Styling mismatches?
- Use same Tailwind classes as BursariesPage
- Check color hex codes match (navy: #1e293b, green: #1B5E20, gold: #F9A825)
- Verify AppHeader is imported from existing component

---

## File Checklist

Before deploying:

- [ ] `src/data/careersTypes.ts` — Types defined
- [ ] `src/data/careersFullData.ts` — Initial 28+ careers
- [ ] `src/lib/careersService.ts` — Supabase functions
- [ ] `src/components/CareerDetailModal.tsx` — Modal UI
- [ ] `src/pages/CareersPageNew.tsx` — Listing page with modal
- [ ] `supabase-migration-careers.sql` — DB table created
- [ ] App.tsx updated to use CareersPageNew
- [ ] Career data inserted into Supabase (manually or via bulk script)
- [ ] Environment variables set in `.env.local`
- [ ] No console errors on `/careers` page
- [ ] Modal opens/closes smoothly
- [ ] Filters work on desktop and mobile
- [ ] Save career button toggles

---

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the code comments in component files
3. Verify Supabase table structure and RLS policies
4. Test on both desktop and mobile browsers

Happy building! 🚀
