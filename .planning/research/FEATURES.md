# Features Research: Founder Radar

## Competitive Landscape

Key competitors: Crunchbase, PitchBook, Dealroom, Harmonic.ai, Tracxn, Exploding Topics, Extruct AI

## Feature Categories

### Table Stakes (Must have or users leave)
| Feature | Complexity | Notes |
|---|---|---|
| Startup profiles (name, sector, founding date, team size) | Medium | Core data entity |
| Search and filter by sector/stage/location | Medium | Primary discovery mechanism |
| Individual startup detail page | Medium | Signal history, trends, team info |
| User authentication and accounts | Low | Gated access for subscribers |
| Data freshness indicators | Low | Users need to trust data recency |
| Export to CSV | Low | Analysts need data in spreadsheets |

### Differentiators (Competitive advantage for Founder Radar)
| Feature | Complexity | Notes |
|---|---|---|
| **Real-time signal feed** | High | Core UX — Bloomberg for startups. Not offered by Crunchbase/PitchBook |
| **Momentum Score (0-100)** | High | Composite hiring velocity + LinkedIn growth. Unique scoring |
| **Hiring signal pipeline** | High | Job posting monitoring, velocity calculation |
| **LinkedIn growth pipeline** | High | Employee count tracking, growth rate |
| **Custom watchlists with alerts** | Medium | "Track this startup" + email/in-app notifications |
| **User-submitted startup tracking** | Medium | Add any startup, auto-discover signals in 48h |
| **Trend detection** | High | Surface startups with sudden signal spikes |

### Anti-Features (Things to deliberately NOT build)
| Feature | Why NOT |
|---|---|
| Full CRM / deal pipeline | Compete with Affinity, not our value prop |
| Contact info / email finder | Legal risk, not core value |
| Fundraising predictions (v1) | Need historical outcome data first |
| Mobile app (v1) | Web-first, validate before mobile |
| Real-time chat / messaging | Not a communication tool |
| Company financial data | Can't compete with PitchBook on depth |

### Dependencies Between Features
```
Startup Database → Signal Pipelines → Momentum Score → Signal Feed
                                                     → Startup Dashboard
User Auth → Watchlists → Alerts
Search/Filter ← Startup Database
```
