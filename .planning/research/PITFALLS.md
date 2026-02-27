# Pitfalls Research: Founder Radar

## Critical Pitfalls

### 1. LinkedIn Anti-Scraping Measures
**Severity**: 🔴 Critical
**Warning signs**: IP bans, CAPTCHAs appearing, account suspensions, empty responses
**Prevention**:
- Use rotating residential proxies (not datacenter IPs)
- Implement aggressive rate limiting (1-2 requests/minute per proxy)
- Add random delays between requests (2-10 seconds)
- Mimic human browsing patterns (headers, cookies, referrers)
- **Do NOT scrape while logged into LinkedIn accounts**
- Focus on publicly accessible company pages, not private profiles
- Consider using LinkedIn's public API or third-party data providers (Coresignal, Proxycurl) as fallback
**Phase**: Phase 4-5 (Signal Pipelines)

### 2. Legal and Compliance Risks
**Severity**: 🔴 Critical
**Warning signs**: Cease-and-desist letters, ToS violations, GDPR complaints
**Prevention**:
- Only scrape publicly available data (no login-wall content)
- Respect `robots.txt` files
- Don't store personal data (individual profiles); track company-level metrics only
- Implement data retention policies
- Add clear Terms of Service for your own platform
- Consider legal review before launch
- The hiQ Labs v. LinkedIn case (2022) established that scraping public data is generally permissible, but this is evolving
**Phase**: Phase 1 (Foundation) — establish legal framework early

### 3. Data Quality and Staleness
**Severity**: 🟡 High
**Warning signs**: Users reporting inaccurate scores, startups with stale data, momentum scores that don't match reality
**Prevention**:
- Show "last updated" timestamps prominently on every data point
- Implement data freshness checks — flag startups with stale signals
- Validate scraped data against known sources (cross-reference)
- Build confidence scores alongside momentum scores
- Deduplication pipeline for scraped data
**Phase**: Phase 4-5 (Signal Pipelines)

### 4. Scraper Maintenance Burden
**Severity**: 🟡 High
**Warning signs**: Scraping jobs failing silently, data gaps, increasing error rates
**Prevention**:
- Modular scraper architecture — separate site-specific parsing from pipeline logic
- Comprehensive monitoring and alerting for scraper health
- Automated tests that detect when page structures change
- Queue-based architecture so failed jobs can be retried
- Fallback data sources for each signal type
**Phase**: Phase 4-5 (Signal Pipelines)

### 5. "Cold Start" Problem — Seeding the Database
**Severity**: 🟡 High
**Warning signs**: Empty feed, low startup count, users find their portfolio companies missing
**Prevention**:
- Seed with curated high-quality sources (YC directory, PH top launches) before launch
- Prioritize data coverage for popular sectors (AI, fintech, healthtech)
- Allow user-submitted startups from day one
- Don't wait for perfect data — launch with partial signals and improve
**Phase**: Phase 3 (Startup Database)

### 6. Momentum Score Gaming / False Positives
**Severity**: 🟡 Medium
**Warning signs**: Startups gaming job postings, fake LinkedIn employees, scores not correlating with reality
**Prevention**:
- Use multiple signals (even within v1, hiring + LinkedIn gives two vectors)
- Weight signal consistency over raw magnitude
- Add anomaly detection for suspicious spikes
- Design score to decay if signals aren't sustained
**Phase**: Phase 6 (Scoring Engine)

### 7. Scaling Scraping Infrastructure
**Severity**: 🟢 Medium (v1), 🟡 High (v2+)
**Warning signs**: Scraping jobs taking too long, backlog growing, proxy costs spiking
**Prevention**:
- Start with Celery workers on a single machine for v1 (~7K startups)
- Design for horizontal scaling from the start (queue-based)
- Monitor cost per startup per signal
- Set scraping frequency based on startup activity (don't scrape dormant startups daily)
**Phase**: Phase 4-5 initially, revisit at scale
