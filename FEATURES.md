# Prospect Platform — Features Reference

All features listed here are confirmed present in the codebase. Nothing is fabricated.

---

## Platform Overview

Prospect is a South African education and career guidance platform for Grade 8–12 learners and young adults. It is a single-page React application (React 19, Vite 6, Tailwind CSS v4) deployed on Vercel, backed by Supabase for authentication and data persistence.

---

## Navigation and Layout

- Top navigation bar with logo and links to major sections
- Mobile-responsive hamburger menu
- Route-based navigation using React Router v6
- All pages are code-split and lazy-loaded for performance
- Auth-gated routes: pages requiring login redirect unauthenticated users

---

## Authentication (Supabase Auth)

- Email and password sign-up with email confirmation
- Email and password sign-in
- Password reset via email link
- Session persistence across page refreshes
- Auth state available globally via React context
- Test mode bypass: append `?__test_mode=true` to any URL to skip auth checks (used by Playwright tests)

---

## Home / Landing

- Hero section with headline and call-to-action
- Overview of platform pillars (Careers, Bursaries, Schools, Community)
- Feature highlights and value proposition copy

---

## Careers Pillar

### Career Explorer (/careers)
- Browse 400 South African career profiles from careers400Final.ts
- Search by career name
- Filter by subject requirements, qualification level, and sector
- Each career card shows: title, sector, required subjects, average salary range, and a brief description
- Click-through to full career detail page

### Career Detail (/careers/:id)
- Full profile for a single career
- Sections: What you do, Required subjects, Qualification path, Where you can study, Salary range, Day-in-the-life paragraph
- Related careers suggestions

### Career Quiz (/career-quiz)
- Multi-step subject and interest questionnaire
- Results page showing matched career suggestions ranked by fit score
- Each result links to the full career detail page

### Career Roadmap (/roadmap)
- Visual step-by-step path from current grade to a chosen career
- Shows subject requirements per grade, qualification milestones, estimated time

---

## Bursaries Pillar

### Bursary Search (/bursaries)
- 245 bursary listings sourced from bursaries.ts
- Search by bursary name, provider, or field of study
- Filter by: field of study, province, open/closed status
- Each listing shows: provider, amount (where known), eligibility criteria, deadline, application link

### Bursary Detail (/bursaries/:id)
- Full bursary profile
- Eligibility breakdown, how to apply, required documents, contact details

---

## Schools Pillar

### School Explorer (/schools)
- Browse South African schools
- Search and filter by province, type (public/private/TVET)
- School cards with name, location, type

### School Detail (/schools/:id)
- Individual school profile with available information

### TVET Colleges (/tvet)
- Listing of TVET colleges with course offerings
- Filter by province

### School AI Assistant (/school-assist)
- AI-powered chat interface for school and education questions
- Powered by Groq API (model: llama-3.3-70b-versatile)
- System prompt focused on South African education: subjects, NSC requirements, university admission points (APS), TVET pathways
- 7 predefined instant answers for common questions (shown immediately while Groq loads a fuller response in background)
- Groq silently upgrades predefined answers in the background
- Processing status bar: animated shimmer bar + "Thinking" label during inference
- Image upload: users can attach an image to their message; sent as base64 in the conversation
- 10-message rolling context window sent to Groq for continuity
- 30-second timeout for text requests, 120-second timeout for image requests
- Errors displayed inline in the chat (amber styling), not as page-level alerts
- Abort controller cancels in-flight requests when a new message is sent
- Chat history persists for the session (cleared on page reload)
- Mobile-responsive layout with fixed input dock at bottom

---

## Community Pillar

### Community Hub (/community)
- Central hub page for community features
- Links to forums, study groups, peer discussions

### Forums / Discussion
- Topic-based discussion threads
- Create new posts, reply to existing threads
- Posts stored in Supabase

---

## Study Library (/study-library)

- 24 topic files covering 11 subjects
- Subjects include: Mathematics, Physical Sciences, Life Sciences, English, Accounting, Business Studies, Economics, Geography, History, Life Orientation, Mathematical Literacy
- Each topic has structured study notes
- Search and filter by subject
- Content rendered as formatted study material

---

## User Profile and Progress

### Profile Page (/profile)
- View and edit display name
- View account email
- Supabase-backed profile data

### Progress Tracking
- Tracks which careers, bursaries, and study topics a user has viewed or saved
- Saved items accessible from profile

---

## University Information (/universities)
- South African university listings
- Filter by province
- Each entry shows: name, location, faculties offered, website link

---

## Subject Help (/subject-help)
- Guidance on subject choices per grade
- Explains impact of subject selection on career and university options
- NSC subject groupings explained

---

## APS Calculator (/aps-calculator)
- Calculates Admission Point Score from entered subject marks
- Shows which universities and faculties a score qualifies for
- Real-time calculation as marks are entered

---

## Grade Tracker (/grade-tracker)
- Enter subject marks per term
- Track progress across the school year
- Visual indication of pass/fail per subject

---

## News and Events (/news)
- Education and bursary news articles
- Event listings relevant to learners (open days, application deadlines)

---

## Settings (/settings)
- Theme preferences
- Notification preferences
- Account management options

---

## Technical Features (Not User-Visible)

- Supabase: authentication, user profiles, forum posts, saved items
- Groq API: AI chat backend, OpenAI-compatible endpoint
- Vercel: deployment platform; VITE_GROQ_API_KEY and Supabase credentials stored as environment variables
- Code splitting: major data files (careers400Final.ts, bursaries.ts) and vendor libraries chunked separately in Vite build
- Playwright: end-to-end test suite; uses ?__test_mode=true to bypass auth
- Vite 6: dev server on port 3000, HMR (can be disabled via DISABLE_HMR=true)

---

## What the Platform Does Not Have

- No Claude or any Anthropic API calls (by design)
- No Ollama (removed; was local-only, could not work on live site)
- No Google Gemini (removed)
- No in-app payments or subscriptions
- No mobile app (web only)
