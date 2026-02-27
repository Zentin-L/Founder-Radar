# Stack Research: Founder Radar

## Recommended Stack (2025)

### Frontend
| Technology | Version | Rationale | Confidence |
|---|---|---|---|
| **Next.js** | 15.x | SSR/SSG for performance, App Router, built-in API routes, React ecosystem | High |
| **TypeScript** | 5.x | Type safety critical for complex data models (startups, signals, scores) | High |
| **Recharts / Tremor** | Latest | Time-series charts for signal trends and momentum score visualization | High |
| **TanStack Query** | 5.x | Server state management for real-time feed data with auto-refresh | High |

### Backend (Data Pipelines)
| Technology | Version | Rationale | Confidence |
|---|---|---|---|
| **Python** | 3.12+ | Dominant for web scraping, data processing, ML pipelines | High |
| **FastAPI** | 0.110+ | High-performance async API, auto-generated OpenAPI docs | High |
| **Scrapy** | 2.11+ | Industrial-strength web scraping framework with built-in throttling | High |
| **Playwright** | 1.40+ | For JavaScript-heavy sites (LinkedIn); headless browser automation | High |
| **Celery + Redis** | Latest | Async task queue for background scraping jobs and signal processing | High |
| **APScheduler / Celery Beat** | Latest | Scheduled pipeline execution (daily/hourly signal collection) | Medium |

### Database & Storage
| Technology | Version | Rationale | Confidence |
|---|---|---|---|
| **PostgreSQL** | 16+ | Strong relational performance, JSONB for flexible signal data, proven at scale | High |
| **TimescaleDB extension** | Latest | Time-series optimization for signal history (hiring counts over time) | Medium |
| **Redis** | 7+ | Caching, task queue backend, real-time feed caching | High |

### Infrastructure
| Technology | Rationale | Confidence |
|---|---|---|
| **Docker + Docker Compose** | Consistent dev/prod environments, multi-service orchestration | High |
| **Vercel** (frontend) | Native Next.js hosting, edge functions, CDN | High |
| **Railway / Render** (backend) | Managed Python hosting, PostgreSQL, Redis | Medium |

### What NOT to Use
- **Django** — Overkill ORM for this use case; FastAPI is faster and more appropriate for API-first
- **MongoDB** — Relational data (startups → signals → scores) benefits from PostgreSQL's joins
- **Puppeteer** — Use Playwright instead; better cross-browser support and Python bindings
- **Airflow** — Too heavy for v1; Celery Beat handles scheduling well enough initially
