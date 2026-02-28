# Phase 2: Startup Database - Research

## Key Findings

### Data Sources for Seeding
- **YC Directory** (ycombinator.com/companies): Public API-like listing, ~4,500+ companies. Filterable. Scrape with Playwright or direct API.
- **Product Hunt API**: GraphQL API available. Top launches per year/month. ~1,500-2,000 relevant startups.
- **Curated hot sectors**: Manual CSV of ~500-1,000 startups from Crunchbase free tier, AngelList, and sector-specific lists.

### URL Enrichment Strategy
- Use `httpx` to fetch homepage HTML
- Parse `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">` (logo/favicon)
- Extract domain from URL for deduplication
- LinkedIn company page: Construct search URL `linkedin.com/company/{domain-name}` — verify with HEAD request

### Startup API Design
- **GET /api/startups** — paginated list with filters (sector, stage, score range)
- **GET /api/startups/{id}** — single startup detail
- **POST /api/startups/submit** — URL-only submission (auth required)
- **GET /api/startups/search?q=** — name search with ranking
- Pagination: cursor-based for infinite scroll, limit 50 per page

### Submission Limits
- Track per-user submission count in database
- Free tier: 10 max (check before insert)
- Pro tier: unlimited
- Return 403 with upgrade message when limit hit

---
*Research completed: 2026-02-28*
