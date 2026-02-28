# Backend Runbook

## Signal Pipelines (Phase 3)

### Start infrastructure

```bash
docker-compose up -d postgres redis celery-worker celery-beat
```

### Run API server

```bash
cd backend
uvicorn app.main:app --reload
```

### Signal endpoints

- `GET /api/signals/health`
- `GET /api/signals/hiring/{startup_id}`
- `GET /api/signals/linkedin/{startup_id}`
- `GET /api/signals/{startup_id}`

### Backfill historical signals

Dry run:

```bash
cd backend
python -m scripts.backfill_signals --days 30 --interval-hours 12 --dry-run
```

Apply mode:

```bash
cd backend
python -m scripts.backfill_signals --days 30 --interval-hours 12
```

Resumable checkpoint file defaults to `backend/data/signal_backfill_checkpoint.json`.

### Health report CLI

```bash
cd backend
python -m scripts.signal_health_report
```

### Recompute scores once

```bash
cd backend
python -m scripts.recompute_scores_once
```

### Dead-letter log

Failed task payloads are appended to:

- `backend/data/signal_dead_letters.jsonl`
