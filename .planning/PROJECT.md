# Founder Radar

## What This Is

Founder Radar is a real-time signal feed that helps VC analysts and associates discover early-stage startups showing breakout growth signals before they raise funding. It monitors hiring spikes and LinkedIn growth to generate a Momentum Score, surfacing which startups are heating up right now — like a Bloomberg terminal for startup deal sourcing.

## Core Value

VC analysts can instantly see which startups are showing unusual growth momentum, so they can reach out before the funding round is announced.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Real-time signal feed showing startups with unusual hiring + LinkedIn growth activity
- [ ] Momentum Score (0-100) for each tracked startup based on hiring velocity + LinkedIn growth
- [ ] Startup database seeded with ~7,000 companies (YC alumni, top Product Hunt launches, curated hot sectors)
- [ ] Analyst can add any startup to track; system auto-discovers signals within 48 hours
- [ ] Job posting signal pipeline — scrape/monitor public job boards for hiring spikes
- [ ] LinkedIn growth signal pipeline — monitor employee count and growth rate
- [ ] Individual startup dashboard with signal history and score trends
- [ ] User authentication and subscription gating
- [ ] Subscription-based monetization for investors

### Out of Scope

- Mobile app — Web-first; mobile deferred to post-v1
- Funding Likelihood prediction model — Requires 6-12 months of historical outcome data to train; v2 feature
- Social media buzz tracking (Twitter/X) — Deferred to post-v1, starting with 2 signals
- Product Hunt / domain registration monitoring — Deferred to post-v1
- AngelList / broader scraping — Adding once we have revenue
- Founder-facing analytics — Building for VC analysts first

## Context

- **Target users**: VC analysts and associates doing deal sourcing at funds
- **Data strategy**: Start with two highest-signal, most accessible data sources (job postings + LinkedIn), expand after validating product-market fit
- **Seeding strategy**: ~7,000 startups from YC directory, top Product Hunt launches, and manually curated hot sectors — all free to compile
- **Scoring v1**: Momentum Score is a composite of hiring velocity + LinkedIn growth. No ML prediction yet — that's v2 after collecting outcome data
- **Scoring v2 vision**: After 6-12 months of data, layer on "Funding Likelihood" prediction (e.g., "78% likely to raise in next 3-6 months") — this becomes the competitive moat

## Constraints

- **Tech Stack**: Next.js frontend, Python backend (data pipelines + scoring), PostgreSQL database
- **Data Access**: Must use publicly accessible data sources only for v1 (no paid APIs initially)
- **Signal Count**: V1 limited to 2 signals (job postings + LinkedIn) to keep scope manageable
- **Seed Size**: ~7,000 startups initial dataset — must be large enough to be useful, small enough to curate

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| VC analysts as primary user | Clearest buyer persona, willing to pay for deal flow | — Pending |
| Signal feed as core UX | Analysts want a Bloomberg-style real-time view, not a search tool | — Pending |
| Start with 2 signals only | Nail the pipeline quality before expanding; hiring + LinkedIn are strongest predictors | — Pending |
| Momentum Score before prediction | Can calculate from day one without training data; prediction requires historical outcomes | — Pending |
| Seed with YC + PH + curated | Free, high-quality initial dataset; no paid data sources needed | — Pending |
| Full-stack web app | Need polished dashboard UX to justify subscription pricing | — Pending |

---
*Last updated: 2026-02-27 after initialization*
