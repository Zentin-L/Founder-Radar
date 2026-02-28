# Phase 1: Foundation & Auth - Research

## Key Findings

### Monorepo Setup
- Use simple directory structure: `/frontend` (Next.js) and `/backend` (FastAPI) in root
- No need for Turborepo/pnpm workspaces since frontend (Node) and backend (Python) are different ecosystems
- Shared types via OpenAPI spec generation from FastAPI → TypeScript types via `openapi-typescript`
- Docker Compose for PostgreSQL + Redis only; run app services natively

### FastAPI + SQLAlchemy + Alembic
- **SQLAlchemy 2.0+** with async support via `asyncpg`
- **Alembic** with async migrations support
- Domain-driven structure: `backend/app/{domain}/` with `routes.py`, `models.py`, `schemas.py`, `services.py`
- Use Pydantic v2 for request/response schemas (built into FastAPI)
- Repository pattern optional for v1 — direct SQLAlchemy queries in services is fine

### JWT Auth with httpOnly Cookies
- Store JWT in httpOnly, secure, sameSite=Lax cookie
- FastAPI: Override `OAuth2PasswordBearer` to read from cookies instead of headers
- Next.js: Use API route handlers as proxy to forward cookie to FastAPI
- Short-lived access token (15-30 min) + longer refresh token (30 days) in separate cookie
- Hash passwords with `bcrypt` via `passlib`

### Next.js 15 Frontend
- App Router with Server Components by default
- Use `middleware.ts` for route protection (check cookie existence)
- TanStack Query for server state management
- Shadcn/ui for component library (accessible, customizable)

### Database Schema
- Use UUID primary keys for external-facing IDs
- Timestamps: `created_at`, `updated_at` on all tables
- User model: id, email, password_hash, email_verified, subscription_tier, sector_preferences, created_at, updated_at
- Session model not needed (stateless JWT)

### Security Considerations
- CORS: Configure FastAPI to allow frontend origin only
- CSRF: SameSite=Lax cookies provide adequate protection
- Rate limiting: Use `slowapi` on auth endpoints (login, register, password reset)
- Input validation: Pydantic handles this automatically

## Recommended Libraries

| Library | Purpose | Version |
|---|---|---|
| `fastapi` | API framework | 0.110+ |
| `sqlalchemy[asyncio]` | ORM | 2.0+ |
| `asyncpg` | Async PostgreSQL driver | Latest |
| `alembic` | Database migrations | Latest |
| `python-jose[cryptography]` | JWT encoding/decoding | Latest |
| `passlib[bcrypt]` | Password hashing | Latest |
| `pydantic-settings` | Environment config | Latest |
| `slowapi` | Rate limiting | Latest |
| `next` | Frontend framework | 15.x |
| `@tanstack/react-query` | Server state | 5.x |
| `openapi-typescript` | Type generation | Latest |

---
*Research completed: 2026-02-28*
