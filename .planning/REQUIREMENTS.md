# Requirements: Founder Radar

**Defined:** 2026-02-27
**Core Value:** VC analysts can instantly see which startups are showing unusual growth momentum

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across browser sessions
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: User can reset password via email link

### Startup Database

- [x] **DATA-01**: System stores ~7,000 startups seeded from YC directory, Product Hunt top launches, and curated sectors
- [x] **DATA-02**: Each startup has profile data: name, domain, sector, stage, founding year, description, team size
- [x] **DATA-03**: User can submit any startup URL to add it to the tracking database
- [x] **DATA-04**: System auto-discovers signals for user-submitted startups within 48 hours

### Signal Pipelines

- [x] **SIGNAL-01**: System monitors public job boards daily for job postings by tracked startups
- [x] **SIGNAL-02**: System calculates hiring velocity (rate of change in job posting count) per startup
- [x] **SIGNAL-03**: System monitors LinkedIn company pages for employee count changes
- [x] **SIGNAL-04**: System calculates LinkedIn growth rate (employee count delta over time) per startup
- [x] **SIGNAL-05**: Signal data is stored with timestamps for historical trend analysis

### Scoring Engine

- [x] **SCORE-01**: System calculates a Momentum Score (0-100) for each startup from hiring velocity + LinkedIn growth
- [x] **SCORE-02**: Momentum Scores are recalculated daily
- [x] **SCORE-03**: Score changes (up/down/stable) are tracked and displayed

### Signal Feed

- [x] **FEED-01**: User sees a real-time feed of startups sorted by momentum score (highest first)
- [x] **FEED-02**: Each feed card shows: startup name, sector, momentum score, key signal highlights, score change
- [x] **FEED-03**: User can filter feed by sector, stage, and score range
- [x] **FEED-04**: Feed auto-refreshes to show latest data

### Startup Dashboard

- [x] **DASH-01**: User can click a startup to view its detail page
- [x] **DASH-02**: Detail page shows signal history as time-series charts (hiring + LinkedIn)
- [x] **DASH-03**: Detail page shows momentum score trend over time
- [x] **DASH-04**: Detail page shows startup profile information

### Search & Discovery

- [x] **SRCH-01**: User can search startups by name
- [x] **SRCH-02**: User can filter startups by sector, stage, location, and score range
- [x] **SRCH-03**: Search results show momentum score and key signals

### Watchlists

- [ ] **WATCH-01**: User can add/remove startups to a personal watchlist
- [ ] **WATCH-02**: User can view their watchlist as a filtered feed
- [ ] **WATCH-03**: User receives email notification when a watched startup's momentum score spikes

### Data Export

- [ ] **EXPORT-01**: User can export search results or watchlist to CSV

## v2 Requirements

### Predictive Scoring

- **PREDICT-01**: System calculates a "Funding Likelihood" score (0-100%) predicting funding in next 3-6 months
- **PREDICT-02**: Prediction model trained on historical outcomes (signal data → actual funding events)

### Additional Signals

- **SIGNAL-V2-01**: System monitors Twitter/X for social media buzz about tracked startups
- **SIGNAL-V2-02**: System monitors Product Hunt for product launches
- **SIGNAL-V2-03**: System monitors domain registrations and web traffic changes

### Notifications

- **NOTIF-01**: User receives in-app notifications for signal spikes
- **NOTIF-02**: User can configure notification thresholds and preferences

### Team Collaboration

- **TEAM-01**: Multiple users can share watchlists within a fund
- **TEAM-02**: Users can add notes/comments to startup profiles

## Out of Scope

| Feature | Reason |
|---------|--------|
| CRM / deal pipeline management | Competes with Affinity; not core value prop |
| Individual contact information / email finder | Legal risk, not aligned with company-level tracking |
| Mobile app | Web-first approach; validate before mobile |
| Company financial data (revenue, burn rate) | Can't compete with PitchBook; not accessible publicly |
| Real-time chat or messaging | Not a communication platform |
| OAuth / social login | Email/password sufficient for v1 |
| Founder-facing analytics | Building for VC analysts first |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| DATA-01 | Phase 2 | Completed |
| DATA-02 | Phase 2 | Completed |
| DATA-03 | Phase 2 | Completed |
| DATA-04 | Phase 2 | Completed |
| SIGNAL-01 | Phase 3 | Completed |
| SIGNAL-02 | Phase 3 | Completed |
| SIGNAL-03 | Phase 3 | Completed |
| SIGNAL-04 | Phase 3 | Completed |
| SIGNAL-05 | Phase 3 | Completed |
| SCORE-01 | Phase 4 | Completed |
| SCORE-02 | Phase 4 | Completed |
| SCORE-03 | Phase 4 | Completed |
| FEED-01 | Phase 5 | Completed |
| FEED-02 | Phase 5 | Completed |
| FEED-03 | Phase 5 | Completed |
| FEED-04 | Phase 5 | Completed |
| DASH-01 | Phase 5 | Completed |
| DASH-02 | Phase 5 | Completed |
| DASH-03 | Phase 5 | Completed |
| DASH-04 | Phase 5 | Completed |
| SRCH-01 | Phase 5 | Completed |
| SRCH-02 | Phase 5 | Completed |
| SRCH-03 | Phase 5 | Completed |
| WATCH-01 | Phase 6 | Pending |
| WATCH-02 | Phase 6 | Pending |
| WATCH-03 | Phase 6 | Pending |
| EXPORT-01 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-27*
*Last updated: 2026-03-01 after Phase 5 execution*
