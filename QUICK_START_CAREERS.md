# Careers System — Quick Start (5 Steps)

## What You Have
✅ 28 complete career records
✅ Career detail modal (12 sections)
✅ Search & filter page
✅ Supabase database setup script
✅ Full TypeScript types

---

## Step 1: Update App.tsx (2 minutes)

**File**: `src/App.tsx`

**Find this line**:
```typescript
import CareersPage from './pages/CareersPage';
```

**Replace with**:
```typescript
import CareersPageNew from './pages/CareersPageNew';
```

**Find this** (in the page rendering section):
```typescript
{page === 'careers' && <CareersPage user={user} onNavigate={navigate} />}
```

**Replace with**:
```typescript
{page === 'careers' && <CareersPageNew user={user} onNavigate={navigate} />}
```

**Save and test**: Navigate to careers page in your app.

---

## Step 2: Create Supabase Table (3 minutes)

**In your Supabase project**:

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy-paste entire contents of `supabase-migration-careers.sql`
4. Click **Run**

✅ Table created with proper structure and permissions.

---

## Step 3: Test the Page (2 minutes)

**In your app**:

1. Navigate to the Careers page
2. You should see **28 career cards** in a grid
3. **Click a card** → Modal should open with full career info
4. **Click Save** (bookmark icon) → Career saves to localStorage
5. **Use filters** → Results update live
6. **Search** → Find careers by keyword

**If all works**: ✅ You're done! System is live.

---

## Step 4 (Optional): Add More Careers (15 minutes)

**File**: `src/data/careersFullData.ts`

The system currently has:
- 10 University careers
- 7 TVET careers

To add 20 more careers:

1. Open `careersFullData.ts`
2. Look at an existing career as a template
3. Copy-paste and modify (change all fields)
4. Make sure all 30+ fields are filled
5. Add to the `tvetCareers` or `careersFullData` array

**Tips**:
- Use realistic SA universities/TVET colleges
- Use realistic ZAR salaries (R15k-R120k range typical)
- Fill ALL fields (none are optional)
- Keep RIASEC scores realistic (e.g., Electrician: R=90, I=70, A=10, etc.)

**Example format** (copy this):
```typescript
{
  id: 'my-career',
  title: 'Career Title',
  category: 'tvet',
  description: '2-3 sentence description',
  dayInTheLife: '2-3 sentences about daily work',
  riasecMatch: { realistic: 85, investigative: 60, ... },
  // ... all other 30+ fields
}
```

---

## Step 5 (Optional): Use Supabase Instead of Static Data (10 minutes)

**Why**: If you want 400+ careers, easier to manage in Supabase than in a TypeScript file.

**How**:

1. Create a function to bulk insert your careers:
   ```typescript
   // Add to src/lib/careersService.ts
   export async function bulkInsertCareers(careers: CareerFull[]): Promise<void> {
     const { error } = await supabase.from('careers').insert(
       careers.map(c => ({
         id: c.id,
         title: c.title,
         category: c.category,
         description: c.description,
         day_in_the_life: c.dayInTheLife,
         riasec_match: c.riasecMatch,
         // ... map all fields
       }))
     );
     if (error) throw error;
   }
   ```

2. Call it once to populate Supabase:
   ```typescript
   import { allCareersFullData } from '../data/careersFullData';
   import { bulkInsertCareers } from '../lib/careersService';

   // In a setup page or useEffect:
   await bulkInsertCareers(allCareersFullData);
   ```

3. Update `CareersPageNew.tsx` to fetch from Supabase:
   ```typescript
   const [careers, setCareers] = useState<CareerFull[]>([]);

   useEffect(() => {
     const cached = getCareersCache();
     if (cached) {
       setCareers(cached);
     } else {
       fetchAllCareers().then(data => {
         setCareers(data);
         saveCareersCache(data);
       });
     }
   }, []);

   // Then use 'careers' instead of 'allCareersFullData'
   ```

---

## Done! 🎉

Your careers system is now live with:

| Feature | Included? |
|---------|-----------|
| Career listing page | ✅ |
| Search by keyword | ✅ |
| Filter by category | ✅ |
| Filter by RIASEC type | ✅ |
| Career detail modal | ✅ |
| Save careers | ✅ |
| 28 complete careers | ✅ |
| Responsive design | ✅ |
| AppHeader integration | ✅ |
| Supabase ready | ✅ |

---

## Troubleshooting

### Can't navigate to careers page?
→ Check App.tsx routing. Make sure `page === 'careers'` renders something.

### See 28 career cards but they look wrong?
→ Check import in CareersPageNew: `import { allCareersFullData } from '../data/careersFullData';`

### Modal won't open when clicking a card?
→ Check browser console for errors. Verify `CareerDetailModal` component imported.

### Save button not working?
→ Check browser's localStorage is enabled. Check console for errors.

### Supabase errors when inserting?
→ Verify table was created. Check column names match (use snake_case: `day_in_the_life`, not `dayInTheLife`).

---

## What's Next?

1. **Add more careers** (20-50 more to reach 80+)
2. **Connect to other pages** (Study Library filters, Bursary filters)
3. **Integrate quiz RIASEC scores** (highlight best-match careers)
4. **Add career comparison** (2-3 careers side-by-side)

See `CAREERS_BUILD_GUIDE.md` for detailed instructions on any of the above.

---

**Questions?** See `CAREERS_IMPLEMENTATION_SUMMARY.md` for full architecture and FAQ.
