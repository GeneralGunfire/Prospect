# Feature Research

**Domain:** Career guidance / edtech — SA high school students (Grade 10-12)
**Researched:** 2026-03-25
**Confidence:** MEDIUM
**Note on sources:** WebSearch and WebFetch were unavailable. Analysis is based on PROJECT.md context,
training knowledge of Yenza, Gradesmatch, NCAP, Reslocate, international equivalents (Career Cruising,
Naviance, Unifrog), and RIASEC-based career guidance patterns. Confidence for competitor specifics is LOW;
confidence for SA educational context (NSFAS, APS, TVET, matric) is MEDIUM-HIGH from domain knowledge.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that any career guidance tool for SA students must have. Missing these = product feels broken or
untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Career interest quiz (RIASEC) | Every career guidance tool starts with "what are you interested in?" — it's the genre-defining entry point | LOW-MEDIUM | 6 RIASEC dimensions, 30-48 questions, output top 3 types. Scoring is simple arithmetic. JSON-encodable. Estimate: 1 day |
| Career results list after quiz | Users expect immediate, ranked output — a quiz with no results is a dead end | LOW | Filter career JSON by RIASEC match. Pre-built. Estimate: 2-4 hours |
| Career detail page | Once curious, users need to know: what does this person do, what do I study, where, how long, what does it pay | MEDIUM | 200+ career JSON records needed. Schema design is the hard part, not the display. Estimate: 1 day including data |
| APS calculator | Every SA Grade 12 student calculating university eligibility uses APS. It's the lingua franca of SA higher ed | LOW | Pure arithmetic on subject marks. Trivially implementable. Estimate: 2-4 hours |
| University / TVET pathway info | "Where can I study this?" is the logical next question after career discovery. Without it the journey is incomplete | MEDIUM | 26 universities + 50 TVET colleges. Static JSON already partially exists. Estimate: 1 day |
| Bursary listing | SA students from low-income households cannot study without funding. Missing bursary info = product irrelevant to core audience | MEDIUM | 245 bursaries already in repo. Display + filter UI needed. Estimate: 0.5-1 day |
| Mobile-responsive design | Most SA students access internet on phones (Statista 2024: ~85% mobile web in SA). Desktop-only = invisible | LOW | Tailwind CSS mobile-first handles this automatically |
| Fast / low-data load | Many SA students are on prepaid data. A 5MB page kills engagement and burns their airtime | MEDIUM | Data saver mode under 50KB initial load. Requires lazy loading, no large images, JSON splitting |
| Accessible without login | SA students distrust sign-up friction; parents distrust data collection on minors. No login = no barrier | LOW | Architecture decision already made. Mainly means no auth-gated routes |

---

### Differentiators (Competitive Advantage)

Features that no SA competitor currently offers well, or that amplify the free + frictionless edge.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| TVET pathways as first-class feature | Competitors treat TVET as a footnote. ~60% of SA post-matric students go TVET. This is an underserved majority | MEDIUM | 50 TVET colleges, programs, NQF levels. JSON already partially exists. Needs college-to-career linking. Estimate: 1 day |
| Grade 10-12 study library | Nobody else offers subject study content alongside career discovery. Closes the "I need better marks to get there" gap in one product | HIGH | 13 matric subjects x 3 grades x multiple topics. Content creation is the bottleneck, not engineering. Estimate: 2-3 days for a viable subset. Risk: biggest time sink in the build |
| Interactive SA province map | "What jobs are available near me?" is a hyper-local question. No competitor answers it spatially | MEDIUM | SVG/Canvas SA map, click → province data panel. Job demand + colleges + salaries by province. Estimate: 1 day |
| WhatsApp-shareable result URL | WhatsApp is SA's primary communication platform (>90% penetration). Shareable URLs via WhatsApp let parents and teachers get involved without accounts | LOW | Serialize quiz result to URL params or short hash. Share link copies to clipboard with WhatsApp deep link. Estimate: 2-4 hours |
| NSFAS eligibility checker | NSFAS is the primary funding vehicle for SA low-income students. Simple yes/no + guidance is high value | LOW | Rule-based: household income < R350K, SA citizen, first-time student. Estimate: 2-4 hours |
| Bursary eligibility filter | 245 bursaries is useless without "which ones apply to me?" filtering by field, province, APS, race criteria | MEDIUM | Multi-facet filter on existing JSON. Estimate: 0.5 day |
| Career comparison tool | "Is engineering better than medicine for me?" — side-by-side comparison reduces decision paralysis | LOW-MEDIUM | 2-column layout pulling from career JSON. No new data needed. Estimate: 4-6 hours |
| Matric subject selector (Grade 9/10) | Younger students choosing subjects need to understand downstream career implications. Pre-matric hook | LOW-MEDIUM | Reverse lookup: subject combination → accessible careers. Estimate: 0.5 day |
| APS-based career eligibility matching | Combining APS score with career requirements gives personalized, not generic, results — "you qualify for X, you're 5 APS short of Y" | MEDIUM | Requires APS calculator + career eligibility thresholds in JSON. High user value, moderate engineering. Estimate: 0.5 day after APS calc exists |
| PWA / offline support | Students in rural areas or load-shedding situations lose connectivity. Offline-capable PWA keeps them productive | MEDIUM | Service worker + cache strategy. Vite PWA plugin makes this tractable. Estimate: 0.5 day setup, ongoing cache decisions |
| Data saver toggle | Explicit control over data usage signals respect for the user's constraints. Builds trust with the target audience | LOW-MEDIUM | CSS class toggle stripping images + reducing payload. Localstorage preference. Estimate: 4-6 hours |

---

### Anti-Features (Scope Killers to Deliberately Avoid)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| AI-generated career advice / chatbot | "Personalised" feels better than static content; ChatGPT hype | Hallucinations destroy trust with students making real life decisions. Engineering cost is high. Static curated data is more reliable | Invest in high-quality curated career JSONs with real salary data, real university requirements |
| Real-time job listings scraping | "Live" job data sounds more useful | Scraping is fragile, legally risky, maintenance-heavy. SA job boards (LinkedIn, Careers24, PNet) have anti-scrape measures. For high school students the decision horizon is 3-5 years, not today's listings | Static SA job market data (DHET labour demand reports) updated manually per semester |
| University application workflow | Natural extension of "where can I study?" | Applications require real-time data, integration with NBT, university APIs, deadline tracking. This is a separate product (Gradesmatch's entire business) | Link out to institution application portals. Discovery only |
| School/teacher admin dashboard | Schools might request it for guidance counsellors | Doubles the product surface area. Requires accounts, class management, reporting. Destroys the no-login philosophy | Build the student product first. Admin tooling is v3+ if there's demand |
| Social features (profiles, forums, comments) | "Community" feels engaging | Moderation burden, content risk with minors, auth requirement, POPIA compliance complexity | WhatsApp sharing covers social proof without building a social network |
| Personalised push notifications | Retention mechanic seen in edtech apps | Requires registration, app installation, ongoing content ops. PWA notifications are poorly supported on iOS | Email newsletter opt-in as a future consideration |
| Paid tiers / freemium | Sustainability question | Violates the core value proposition. Any paywall signals the product has the same problem as Yenza | Sustainability through partnerships, school sponsorships, or grants — not user payments |
| Native mobile app (iOS/Android) | "App store presence" feels professional | 7-day timeline makes this impossible. PWA + responsive web covers the use case. App store approval takes weeks | PWA with add-to-homescreen. Same capability, zero app store overhead |
| Multilingual support (Zulu, Xhosa, Afrikaans, etc.) | SA has 11 official languages | Translation at launch is a months-long content project. Low-quality translation is worse than English-only | English for v1 (dominant language of SA education and internet). Flag for v2 with professional translation |
| Anonymous quiz analytics dashboard (public) | Transparency, interesting data | Requires aggregation UI, POPIA considerations, potential for misuse | Log to Supabase for internal analysis only. Publish aggregate findings in a blog post instead |

---

## Feature Dependencies

```
[RIASEC Quiz]
    └──requires──> [Career JSON data (200+ careers with RIASEC codes)]
    └──enables───> [Career Results List]
                       └──enables───> [Career Detail Page]
                                          └──requires──> [University/TVET JSON]
                                          └──requires──> [Bursary JSON]
                                          └──enables───> [Career Comparison Tool]

[APS Calculator]
    └──enables───> [Career Eligibility Matching]
                       └──requires──> [Career JSON with APS thresholds]
                       └──enhances──> [Career Results List] (personalised ranking)

[Bursary JSON (245 entries)]
    └──enables───> [Bursary Listing]
                       └──enables───> [Bursary Eligibility Filter]
                       └──enhanced by──> [NSFAS Eligibility Checker]

[Province Map]
    └──requires──> [Job demand data by province]
    └──requires──> [TVET college locations by province]
    └──requires──> [University locations by province]

[Study Library]
    └──requires──> [Subject content JSON (13 subjects x 3 grades)]
    └──enhances──> [Career Detail Page] (career relevance tagging)
    └──enhanced by──> [Subject Selector Tool] (Grade 9/10)

[WhatsApp Share]
    └──requires──> [Career Results List] (something to share)
    └──enhanced by──> [APS Calculator] (personalised results worth sharing)

[PWA / Offline]
    └──requires──> [Static JSON data strategy] (cacheable content)
    └──enhanced by──> [Data Saver Mode]

[Data Saver Mode]
    └──independent (CSS + localStorage toggle)

[NSFAS Checker]
    └──independent (rule-based, no external data)

[Bursary Eligibility Filter]
    └──requires──> [Bursary JSON]
    └──enhanced by──> [APS Calculator result]
```

### Dependency Notes

- **Career Results List requires Career JSON:** The JSON schema must be finalized before building any display layer. Schema is the foundational decision.
- **Career Eligibility Matching requires APS Calculator:** Build APS calc first; eligibility matching is a thin layer on top.
- **Province Map requires three data sources:** All three (job demand, TVET locations, university locations) must be compiled before the map is useful. Partial data = confusing gaps.
- **Study Library is independent but high-cost:** It doesn't block any other feature, but it's the most content-intensive piece. Content creation can run in parallel with feature building.
- **WhatsApp Share requires shareable state:** Quiz result must be URL-serializable. Design this into the routing from day 1, not retrofitted.

---

## MVP Definition

### Launch With (v1) — 7-day constraint

The core loop: discover a career → understand the path → find funding. Everything else is enhancement.

- [ ] **RIASEC quiz** — the entry point; without it there's no discovery
- [ ] **Career results list** (top 5-10 matches) — immediate payoff after quiz
- [ ] **Career detail page** (matric requirements, APS, university/TVET, salary, bursaries) — the "roadmap" deliverable
- [ ] **APS calculator** — personalises the career list; trivially low effort, very high value
- [ ] **Career eligibility matching** — combines APS + quiz for personalised results; built on APS calc
- [ ] **Bursary listing with basic filter** — 245 bursaries already exist; display + field filter
- [ ] **NSFAS eligibility checker** — 2-4 hours, high value for low-income students
- [ ] **WhatsApp-shareable URL** — 2-4 hours, high social leverage
- [ ] **Mobile-responsive + data saver mode** — non-negotiable for SA audience
- [ ] **Static content for at least 3-5 career pages in depth** — breadth (200 careers) matters less than depth for launch

### Add After Validation (v1.x)

Add when core loop is validated and real users are engaging.

- [ ] **Province map** — high visual impact, but requires multi-source data compilation. Add once basic discovery works
- [ ] **Career comparison tool** — users will ask for it once they have results to compare
- [ ] **PWA / offline support** — add when user retention becomes measurable
- [ ] **Bursary eligibility deep filter** (province, APS threshold, race criteria) — add when bursary traffic is meaningful
- [ ] **Subject selector (Grade 9/10)** — add once Grade 11-12 flow is solid
- [ ] **Study library (first 2-3 subjects)** — high effort content; validate with a small subset before full build

### Future Consideration (v2+)

Defer until product-market fit is established.

- [ ] **Full study library (13 subjects x 3 grades)** — content creation at this scale is a multi-week project
- [ ] **Supabase optional auth (save results / track study progress)** — add only when users want to return; no evidence of that until v1 is live
- [ ] **Anonymous quiz analytics dashboard (internal)** — useful after enough traffic exists to show patterns
- [ ] **Multilingual content** — requires professional translation; English-only for v1
- [ ] **Career skills content** (coding basics, electrical theory, etc.) — distinct from matric subjects; can be a separate section in v2

---

## Feature Prioritization Matrix

| Feature | User Value | Build Cost | Priority |
|---------|------------|------------|----------|
| RIASEC quiz | HIGH | LOW | P1 |
| Career results list | HIGH | LOW | P1 |
| Career detail page | HIGH | MEDIUM | P1 |
| APS calculator | HIGH | LOW | P1 |
| Career eligibility matching | HIGH | LOW (after APS) | P1 |
| Bursary listing + basic filter | HIGH | LOW (data exists) | P1 |
| NSFAS eligibility checker | HIGH | LOW | P1 |
| WhatsApp share URL | HIGH | LOW | P1 |
| Mobile-responsive design | HIGH | LOW (Tailwind) | P1 |
| Data saver mode | HIGH | LOW-MEDIUM | P1 |
| TVET pathways in career detail | HIGH | MEDIUM | P1 |
| Province map | MEDIUM | HIGH | P2 |
| Career comparison tool | MEDIUM | LOW-MEDIUM | P2 |
| Bursary eligibility deep filter | MEDIUM | MEDIUM | P2 |
| Subject selector (Grade 9/10) | MEDIUM | LOW-MEDIUM | P2 |
| PWA / offline support | MEDIUM | MEDIUM | P2 |
| Study library (2-3 subjects) | HIGH | HIGH | P2 |
| Full study library (all subjects) | HIGH | VERY HIGH | P3 |
| Optional Supabase auth | LOW (at launch) | MEDIUM | P3 |
| Quiz analytics dashboard | LOW | MEDIUM | P3 |
| Multilingual content | MEDIUM | VERY HIGH | P3 |

**Priority key:**
- P1: Must have for 7-day launch
- P2: Add in v1.x after validation
- P3: Future consideration — v2+

---

## Competitor Feature Analysis

| Feature | Yenza | Gradesmatch | NCAP | Reslocate | Our Approach |
|---------|-------|-------------|------|-----------|--------------|
| Career interest quiz | Yes (RIASEC-style) | No | Partial | Basic | RIASEC 30-question quiz, free |
| Career detail pages | Yes (paywalled) | No | Yes (outdated) | Yes (generic) | Deep pages, free, SA-specific |
| APS calculator | Yes | Yes (application-focused) | Yes | Partial | Yes, with eligibility matching |
| University pathways | Yes (paywalled) | Yes (application workflow) | Yes | Yes | Yes, discovery only, free |
| TVET pathways | No / minimal | No | Partial | No | First-class feature, 50 colleges |
| Bursary database | Yes (partial) | No | Partial | No | 245 bursaries, filterable |
| NSFAS guidance | Partial | No | Yes | No | Yes, rule-based checker |
| Study library | No | No | No | No | Yes — unique in SA market |
| Province job map | No | No | No | No | Yes — unique in SA market |
| WhatsApp sharing | No | No | No | No | Yes — SA social platform |
| Free access | No (school paywall) | Limited | Yes | Limited | 100% free, no login |
| Low-data / PWA | No | No | No | No | Yes — data saver + PWA |
| Mobile-first | Partial | Yes | No | Partial | Yes |

**Confidence on competitor analysis:** LOW. Based on training knowledge of these platforms as of mid-2025.
Features may have changed. Verify against live sites before using competitively.

---

## SA-Specific Considerations

These are not in the template but are critical for this domain.

### Educational Structure Context
- **APS (Admission Point Score):** SA universities use APS, not a single grade. Any career guidance tool must speak this language. The calculation varies slightly by institution (some weight Life Orientation differently). Use the most common formulation: 7 subjects x points scale, LO excluded from most APS totals.
- **NSC vs IEB vs SACAI:** Most students are NSC (National Senior Certificate). IEB is private school. SACAI is correspondence. Build for NSC first; IEB is a nice-to-have flag in career data.
- **NQF levels:** TVET qualifications use NQF levels (1-10). Career data must include NQF level alongside traditional degree labelling for TVET pathways to make sense.
- **NSFAS income threshold:** R350,000 household income per annum as of 2025. This is a rule-based check, not a form submission — build a simple calculator, not an application.

### Connectivity Context
- **Data saver is not a nice-to-have:** Prepaid mobile data in SA costs approximately R149/GB (Telkom) to R349/GB (MTN). A 2MB page load costs a meaningful fraction of a student's daily data. 50KB initial load is a real constraint, not a performance goal.
- **WhatsApp penetration:** >90% of SA smartphone users use WhatsApp. It is the primary channel for sharing links, not Twitter/X or email. Share button should default to WhatsApp, not a generic share API.
- **Load-shedding:** Scheduled power outages are still a reality in SA in 2026. PWA offline support is not just about rural connectivity — it's about study continuity during outages.

### Trust Context
- **No login = no barrier but also no creep:** POPIA (South Africa's GDPR equivalent) is strict about collecting data from minors. Keeping the core product login-free eliminates the compliance surface area for Phase 1.
- **Curated over AI-generated:** SA students (and their parents) are making real, high-stakes decisions. An AI hallucination about university entry requirements could cause real harm. Static, curated, sourced data is a trust feature, not a limitation.

---

## Sources

- PROJECT.md (primary specification, 2026-03-25)
- Training knowledge of Yenza, Gradesmatch, NCAP, Reslocate (confidence: LOW — may be outdated)
- Training knowledge of RIASEC career guidance methodology (Holland, 1959; widely implemented)
- SA educational context: NSC, APS, NSFAS, NQF, TVET (confidence: MEDIUM — verify thresholds against DHET and NSFAS official sites)
- SA mobile data costs: training knowledge, approximate (confidence: LOW — verify against current operator pricing)
- POPIA (Protection of Personal Information Act): training knowledge (confidence: MEDIUM — verify compliance requirements if adding auth)

---

*Feature research for: SA Career Guide — career guidance / edtech for SA Grade 10-12 students*
*Researched: 2026-03-25*
