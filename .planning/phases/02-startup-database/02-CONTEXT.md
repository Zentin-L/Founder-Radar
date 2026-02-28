# Phase 2: Startup Database - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Seed ~7,000 startups from curated sources, build startup CRUD API, enable user-submitted startup tracking, and auto-enrich startup profiles from URLs.

</domain>

<decisions>
## Implementation Decisions

### Seeding Strategy
- **Mix approach**: Script YC directory + Product Hunt API for bulk data; manually curate "hot sectors" list for quality coverage
- **Sector taxonomy**: ~10 broad categories matching onboarding (AI/ML, Fintech, Healthtech, SaaS/B2B, E-commerce, Climate, Cybersecurity, Edtech, Other)
- **Stage classification**: Funding-based stages (Pre-seed, Seed, Series A, Series B+) — standard VC language
- **Deduplication**: Domain-based matching — same website domain = same company

### Startup Submission Flow
- **Input**: URL only — user pastes company website, system extracts name/sector/description automatically. Lowest friction.
- **Approval**: Instant add — visible immediately to submitter, signal discovery queued automatically. No moderation.
- **Signal discovery**: Best-effort — queued for next scraping cycle (~24-48h). Show "signals pending" badge in UI.
- **Submission limits**: Free tier = 10 startups max, Pro tier = unlimited. Upsell lever.

### Data Enrichment
- **Auto-enrichment**: Basic metadata from URL — company name, description, favicon/logo from homepage meta tags. Fast and reliable.
- **Missing data**: Show with gaps — display whatever we have, show "—" for missing fields. Never hide startups due to incomplete data.
- **LinkedIn linking**: Auto-search using company name/domain to find LinkedIn company page programmatically. Store LinkedIn URL for signal pipeline.
- **Data refresh**: Once at creation — enrich when added, don't re-fetch. Profile data is mostly static for v1.

### Claude's Discretion
- Startup browse/list UI design (table vs cards, columns, pagination)
- Seeding script architecture and error handling
- Meta tag parsing library choice
- LinkedIn search implementation details
- API pagination strategy
- Startup detail page layout

</decisions>

<deferred>
## Deferred Ideas

- Deep extraction (team size, tech stack, social links) — v2
- Monthly data re-enrichment — v2
- Moderation queue for user submissions — if spam becomes an issue
- Sub-sector taxonomy — v2 if users need more granularity

</deferred>

---

*Phase: 02-startup-database*
*Context gathered: 2026-02-28 via discuss-phase*
