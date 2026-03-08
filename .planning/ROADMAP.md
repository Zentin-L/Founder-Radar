# Roadmap: Founder Radar v1.0

**Phases:** 6 | **Requirements:** 31 | **Depth:** Deep

## Overview

| # | Phase | Goal | Requirements | Plans |
|---|-------|------|--------------|-------|
| 1 | Foundation & Auth | Project scaffolding, database, authentication | AUTH-01 to AUTH-04 | 0/3 |
| 2 | Startup Database | Seed database, startup CRUD, user submissions | DATA-01 to DATA-04 | 3/3 |
| 3 | Signal Pipelines | Job posting + LinkedIn scraping and processing | SIGNAL-01 to SIGNAL-05 | 4/4 |
| 4 | Scoring Engine | Momentum Score calculation and tracking | SCORE-01 to SCORE-03 | 2/2 |
| 5 | Feed & Dashboard | Signal feed, startup detail pages, search | FEED-01 to FEED-04, DASH-01 to DASH-04, SRCH-01 to SRCH-03 | 5/5 |
| 6 | 3D Marketing Site & Launch | Public marketing experience, conversion funnel, launch ops | MKT-01 to MKT-04 | 6/6 |

---

## Phase 1: Foundation & Auth
**Goal:** Set up project infrastructure, database schema, and user authentication so the core platform is ready for data and features.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04

**Success Criteria:**
1. Next.js frontend boots with basic layout and routing
2. FastAPI backend serves API endpoints with OpenAPI docs
3. PostgreSQL database is running with core schema (startups, signals, users)
4. User can sign up, log in, log out, and reset password
5. Auth tokens persist across browser refresh

---

## Phase 2: Startup Database
**Goal:** Build the startup data layer — seed ~7,000 startups and enable users to submit new startups for tracking.

**Requirements:** DATA-01, DATA-02, DATA-03, DATA-04

**Success Criteria:**
1. Database seeded with ~7,000 startups from YC, Product Hunt, and curated sources
2. Each startup has complete profile data (name, domain, sector, stage, etc.)
3. User can submit a startup URL via the frontend
4. Submitted startups are queued for signal discovery within 48 hours
5. Startup list is browsable in the frontend

---

## Phase 3: Signal Pipelines
**Goal:** Build the two core data pipelines — job posting monitoring and LinkedIn employee growth tracking — with reliable scheduling and error handling.

**Requirements:** SIGNAL-01, SIGNAL-02, SIGNAL-03, SIGNAL-04, SIGNAL-05

**Success Criteria:**
1. Celery workers scrape job boards daily for tracked startups
2. Hiring velocity (rate of change) is calculated per startup
3. LinkedIn company pages are monitored for employee count changes
4. LinkedIn growth rate is calculated per startup
5. All signal data is stored with timestamps and queryable via API
6. Scraper health monitoring is in place (error rates, success rates)

---

## Phase 4: Scoring Engine
**Goal:** Calculate and maintain the Momentum Score (0-100) for every tracked startup, updating daily.

**Requirements:** SCORE-01, SCORE-02, SCORE-03

**Success Criteria:**
1. Momentum Score algorithm produces 0-100 scores from hiring velocity + LinkedIn growth
2. Scores are recalculated daily via scheduled job
3. Score changes (up/down/flat) are tracked and available via API
4. Score distribution makes sense (not all 0s or all 100s)

---

## Phase 5: Feed & Dashboard UI
**Goal:** Build the core user experience — the signal feed, startup detail pages, and search/filter capabilities.

**Requirements:** FEED-01, FEED-02, FEED-03, FEED-04, DASH-01, DASH-02, DASH-03, DASH-04, SRCH-01, SRCH-02, SRCH-03

**Success Criteria:**
1. Signal feed displays startups sorted by momentum score with auto-refresh
2. Feed cards show startup name, sector, score, signal highlights, and score change
3. User can filter feed by sector, stage, and score range
4. Clicking a startup opens a detail page with signal history charts
5. Detail page shows momentum score trend as a time-series chart
6. User can search startups by name with instant results
7. Search supports filtering by sector, stage, location, and score range

---

## Phase 6: 3D Marketing Site & Launch
**Goal:** Build a premium public website (`foundradar.com`) with reactive 3D storytelling that converts visitors into qualified beta and paid pipeline.

**Requirements:** MKT-01, MKT-02, MKT-03, MKT-04

**Success Criteria:**
1. Marketing page includes required sections (Hero, Problem, Solution, How it Works, Social Proof, Pricing, Request Access)
2. 3D scene architecture supports performant scroll-driven camera choreography with graceful fallbacks
3. Mobile and Safari users receive stable tiered experience (full/lite/static) without blocking conversion
4. Accessibility baseline is met (reduced motion, keyboard navigation, screen reader alternatives, skip links)
5. Request access funnel includes sector selection, email verification flow, and analytics instrumentation
6. Site is launch-ready on Vercel with SEO metadata and operational runbook

---

*Roadmap created: 2026-02-27*
*Last updated: 2026-03-01 after Phase 6 execution*
