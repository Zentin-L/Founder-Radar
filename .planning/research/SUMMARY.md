# Research Summary: Founder Radar

## Stack Recommendation

**Frontend**: Next.js 15 + TypeScript + Recharts/Tremor for data visualization
**Backend**: Python 3.12 + FastAPI + Scrapy + Playwright + Celery/Redis
**Database**: PostgreSQL 16 + TimescaleDB (time-series signals) + Redis (caching/queue)
**Infra**: Docker, Vercel (frontend), Railway/Render (backend)

**Key decision**: FastAPI over Django (lighter, faster, API-first). Celery Beat over Airflow (simpler for v1 scheduling).

## Table Stakes Features

- Startup profiles with core data (name, sector, stage, team size)
- Search and filter by sector/stage/location
- Individual startup detail pages
- User authentication and gated access
- Data freshness indicators
- CSV export

## Differentiators (Founder Radar's edge)

- **Real-time signal feed** — Not offered by Crunchbase/PitchBook
- **Momentum Score (0-100)** — Unique composite scoring from alternative signals
- **Hiring signal pipeline** — Job posting velocity tracking
- **LinkedIn growth pipeline** — Employee count and growth rate monitoring
- **User-submitted tracking** — Add any startup, auto-discover signals

## Watch Out For

1. **LinkedIn anti-scraping** (🔴 Critical) — Rate limiting, IP bans, CAPTCHAs. Use rotating proxies, public data only, consider third-party data providers as fallback
2. **Legal compliance** (🔴 Critical) — Only scrape public data, respect robots.txt, don't store personal data, get legal review
3. **Data quality** (🟡 High) — Show freshness timestamps, validate data, deduplication pipelines
4. **Scraper maintenance** (🟡 High) — Modular architecture, monitoring, automated tests for page structure changes
5. **Cold start** (🟡 High) — Seed with 7K startups from YC + Product Hunt before launch

## Architecture Insights

- **Separation of concerns**: Frontend (Next.js) → API (FastAPI) → Workers (Celery) → Scrapers
- **Queue-based scraping**: Decouple scraping from API serving; failures don't affect users
- **Build order**: Database → API → Frontend shell → Scrapers → Scoring → Feed UI → Polish

## Files

- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
