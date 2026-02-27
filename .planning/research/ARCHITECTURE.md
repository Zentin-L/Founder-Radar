# Architecture Research: Founder Radar

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  Signal Feed │ Startup Dashboard │ Search │ Watchlists       │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────────────────┐
│                   API LAYER (FastAPI)                         │
│  Feed API │ Search API │ Startup API │ Auth API │ Webhook    │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼─────┐ ┌─────▼─────┐
│  PostgreSQL  │ │   Redis   │ │  Celery   │
│  (Primary)   │ │  (Cache/  │ │  Workers  │
│              │ │   Queue)  │ │           │
└──────────────┘ └───────────┘ └─────┬─────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────▼─────┐  ┌──────▼──────┐  ┌─────▼─────┐
              │ Job Board  │  │  LinkedIn   │  │  Scoring  │
              │ Scraper    │  │  Scraper    │  │  Engine   │
              └────────────┘  └─────────────┘  └───────────┘
```

## Component Boundaries

### Frontend (Next.js)
- **Responsibility**: UI rendering, client-side state, API consumption
- **Talks to**: API Layer only (never directly to DB or scrapers)
- **Key pages**: Signal feed, startup detail, search/explore, watchlist, settings

### API Layer (FastAPI)
- **Responsibility**: Business logic, authentication, data access, rate limiting
- **Talks to**: PostgreSQL (reads/writes), Redis (caching), Celery (job dispatch)
- **Key endpoints**: `/feed`, `/startups`, `/search`, `/watchlists`, `/auth`

### Data Collection Workers (Celery)
- **Responsibility**: Scheduled scraping, signal processing, score calculation
- **Talks to**: External websites (scraping), PostgreSQL (writes), Redis (queue)
- **Isolation**: Workers run independently, failures don't affect API

### Scoring Engine
- **Responsibility**: Calculate Momentum Score from raw signals
- **Input**: Raw hiring data + LinkedIn employee counts over time
- **Output**: 0-100 score per startup, updated daily
- **Algorithm (v1)**: Weighted composite of hiring velocity (rate of change in job postings) + LinkedIn employee growth rate

## Data Flow

```
1. Celery Beat triggers scheduled scraping jobs (daily/hourly)
2. Job Board Scraper → extracts job postings → stores in raw_signals table
3. LinkedIn Scraper → extracts employee counts → stores in raw_signals table
4. Scoring Engine → reads raw_signals → computes momentum_score → stores in startups table
5. API reads startups + signals → serves to frontend
6. Frontend displays signal feed sorted by momentum/recency
```

## Database Schema (Core)

```
startups (id, name, domain, sector, stage, founded_year, description, momentum_score, score_updated_at)
signals (id, startup_id, signal_type, value, previous_value, delta, collected_at)
signal_snapshots (id, startup_id, signal_type, value, snapshot_date)  -- daily snapshots for trends
users (id, email, password_hash, subscription_tier, created_at)
watchlists (id, user_id, startup_id, created_at)
```

## Suggested Build Order

1. **Database + core models** (startups, signals)
2. **API layer** (CRUD for startups, basic auth)
3. **Frontend shell** (layout, auth pages, empty feed)
4. **Job posting scraper** (first signal pipeline)
5. **LinkedIn scraper** (second signal pipeline)
6. **Scoring engine** (momentum score calculation)
7. **Signal feed UI** (connect frontend to real data)
8. **Search/filter + startup detail pages**
9. **Watchlists + user features**
10. **Polish + deployment**
