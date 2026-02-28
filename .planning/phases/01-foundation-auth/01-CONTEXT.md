# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up project infrastructure (Next.js + FastAPI + PostgreSQL), database schema, and user authentication. Users can sign up, log in, log out, and reset password. The foundation is ready for data and features in subsequent phases.

</domain>

<decisions>
## Implementation Decisions

### Auth flow & session handling
- JWT tokens stored in httpOnly cookies (stateless, no server-side session store)
- 30-day session duration before re-login required
- Standard password requirements — minimum 8 characters, no other restrictions
- Multi-device login allowed — analysts may use work + home computers simultaneously

### Sign-up experience
- Free tier with limits — users see a limited feed (e.g., top 10 startups) for free; full access requires subscription
- Email verification deferred — let users in immediately after sign-up, show "verify your email" banner. Block certain features (watchlist alerts) until verified
- Sector selection onboarding — after registration, ask which sectors they follow (AI, fintech, healthtech, etc.) to personalize the feed
- Minimal sign-up form — email + password only. Collect name/company later in settings.

### Project structure
- Monorepo — single repository with `/frontend` (Next.js) and `/backend` (Python/FastAPI) directories
- Domain-driven backend — organize by domain: `/auth`, `/startups`, `/signals`, `/scoring`. Each domain has its own routes, models, and services
- Alembic for database migrations — version-controlled, Python-standard migration management
- Docker for DB only — PostgreSQL and Redis run in Docker containers, frontend and backend services run natively for faster dev iteration

### Claude's Discretion
- Dashboard layout shell (sidebar vs top nav, dark/light mode) — not discussed, Claude can decide
- Error page styling and copy
- Loading states and skeleton screens
- Exact API response formats
- Password reset email template design

</decisions>

<specifics>
## Specific Ideas

- Free tier should feel like a "taste" of the product — enough to see the value, not enough to replace paying
- Sector selection should feel quick (multi-select chips, not a long form) — get users to the feed fast
- Monorepo should have clear separation — frontend and backend should feel like independent projects that happen to live together

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-02-28*
