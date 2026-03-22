# Bursary Database Review & Audit Report

**Date:** 2026-03-22
**Schema Version:** v2 (detailed schema with careerIds, coverage booleans, valuePerYear)
**Generated from:** data/bursaries/bursaries.json

---

## 1. Total Count

| Metric | Value |
|--------|-------|
| Total bursaries | **219** |
| Migrated from old schema | 200 |
| Newly added entries | 19 |
| Skipped duplicates (see Section 5) | 1 |

---

## 2. Category Breakdown

| Category | Count | Description |
|----------|-------|-------------|
| Corporate | 122 | Private sector companies (mining, banking, energy, ICT, retail, pharma, consulting) |
| Government | 28 | National/provincial government departments and public entities |
| NGO / Foundation | 25 | Non-governmental organisations, trusts, foundations, fellowships |
| Professional Body | 18 | Sector professional councils and institutes |
| SETA | 16 | Sector Education and Training Authorities |
| Parastatal | 10 | State-owned enterprises (Eskom, Transnet, Rand Water, etc.) |

**Total: 219**

### Notable sub-sectors within Corporate (122):
- Mining & Resources: ~28 (Anglo American, Implats, Sibanye, Harmony, De Beers, Kumba, South32, ARM, Northam, Royal Bafokeng, Glencore, BHP, etc.)
- Banking & Finance: ~25 (Standard Bank, ABSA, FNB, Nedbank, Capitec, African Bank, Investec, Old Mutual, Sanlam, Momentum, Liberty, Coronation, RMI, Hollard, Santam, PSG, Ninety One, etc.)
- Energy & Chemicals: ~18 (Sasol, Eskom, Engen, Shell SA, TotalEnergies, Chevron, BASF, Dow, Omnia, AECI, PetroSA, NECSA, City Power, etc.)
- ICT & Technology: ~20 (Telkom Foundation, Vodacom, MTN, Huawei, Cisco, Oracle, IBM, SAP, BCX, Dimension Data, Liquid Technologies, Rain, Cell C, Openserve, T-Systems, EOH, Bytes Technology, Telkom, Google, Microsoft, etc.)
- Construction & Engineering: ~16 (WBHO, Aveng, Concor, Stefanutti Stocks, Zutari, WSP SA, Arcus Gibb, Royal HaskoningDHV, SMEC SA, Murray & Roberts, ArcelorMittal, Group Five, NHBRC, SACPCMP, etc.)
- Healthcare: ~5 (Mediclinic, Netcare, Life Healthcare, Netcare 911, etc.)
- Retail & FMCG: ~10 (Shoprite, Pick n Pay, Woolworths, Massmart, SPAR, Clicks, Dis-Chem, Tiger Brands, Tongaat Hulett, RCL Foods, etc.)

---

## 3. Career Coverage Analysis

**Coverage summary:** 75 out of 161 career slugs (46.6%) are referenced by at least one bursary.

### Well-Covered Careers (multiple bursaries available):
- `chemical-engineer` — referenced by ~35 bursaries
- `civil-engineer` — referenced by ~30 bursaries
- `electrical-engineer` — referenced by ~30 bursaries
- `mechanical-engineer` — referenced by ~35 bursaries
- `mining-engineer` — referenced by ~25 bursaries
- `chartered-accountant` / `auditor` — referenced by ~25 bursaries
- `software-developer` — referenced by ~20 bursaries
- `nurse` — referenced by ~15 bursaries
- `pharmacist` — referenced by ~12 bursaries
- `doctor` — referenced by ~10 bursaries
- `environmental-scientist` — referenced by ~12 bursaries
- `geologist` — referenced by ~15 bursaries
- `social-worker` — referenced by ~8 bursaries
- `financial-analyst` — referenced by ~15 bursaries
- `actuary` — referenced by ~12 bursaries

### Careers with Zero Direct Bursary Coverage (85 careers):

These career slugs have no bursary explicitly mapped to them. Students in these careers should apply for "All fields" bursaries (NSFAS, Moshal, Cyril Ramaphosa Foundation, Motsepe Foundation, Nelson Mandela Foundation, Harry Crossley Foundation) or sector-relevant SETAs.

| Career Slug | Category |
|-------------|----------|
| 3d-printing-specialist | Manufacturing & Technology |
| agritech-specialist | Agriculture & Technology |
| animal-production | Agriculture |
| aquaculture-technician | Agriculture |
| aquaponics-technician | Agriculture |
| auto-electrician | Automotive |
| baker | Hospitality |
| barista | Hospitality |
| beauty-therapist | Beauty |
| blockchain-developer | Information Technology |
| boilermaker | Engineering Trades |
| bricklayer | Construction |
| carpenter | Construction |
| computer-hardware-technician | Information Technology |
| content-creator | Digital & Marketing |
| crane-operator | Construction |
| data-privacy-officer | Legal & Compliance |
| devops-engineer | Information Technology |
| diesel-mechanic | Automotive |
| accessibility-specialist | Design & Technology |
| draughtsperson | Engineering & Technical |
| drone-pilot | Aviation & Technology |
| education-psychologist | Education |
| ev-mechanic | Automotive |
| esports-manager | Gaming & Entertainment |
| ethical-hacker | Information Technology |
| film-producer | Creative & Media |
| fintech-developer | Information Technology |
| fitness-trainer | Health & Wellness |
| fitter-and-turner | Engineering Trades |
| gig-economy-consultant | Business & Services |
| graphic-designer | Creative & Media |
| growth-hacker | Business & Technology |
| hairdresser | Beauty |
| health-informatics-specialist | Health & Technology |
| electrician-instrumentation | Engineering & Technical |
| insurtech-specialist | Financial Services & Technology |
| iot-specialist | Information Technology |
| legal-secretary | Business & Administration |
| magistrate | Law & Government |
| makeup-artist | Beauty |
| mechatronics-engineer | Engineering |
| medical-secretary | Business & Administration |
| meteorologist | Science & Research |
| millwright | Engineering Trades |
| motor-mechanic | Automotive |
| nail-technician | Beauty |
| oceanographer | Science & Research |
| painter | Construction |
| panel-beater | Automotive |
| pastry-chef | Hospitality |
| pharmacy-assistant | Health & Wellness |
| plasterer | Construction |
| plumber | Construction |
| podcast-producer | Digital & Media |
| product-manager | Business & Technology |
| refrigeration-mechanic | Engineering Trades |
| remote-work-coordinator | Business & Administration |
| restaurant-manager | Hospitality |
| robotics-technician | Engineering & Technology |
| roofer | Construction |
| scrum-master | Business & Technology |
| seo-specialist | Digital & Marketing |
| site-reliability-engineer | Information Technology |
| smart-city-planner | Urban Planning & Technology |
| social-media-manager | Digital & Marketing |
| electrician-solar | Engineering & Technical |
| sound-technician | Creative Arts |
| spray-painter | Automotive |
| surveyor-technician | Engineering & Technical |
| sustainability-officer | Environment & Sustainability |
| telemedicine-coordinator | Health & Technology |
| tiler | Construction |
| toolmaker | Engineering Trades |
| tourism-guide | Hospitality & Tourism |
| travel-agent | Hospitality |
| university-lecturer | Education |
| urban-farmer | Agriculture |
| ux-designer | Tech & Digital |
| ux-researcher | Design & Technology |
| vehicle-inspector | Automotive |
| virtual-reality-designer | Design & Technology |
| water-care-technician | Engineering & Technical |
| welder | Engineering Trades |
| wind-turbine-technician | Renewable Energy |

> **Note:** Many uncovered careers are TVET trades (boilermaker, millwright, welder, plumber, bricklayer, etc.). Students in these fields should look at merSETA, CETA, and relevant TVET college bursary programmes.

---

## 4. Flagged Entries (Empty careerIds)

These bursaries have `careerIds: []` because their fields are "All fields" or field-agnostic. They are **intentionally open to all disciplines**:

| ID | Name | Provider | Reason |
|----|------|----------|--------|
| nsfas | National Student Financial Aid Scheme | NSFAS | Open to all fields |
| moshal | Moshal Scholarship Program | Moshal Scholarship Program | Open to all fields |
| cyril-ramaphosa-foundation | Cyril Ramaphosa Foundation Bursary | Cyril Ramaphosa Foundation | Open to all fields |
| motsepe-foundation | Motsepe Foundation Bursary | Motsepe Foundation | Open to all fields |
| harry-crossley | Harry Crossley Foundation Bursary | Harry Crossley Foundation | Open to all fields |
| nelson-mandela-foundation | Nelson Mandela Foundation Scholarship | Nelson Mandela Foundation | Open to all fields |

These 6 entries are correct — the empty `careerIds` signals to the app that the bursary matches any career.

---

## 5. Skipped Duplicates

| Requested ID | Reason Skipped |
|-------------|----------------|
| `thuthuka` | Duplicate of existing `saica-thuthuka`. The "Thuthuka Bursary Fund" and "SAICA Thuthuka Bursary Fund" are the same funding programme administered by SAICA. The existing entry (`saica-thuthuka`) is retained. |

---

## 6. Schema Validation

All 219 bursaries contain the following required fields:

| Field | Type | Status |
|-------|------|--------|
| id | string | PASS — all unique |
| name | string | PASS |
| provider | string | PASS |
| fields | string[] | PASS |
| careerIds | string[] | PASS — all slugs validated against _master-index.json |
| nsfasAlternative | boolean | PASS |
| coversTuition | boolean | PASS |
| coversAccommodation | boolean | PASS |
| coversLiving | boolean | PASS |
| valuePerYear | number | PASS — realistically varied by category |
| applicationUrl | string | PASS |
| applicationDeadlineMonth | number (1-12) | PASS |
| requiresWorkback | boolean | PASS |
| workbackYears | number | PASS |
| incomeThreshold | number | PASS — null where not applicable |

**Duplicate ID check:** 0 duplicates found.
**Invalid careerIds check:** 0 invalid slugs found.

---

## 7. Coverage Notes & Recommendations

1. **TVET trade careers** (boilermaker, welder, millwright, plumber, etc.) have no dedicated bursary entries. The merSETA, CETA, and provincial government SETA programmes cover these learners but were not mapped to individual trade slugs due to broad field definitions. A future enhancement could add explicit careerIds mappings to these SETA entries.

2. **Emerging tech careers** (blockchain-developer, devops-engineer, fintech-developer, site-reliability-engineer, iot-specialist) are covered by general ICT bursaries (Dimension Data, IBM, BCX, etc.) which map to `software-developer` and `network-engineer` but not to these emerging specialist slugs. Consider adding these mappings in a future update.

3. **19 new bursaries added** span government health, energy, ICT, construction, agriculture, SETAs, and NGO/foundation categories, filling gaps in the original 200-entry set.

4. **Income thresholds** were extracted where the eligibility text explicitly stated a rand amount. Many bursaries do not specify income thresholds and thus have `incomeThreshold: null`.
