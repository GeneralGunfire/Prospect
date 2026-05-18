# Prospect — Development Timeline
## 22 March 2026 to 15 May 2026

---

## 22 March 2026 — Research and Data Foundation

No code was written on the first day. The work that actually matters at the start of a project like this is the data it runs on, and that took priority.

The bursary database was the starting point. South African bursary information is scattered across different universities, government departments, and private companies, all publishing it in different formats with different levels of detail. The initial migration pulled 200 bursaries into a consistent structure with defined fields: bursary name, field of study, eligibility criteria, funding amount, application deadline, and which provinces it applied to. From there, 19 more were added, then another 26, bringing the total to 245 entries. Getting the fields consistent was more work than the number suggests — deadline formats, province lists, and eligibility descriptions were written differently across sources and had to be normalized by hand.

A document called BURSARY-REVIEW.md was created as an audit trail, tracking which entries had gaps and which had been verified. This mattered because the database would be shown directly to students — an incomplete or misleading entry is worse than no entry at all.

Career data also needed cleaning at this stage. Two duplicate entries were found — one for AI/ML Engineer and one for Solar Installer — both of which had been added twice through different import passes. They were removed.

The rest of the day covered market research and competitor review: looking at what existed in the South African edtech space, what it did well, and where students were being underserved. From that, a 7-phase roadmap was drafted and the v1 requirements were written down.

---

## 25 March 2026 — Project Scaffold and Planning

The project configuration was initialized on this day. A Phase 0 plan was written covering how the app scaffold would be structured and how shared state across the application would work. The decision to use a React context for global state rather than a more complex state management library was made early and stayed for the duration of the project. The app was small enough that a simpler approach worked fine, and it avoided introducing a dependency that would add overhead without benefit.

---

## 27 March 2026 — First Visual Pass

The landing page was built for the first time. The initial design used black and white as the primary colors with a translucent navbar that blurred the content behind it. It was a starting point, though it would be rebuilt entirely the following month.

The signup page was also wired up. During testing, an issue appeared immediately: when the email rate limit was hit (which happens when the same email address is used too many times in quick succession during testing), the error message shown to the user was a raw technical error with no context. That was fixed to show a human-readable message explaining what happened and what the user should do next.

The hero section was then redesigned to take up more of the screen. The original version was modest in size and didn't communicate the platform's purpose strongly enough on first glance.

---

## 28 March 2026 — Framework Switch and Landing Page Rebuild

The project was initially built in Next.js. This was scrapped.

The reason was straightforward: Prospect is a client-side application. None of the pages needed server-side rendering, there were no SEO-critical dynamic routes that required pre-rendering at request time, and there was no backend API layer that made sense to host as Next.js API routes. Next.js adds real complexity around build configuration, routing conventions, and deployment behavior, and none of that complexity was paying for itself here. The switch was made to a standard React and Vite setup.

The landing page was rebuilt from scratch on the new foundation. This rebuild introduced premium animations, glassmorphism effects (translucent panels with backdrop blur), and a logo animation on load. A data saver toggle was also added — a control that let users with limited mobile data reduce or disable animations and heavy effects. This was a deliberate decision given the South African context, where mobile data costs are real and many students browse on limited bundles.

---

## 30 March 2026 — Core App Features Launch

This was the first full commit of the working React application. Three major features were completed.

The study library was cleaned up and made functional. Before this, it existed as a skeleton — pages were there, but the content and navigation weren't working correctly.

Data persistence was the second issue, and it was a significant one. User progress, bookmarks, and quiz results were all being stored in memory only, which meant they disappeared on every page refresh. This is an obvious problem for an educational app where students need to pick up where they left off. LocalStorage was introduced as the storage layer, and every piece of user data that needed to survive a page reload was written there on change and read back on app initialization.

The third feature was a Subject Selector for Grade 10 students. The idea was that a student could select the subjects they were taking and the app would show them which careers those subjects made accessible. This was one of the core value propositions of the platform — making the connection between subject choice and career outcome visible and concrete.

Navigation problems were also fixed on this day. The hamburger menu drawer on mobile wasn't opening and closing correctly. There were z-index conflicts causing the navigation bar to appear behind other elements on certain pages — easy to miss on desktop but immediately obvious on a phone. A back button was added on the map page after it became clear there was no obvious way to return from it.

The loading animation went through several iterations. An initial version was designed, reverted because it felt wrong, then redesigned again. The final version settled on a 5-second display on app load. Five seconds is longer than typical loading indicators, but it was chosen to give the app's initial data load time to complete before rendering the dashboard — avoiding a flash of empty content that appeared when the animation was shorter.

---

## 31 March 2026 — Polish and Accessibility

A full accessibility review was run and violations were fixed throughout the app. The most common issue was font sizes — several text elements were below a comfortable readable size. These were corrected across all pages.

The header was updated with an active page indicator so users could see at a glance which section they were in. This was missing from the first build.

Animation stagger delays were capped. The way stagger animations work is that each item in a list is delayed slightly more than the previous one, creating a cascading reveal effect. On short lists this looks good. On longer lists — like the bursary list with 245 entries — the animation was still running several seconds after the page had loaded, because the delays had accumulated to unreasonable lengths. A cap was introduced so that no item waited beyond a fixed maximum.

---

## 3–7 April 2026 — UI Components, Persistence Fixes, and Bug Triage

Eleven UI components were integrated into a design system over these days. The components standardized card layouts, buttons, and form elements so they'd look and behave consistently across the app.

Bookmark persistence was still broken in some cases. The localStorage fallback added on 30 March wasn't always triggering correctly — there were timing issues where a read would happen before a write had completed, causing the app to treat bookmarks as if they didn't exist. This was fixed with a more explicit read/write pattern.

The TVET (Technical and Vocational Education and Training) careers section was expanded. TVET colleges represent a major pathway for South African students and the platform had underrepresented them in the initial data.

The partner logos section was removed from the landing page. It had been added as a placeholder to fill space, but showed logos for organizations that weren't actually partners. Placeholder content that looks real is worse than an empty section — it's misleading — so it was cut.

The calendar feature got a year view added, and month loading was made instant. The delay before had been noticeable enough to look like a bug rather than intentional behavior.

The map page had a critical bug: selecting a location caused the page to go completely blank. This turned out to be a routing state issue — the component wasn't handling the state transition correctly after a selection, causing it to render nothing. Fixing this also required restoring a heatmap animation that had been accidentally removed during a previous edit. The footer was also overflowing on small screens and was corrected.

On 7 April, a crash was found in the event scheduler. The cause was a dropdown component receiving an empty string as the value for one of its items. The component library in use (Radix UI) doesn't accept empty strings as item values — it requires either a real value or an explicit null. The component was silently breaking when it encountered the empty string during render. The fix was replacing the empty string with a proper placeholder value.

---

## 15–17 April 2026 — Landing Page Restructure and Product Rethink

Around this point a significant rethink happened about how the product was organized. The original structure had everything loosely connected. The decision was made to separate the app into three distinct pillars — School Assist (study tools and guidance), Career Guide (career exploration and the quiz), and Community (civic awareness and utilities). Each pillar would have its own section on the landing page and its own navigation context once you were inside it.

This restructure required reworking the landing page substantially to communicate the three pillars clearly, updating routing to reflect the new organization, and fixing navigation that had accumulated inconsistencies as features were added one by one.

The color palette was also a recurring problem during this period. Different sections of the site had drifted into using different colors, and it took deliberate effort to bring everything back to the intended palette of blacks, greys, and whites with occasional blue accents.

A documentation session happened on 15 April where the current state of the site and all its features was written up, both to understand what existed and to identify what was missing or broken.

The career section was a particular focus — navigation within the career pages was inconsistent, and several nav links from the earlier structure had either been lost or were pointing to the wrong places. These were restored and tested.

---

## 17 April 2026 — Dashboard Rebuild, Community Impact Feature, and Visual Overhaul

This was the most active day of development in the entire project.

The dashboard was completely rebuilt. The original version was essentially a feature directory — it told you what the app contained and let you navigate to different sections. That's not particularly useful once a user knows the app. The new dashboard was rebuilt as an actionable daily-focus view, surfacing information relevant to where the student was in the school year. The direction came from a specific brief: the most important block should be "today's priorities" — next deadline, next subject to study, recommended session. Everything else was secondary.

Community Impact was built as a new feature. The idea was a page where students could share how Prospect had helped them — a public submissions feed with aggregate stats. The first version had authentication stubs that didn't actually talk to the database. This was caught when a submission appeared to go through but nothing was written anywhere. Real authentication was connected and the submission flow was verified. There was also a navigation error — the Community Impact page had been accidentally included in the school navigation menu, which didn't make sense contextually. It was moved to a standalone page with its own header.

The calendar got a complete visual overhaul with a side panel and filter system. The color scheme for calendar events was also toned down — it had drifted into using too many different saturated colors that didn't feel like they belonged to the same system.

A full visual redesign was attempted across the entire app: design tokens, a component library, consistent spacing and color. Tests were written for the dashboard, community impact, and authentication pages. All 30 passed by end of day.

---

## 18 April 2026 — Reverts After Overhaul

The visual redesign from 17 April caused problems in three places. The school assist pages had their layouts disrupted. The quiz page broke. The career card design was changed in a way that conflicted with the existing data structure.

Rather than patching each issue individually, those three areas were reverted to their state before the redesign. The landing page changes were kept because they were working correctly. This was the right call — trying to patch breaking changes in multiple places simultaneously tends to produce more breaking changes.

Images across the site were compressed to WebP format on this day, with a fallback for browsers that didn't support it. The reduction in page load weight was meaningful, especially on mobile.

The TVET section hero background was improved with a diagonal gradient.

---

## 19 April 2026 — Persistent Login and School Assist Improvements

Persistent login was added so users stayed signed in across browser tabs and after closing and reopening the browser. Before this, closing the tab would sign a user out, which was frustrating for students using the platform across multiple sessions.

The School Assist section was improved with better search — a dual-mode search that could find study library topics and return relevant snippets. This was added to the navigation bar for the school assist section.

A pothole reporting feature was also started on this day, built as part of the Community section. Users could flag potholes by location, view reports, and track fixes. The backend was connected to the database with proper authentication. The location input originally tried to use GPS, but GPS wasn't working reliably, so the input was replaced with a hierarchical dropdown: Province, then City, then Suburb, then a free-text Street field. This was more reliable and easier to use than asking someone to find their GPS coordinates.

The water dashboard was also started on this day — a page where users could see dam levels by province, active water alerts, and maintenance updates.

---

## 20–21 April 2026 — Career Data Expansion

A major career data rebuild happened during these days. The career cards were redesigned to be more informative and actionable. Each career was given comprehensive South African data: salary ranges, job demand by province, required subjects and APS scores, what a student in Grades 10–12 should be doing to work toward that career, and real South African examples — companies, internship programs, bursaries specific to that field.

Initially only a small set of careers was done thoroughly, then wired up and verified before expanding. Once the structure was confirmed working, the remaining careers were updated to the same standard. The final count reached 400 careers.

---

## 25–27 April 2026 — Bug Fixes, New Pages, and Navigation Overhaul

A dedicated session was run to fix a collection of persistent bugs: the quiz completion button wasn't working correctly in some states, the career cards that had been rebuilt needed to actually replace the old ones in the routing, and various mobile layout issues needed addressing.

On 26 April, several landing page improvements were made. A loading screen with animated morphing text (the words Discover, Plan, Elevate, Succeed cycling through) was added and refined — it initially only showed the first two words before ending, and the timing required several adjustments. The login and signup pages were redesigned to match the landing page's color scheme rather than using their own unrelated styles. The navbar spinning animation when opening and closing was fixed — it had been animating in a way that looked broken rather than intentional.

On 27 April, the Civics page, Tax and Budget calculator, Cost of Living tracker, and the School Assist Chat page were all added. Routing was updated to support all four. The chat page existed as a shell at this point — the AI backend connection wasn't working yet. The dashboard was further refined to remove sections that were showing placeholder data (upcoming dates that the user hadn't actually entered), and the navigation bar was updated to use the same design as the landing page across all feature sections.

A color palette audit was run — the site had accumulated too many stray colors from different sessions. Everything was brought back to blacks, greys, and whites.

---

## 1–3 May 2026 — Learning Modules and Study Library

New learning content was built: two Algebra modules for Grade 10 Term 1. The first covered introduction to equations, the second covered simultaneous linear equations. These were built as interactive lessons with guided practice, worked examples, and mastery tracking connected to the database so progress would persist between sessions.

The study library was consolidated so all learning material lived in one place. Content had accumulated in different locations as features were added, which made it hard to maintain and harder for users to navigate. Pulling it into one unified section cleaned this up.

Bugs in the progress tracking surfaced during testing — the mastery state for the first topic was showing correctly in the library but not on the dashboard. This was a data-fetching timing issue where the dashboard was reading the local state before the database had responded. Fixed by making the dashboard wait for the correct source.

Mobile display issues also appeared with the algebra content — equations that were too long for a small screen would wrap to a second line in a way that broke readability. The equations were reformatted to handle this gracefully without making the text smaller.

On 2 May, the water dashboard got a new chart design. The original showed all provinces in one crowded view. It was redesigned with a province selector so users could focus on one province at a time.

On 3 May, a broad polish pass was run across all pages — spacing, typography, card padding, layout rhythm. No single major feature, but the kind of work that makes an app feel finished rather than assembled.

---

## 7–8 May 2026 — Testing, Code Cleanup, and Pothole Feature Improvements

The pothole feature received several improvements on 8 May, including a fake report detection system and a user-flagging mechanism so other users could mark suspicious reports. A database error appeared during this — a column reference was ambiguous after a schema update. This was fixed by making the query fully qualified.

A complete codebase audit was run on 8 May. Pages and components that had been added to a flat folder structure were reorganized into subfolders by feature domain: school, community, careers, and so on. Dead code, stale routes, and files left over from earlier experiments were removed. All 31 end-to-end tests were fixed and passing after the reorganization.

---

## 11 May 2026 — Community Impact Removed, Declutter Pass

The Community Impact feature was removed from the site entirely on this date. It had been added in April, but on reflection it was adding complexity without clear value — students weren't the primary audience for a community impact reporting tool, and maintaining a separate authenticated feature for this purpose wasn't worth the overhead.

The school assist dashboard and calendar pages were decluttered on mobile. Both had accumulated content over multiple sessions and were showing too much information in too small a space on phone-sized screens.

FEATURES.md and CODEBASE_MAP.md were written to document what existed in the project and how the codebase was organized. This was necessary because the codebase had grown over two months and the reasoning behind some decisions wasn't obvious from the code alone.

---

## 13 May 2026 — Pothole Feature Removed, Focus Sharpened

The pothole reporting feature, built in April, was removed on 13 May.

The reasoning was about product focus. Prospect is a career and education guidance platform for high school students. A pothole reporting tool is a civic utility — useful, potentially, but unrelated to careers, education, or the decisions a Grade 10–12 student is trying to make. Keeping it in the platform made Prospect harder to explain and harder to develop with a clear direction. The platform had civic content that made sense — cost of living, load shedding status, exam dates, the civics guide — because these things directly affect students' daily lives and planning. Pothole reporting didn't clear that bar.

The project structure was cleaned up alongside this removal. Duplicate files, leftover planning documents, and stale markdown files that had accumulated over the development period were cleared out.

A full UI improvement session was also run on this day, applying the Impeccable design framework systematically across the site. The session focused on spacing, font sizing, layout rhythm, and ensuring the color palette was consistent with the landing page across every feature section. The chat feature had a typing bug found during this session — the text input wasn't responding correctly to keystrokes in some states — which was fixed.

The Gemini API key was tested during this session to check if the chat feature's AI backend would work. The test returned a 429 rate limit error — the free tier quota had been exhausted. This meant the chat's AI connection was effectively broken on the live site.

---

## 14 May 2026 — Community Section Rebuilt, Routing Fixes

The community section was rebuilt and properly structured on this day. A CommunityPage hub served as the entry point. A LoadSheddingPage was added — a real-time electricity stage tracker pulling live Eskom stage data, which is directly useful for South African students planning study sessions around power outages. The MatricExamDatesPage was added with the full 2026 NSC exam timetable and live countdown timers showing how many days remained until each exam period.

The rebuild caused routing problems. The community link on the nav bar returned a blank page, the auth system broke in places, and the school assist section briefly lost its nav bar entry. These were fixed systematically. Navigation across the site was verified end to end before moving forward.

The career quiz page, career cards, and other career section pages were improved with better typography, tighter spacing, and improved card layouts when a career was clicked and expanded. The TVET pages were also identified as needing work — the navigation within TVET was particularly inconsistent — and were addressed.

---

## 15 May 2026 — AI Integration, Scrapers, Final Polish, and Launch

The final day of active development was the most technically varied.

**Load shedding and water scrapers:** Automated data scrapers were set up for both the load shedding page and the water dashboard. These ran on a schedule via GitHub Actions, pulling live data from public sources and committing the updated JSON files to the repository, which Vercel would then automatically pick up and redeploy. The water dashboard had been using static placeholder data — this replaced it with data that would stay current.

**AI chat backend — three attempts:**

The first attempt was Google Gemini. An API key had been configured, but when tested it returned a 429 error — the free tier quota was fully exhausted. The chat was effectively broken on the live site with no working AI responses.

Rather than leaving the chat in a broken state, a predefined answer system was built immediately as a fallback. Seven detailed answers to the most common student questions were written and stored locally in the app. These returned instantly without any network call. For the majority of questions students were likely to ask, this made the chat feel functional even without a live AI connection.

The second attempt was Ollama — a tool for running AI models locally on your own machine. The llama3.2 model was downloaded (about 2GB) and ran successfully during development. A second model called llava was also downloaded (about 4.7GB) to handle image uploads, since llama3.2 is text-only. This worked perfectly on the developer's machine. The problem appeared when the site was deployed: Ollama runs as a local server on your own computer, listening on localhost. Every user on the live site was trying to connect to localhost on their own machine, which wasn't running Ollama. Every request failed. Ollama was a local development solution being used as if it were a cloud service — it couldn't work in that context.

The third attempt was Groq. Groq provides free cloud inference for llama3 models and is notably fast. An API key was created, added to the project environment variables and to Vercel's environment configuration, and the chat was updated to call Groq's API. The predefined answers were kept as the first layer — for the seven common questions, the answer still appeared instantly from the local store, with Groq silently upgrading it in the background if the response differed. Any question outside those seven was sent directly to Groq. The site was redeployed and the chat was verified working end to end on the live URL.

**UI and design final pass:** The Impeccable design framework was applied to the remaining pages that hadn't yet received a thorough pass — the TVET pages, the library, the calendar, and the community pages. The TVET navigation was redesigned with a dropdown approach so clicking TVET showed the main page but also revealed the sub-pages (colleges, funding, requirements, careers) without requiring a separate visible nav bar. The library page content was confirmed working — the two algebra topics were showing in the right place, not duplicated elsewhere.

**Community Impact page removed from auth:** All community pages were removed from requiring authentication. Previously, users had to sign in to access the Load Shedding page, Water Dashboard, Cost of Living, and Civics pages. This made no sense — these are informational pages with no user-specific data. The auth requirement was removed from all of them.

The Grade 10 Subject Selector was also removed from the landing page navigation on this day. It had been listed as a feature entry point but the feature was never fully built out to a shippable standard. Listing it caused confusion.

---

## Summary Table

| Period | Main Focus |
|---|---|
| 22–25 March | Data foundation, bursary database, research, project setup |
| 27–28 March | Landing page, framework switch from Next.js to React/Vite |
| 30–31 March | Core features, localStorage persistence, accessibility fixes |
| 3–7 April | Component integration, architecture cleanup, map bug fixes |
| 15–17 April | Product restructure, dashboard rebuild, Community Impact |
| 18 April | Partial reverts, image compression, TVET improvements |
| 19 April | Persistent login, pothole feature started, water dashboard started |
| 20–21 April | Career data expansion to 400 careers |
| 25–27 April | Bug fixes, new civic pages, loading screen, login page redesign |
| 1–3 May | Algebra learning modules, study library consolidation, water chart redesign |
| 7–8 May | Testing, codebase reorganization, pothole improvements |
| 11 May | Community Impact removed, declutter pass, documentation written |
| 13 May | Pothole feature removed, Gemini confirmed broken, design improvements |
| 14 May | Community section rebuilt, routing fixed, career pages improved |
| 15 May | Scrapers set up, Gemini failed, Ollama tried and failed, Groq deployed, final polish |

---

The full development period ran from 22 March to 15 May 2026 — 55 days. The platform launched with 245 bursaries, 400 career profiles with comprehensive South African data, a subject-to-career mapping tool, a study library with Grade 10 Algebra content, a full TVET section, civic guides, a cost of living tracker, load shedding tracking with live data, a water availability dashboard, NSC exam countdowns, a career quiz, and an AI chat assistant backed by Groq with local predefined answers as a reliability layer.
