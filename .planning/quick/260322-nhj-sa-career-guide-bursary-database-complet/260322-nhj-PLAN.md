---
phase: quick
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - data/bursaries/bursaries.json
  - data/bursaries/BURSARY-REVIEW.md
autonomous: true
requirements: ["bursary-database-completion"]
must_haves:
  truths:
    - "bursaries.json contains 200+ bursaries with no duplicates"
    - "All major SA funding categories are represented per the target list"
    - "Every careerIds entry references a valid slug in _master-index.json"
    - "BURSARY-REVIEW.md summarizes total count, category breakdown, additions, flags"
  artifacts:
    - path: "data/bursaries/bursaries.json"
      provides: "Complete SA bursary database with 200+ entries"
    - path: "data/bursaries/BURSARY-REVIEW.md"
      provides: "Audit summary of bursary database completeness"
  key_links:
    - from: "data/bursaries/bursaries.json"
      to: "data/careers/_master-index.json"
      via: "careerIds field referencing career slugs"
      pattern: "careerIds.*\\[.*\\]"
---

<objective>
Audit the existing 200-bursary database against category targets, fill any gaps with missing bursaries, and produce a comprehensive review document.

Purpose: The bursaries.json already has 200 entries in v2 schema (with careerIds, coverage booleans, valuePerYear, etc.). The task is to verify comprehensive coverage across all 10 target categories, add any genuinely missing bursaries from the user's specification, and create BURSARY-REVIEW.md as an audit trail.

Output: Gap-filled bursaries.json (200+ entries), BURSARY-REVIEW.md audit document.
</objective>

<execution_context>
@C:/Users/Gener/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Gener/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@data/bursaries/bursaries.json — Current bursary database (200 entries, v2 schema already applied)
@data/careers/_master-index.json — Valid career IDs for cross-referencing (161 careers)

CRITICAL: The file is ALREADY in v2 schema. Do NOT attempt migration. The schema per entry is:
```json
{
  "id": "string",
  "name": "string",
  "provider": "string",
  "fields": ["string"],
  "careerIds": ["valid-career-slug"],
  "nsfasAlternative": boolean,
  "coversTuition": boolean,
  "coversAccommodation": boolean,
  "coversLiving": boolean,
  "valuePerYear": number,
  "applicationUrl": "string",
  "applicationDeadlineMonth": number,
  "requiresWorkback": boolean,
  "workbackYears": number,
  "incomeThreshold": number|null
}
```

Existing 200 bursary IDs (DO NOT DUPLICATE ANY):
nsfas, funza-lushaka, saica-thuthuka, sasol, eskom, transnet, anglo-american, implats, standard-bank, absa, discovery, sappi, nrf, telkom-foundation, vodacom, nedbank, mtn, department-of-health-nursing, south-african-sugar, icb, anglo-american-platinum, gold-fields, deloitte, pwc, kpmg, ey, murray-and-roberts, arcelor-mittal, wwf, alan-gray, rand-merchant-bank, department-social-development, mine-health-safety, merseta, ceta, fasset, seta-hlabi, numsa-scholarship, google-developer, microsoft-azure, greencape, syngenta, landbank, water-research-commission, south-african-tourism, ithemba-ecd, h3africa, sibanye-stillwater, harmony-gold, de-beers, kumba-iron-ore, south32, african-rainbow-minerals, northam-platinum, royal-bafokeng-platinum, glencore, bhp, mondi, aeci, omnia, dow-chemical, basf-sa, chevron-sa, totalenergies-sa, engen, shell-sa, shoprite, pick-n-pay, woolworths, massmart, spar, clicks, dischem, aspen-pharmacare, adcock-ingram, tiger-brands, fnb, investec, old-mutual, sanlam, momentum-metropolitan, liberty, coronation, rmi, hollard, santam, capitec, african-bank, grindrod, psg, ninety-one, accenture, capgemini, bcg, mckinsey-sa, saipa, cima-sa, acca-sa, saimm, saiee, ecsa, sanc, hpcsa, sacssp, law-society, giz, huawei-sa, cisco-sa, oracle-sa, ibm-sa, sap-sa, bcx, dimension-data, liquid-technologies, rain, cell-c, openserve, t-systems-sa, eoh, bytes-technology, dept-public-works, dept-agriculture, dept-water-sanitation, dept-energy, dept-transport, dept-defence, dept-correctional-services, dept-home-affairs, stats-sa, competition-commission, sars, national-treasury, sarb, fsca, nersa, icasa, sanedi, idc, dbsa, wbho, aveng, concor, stefanutti-stocks, zutari, wsp-sa, arcus-gibb, royal-haskoningdhv, smec-sa, rand-water, umgeni-water, amatola-water, sedibeng-water, mediclinic, netcare, life-healthcare, gauteng-doh, western-cape-doh, kzn-doh, eastern-cape-doh, samrc, cansa, sapc, hasa, saslha, optometry-sa, ppc, afgri, astral-foods, birdlife-sa, wessa, sanparks, working-on-fire, agri-sa, isfap, harambee, yes-fellowship, zenex-foundation, dell-foundation, old-mutual-foundation, oppenheimer-memorial-trust, dg-murray-trust, epoch-optima-trust, shuttleworth-foundation, mict-seta, agri-seta, foodbev-seta, wrseta, teta, inseta, bankseta, lgseta, sasseta, etdpseta, remgro, nbi, group-five, netcare-911, neotel, limpopo-doh, sasol-inzalo

Valid career slugs (161 total) from _master-index.json include:
chemical-engineer, mechanical-engineer, civil-engineer, electrical-engineer, mining-engineer, software-developer, data-scientist, doctor, nurse, pharmacist, chartered-accountant, auditor, financial-analyst, architect, quantity-surveyor-technician, environmental-scientist, environmental-engineer, geologist, actuary, attorney, advocate, social-worker, occupational-therapist, physiotherapist, radiographer, dentist, dietitian, veterinarian, economist, journalist, marketing-manager, hr-manager, hotel-manager, chef, graphic-designer, ux-designer, network-engineer, cybersecurity-analyst, cloud-architect, plumber, electrician, welder, boilermaker, fitter-and-turner, millwright, carpenter, bricklayer, farm-manager, supply-chain-manager, high-school-teacher, primary-teacher, special-needs-teacher, clinical-psychologist, meteorologist, safety-officer, industrial-engineer, mechatronics-engineer, structural-engineer, logistics-coordinator, public-administrator, systems-analyst, tax-consultant, etc.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Audit coverage gaps and add missing bursaries</name>
  <files>data/bursaries/bursaries.json</files>
  <action>
1. Read data/bursaries/bursaries.json completely (200 entries in v2 schema).
2. Read data/careers/_master-index.json to get the full set of valid career slugs.
3. Build a set of all existing bursary IDs.

4. Compare against the user's target list below. For each target bursary, check if an equivalent already exists by ID or name. If missing, create a new entry with the v2 schema. If already exists, add to the "skipped" list.

Target bursaries to check (from user spec — organized by category):

GOVERNMENT (check for these specific ones):
- NSFAS disability variant (id: "nsfas-disability") — if not present
- SAPS bursary (id: "saps") — policing, criminology
- SANDF bursary — already exists as "dept-defence", SKIP
- DIRCO bursary (id: "dirco") — international relations
- SA Weather Service (id: "sa-weather-service") — meteorology
- CSIR bursary (id: "csir") — science, engineering, ICT
- DSI Innovation (id: "dsi-innovation") — science and innovation
- Dept Education bursary (id: "dept-education") — teaching
- Dept Health medical (id: "dept-health-medical") — medicine, dentistry

MINING (many already exist — check for):
- Exxaro (id: "exxaro") — mining, environmental, engineering
- Vedanta Zinc (id: "vedanta-zinc") — engineering, chemistry
- Master Drilling (id: "master-drilling") — engineering

ENERGY (check for):
- PetroSA (id: "petrosa") — petroleum engineering, chemistry
- NECSA (id: "necsa") — nuclear engineering, physics
- City Power (id: "city-power") — electrical engineering
- IPP Office (id: "ipp-office") — renewable energy

BANKING (many exist — check for):
- PIC (id: "pic") — finance, economics, investment management
- Allan Gray Orbis — already exists as "alan-gray", SKIP

TECH (check for):
- Telkom main bursary (id: "telkom") — vs existing "telkom-foundation"
- iOCO (id: "ioco") — IT, software development
- BBD (id: "bbd") — software development, data science

HEALTHCARE (check for):
- Solidarity Health (id: "solidarity-health") — nursing
- SA Pharmacy Council — already exists as "sapc", SKIP
- Clicks — already exists, SKIP
- Dis-Chem — already exists as "dischem", SKIP

CONSTRUCTION (check for):
- NHBRC (id: "nhbrc") — built environment
- SACPCMP (id: "sacpcmp") — construction management
- AfriSam (id: "afrisam") — engineering, chemistry
- Lafarge SA (id: "lafarge-sa") — engineering, chemistry
- SAPOA (id: "sapoa") — property, built environment
- SACAP (id: "sacap") — architecture

AGRICULTURE (check for):
- Tongaat Hulett (id: "tongaat-hulett") — agriculture, engineering
- RCL Foods (id: "rcl-foods") — food science
- Clover (id: "clover") — food technology
- Bayer Crop Science (id: "bayer-crop-science") — agriculture, biotech
- SABI (id: "sabi") — sugarcane, agronomy

SETA (check for):
- CHIETA (id: "chieta") — chemical industries
- CATHSSETA (id: "cathsseta") — hospitality, tourism
- HWSETA (id: "hwseta") — health, welfare
- PSETA (id: "pseta") — public service
- Services SETA (id: "services-seta") — retail, wholesale

NGO/FOUNDATION (check for):
- Moshal (id: "moshal") — all fields, KZN
- Kagiso Trust (id: "kagiso-trust") — education, health
- Cyril Ramaphosa Foundation (id: "cyril-ramaphosa-foundation") — all fields
- Motsepe Foundation (id: "motsepe-foundation") — all fields
- Harry Crossley (id: "harry-crossley") — Western Cape
- Canon Collins (id: "canon-collins") — postgrad, social justice
- Nelson Mandela Foundation (id: "nelson-mandela-foundation") — social development
- Thuthuka Fund (id: "thuthuka") — accounting (distinct from saica-thuthuka)
- CFA Institute (id: "cfa-institute") — investment management

5. For each NEW bursary, use the exact v2 schema:
   - careerIds: ONLY use slugs that exist in _master-index.json. If a desired career is not in the index, omit it and note the gap.
   - valuePerYear: realistic ZAR (20000-150000)
   - applicationDeadlineMonth: 7-10 for most SA bursaries
   - requiresWorkback: true for corporate/parastatal, false for government/NGO/SETA
   - incomeThreshold: set for need-based (e.g. 350000 for government), null for merit-based

6. Append all new bursaries to the bursaries array. Do NOT modify any existing entries.
7. Ensure valid JSON with 2-space indentation.
8. Update meta.lastUpdated to "2026-03" if not already set.
  </action>
  <verify>
    <automated>cd /c/SaCareerGuide && node -e "const d=require('./data/bursaries/bursaries.json'); const b=d.bursaries; const ids=b.map(x=>x.id); const dupes=ids.filter((id,i)=>ids.indexOf(id)!==i); console.log('Total:', b.length); console.log('Duplicates:', dupes.length, dupes); const mi=require('./data/careers/_master-index.json'); const validIds=new Set(mi.careers.map(c=>c.id)); let bad=[]; b.forEach(x=>(x.careerIds||[]).forEach(c=>{if(!validIds.has(c))bad.push(c+' in '+x.id)})); console.log('Invalid careerIds:', bad.length, bad); const req=['id','name','provider','fields','careerIds','nsfasAlternative','coversTuition','coversAccommodation','coversLiving','valuePerYear','applicationUrl','applicationDeadlineMonth','requiresWorkback','workbackYears','incomeThreshold']; let schemaBad=[]; b.forEach(x=>{const m=req.filter(k=>!(k in x)); if(m.length) schemaBad.push(x.id+': missing '+m.join(','))}); console.log('Schema issues:', schemaBad.length, schemaBad); console.log(b.length>=200 && dupes.length===0 && bad.length===0 && schemaBad.length===0 ? 'PASS' : 'FAIL')"</automated>
  </verify>
  <done>bursaries.json has 200+ unique bursaries, zero duplicate IDs, zero invalid careerIds, all v2 schema fields present on every entry, comprehensive category coverage</done>
</task>

<task type="auto">
  <name>Task 2: Create BURSARY-REVIEW.md audit document</name>
  <files>data/bursaries/BURSARY-REVIEW.md</files>
  <action>
After Task 1 completes, read the final bursaries.json and create data/bursaries/BURSARY-REVIEW.md with these sections:

1. **Summary** — Total bursary count, how many were added in this task, how many already existed from the prior task.

2. **Category Breakdown** — A table with columns: Category, Target Count, Actual Count, Status. Categories: Government/Public Sector, Mining/Resources, Energy/Utilities, Banking/Finance, Technology/ICT, Healthcare/Pharma, Construction/Built Environment, Agriculture/Food, SETA, NGO/Foundation, Other (retail, professional bodies, etc.). Count by inspecting each bursary's provider/fields and classifying.

3. **New Additions** — Table listing every bursary added in this task: id, name, category.

4. **Skipped (Already Existed)** — Table listing every target from the user's spec that was skipped because an equivalent already existed, showing target name and existing ID.

5. **Career ID Flags** — List any bursaries where desired careers could not be mapped to _master-index.json slugs (career name, bursary id, reason omitted). Also list career slugs from _master-index.json that have ZERO bursary coverage.

6. **Schema Validation** — Confirm all entries have all 15 required fields. Note any anomalies.
  </action>
  <verify>
    <automated>cd /c/SaCareerGuide && node -e "const fs=require('fs'); const c=fs.readFileSync('./data/bursaries/BURSARY-REVIEW.md','utf8'); const sections=['Summary','Category Breakdown','New Additions','Skipped','Career ID Flags','Schema Validation']; const missing=sections.filter(s=>!c.includes(s)); console.log('Missing sections:', missing.length, missing); console.log(missing.length===0 ? 'PASS' : 'FAIL')"</automated>
  </verify>
  <done>BURSARY-REVIEW.md exists with all 6 required sections, accurately reflecting the final state of bursaries.json</done>
</task>

</tasks>

<verification>
- bursaries.json parses as valid JSON
- Total bursary count >= 200
- Zero duplicate IDs
- Zero invalid careerIds
- All 15 schema fields present on every entry
- BURSARY-REVIEW.md has all 6 sections
- No existing bursaries were modified or removed
</verification>

<success_criteria>
- bursaries.json has 200+ unique bursaries covering all 10 target categories
- Every careerIds entry maps to a valid career in _master-index.json
- BURSARY-REVIEW.md provides complete audit: count, breakdown, additions, skips, flags, validation
- File is valid JSON with consistent v2 schema throughout
</success_criteria>

<output>
This is a quick task. After completion, create `.planning/quick/260322-nhj-sa-career-guide-bursary-database-complet/260322-nhj-SUMMARY.md`
</output>
