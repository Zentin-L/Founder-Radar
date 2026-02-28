from celery import Celery

from app.config import get_settings
from app.workers.schedules import beat_schedule

settings = get_settings()

celery_app = Celery(
    "founder_radar",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.signals.tasks", "app.scoring.tasks"],
)

celery_app.conf.update(
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_time_limit=180,
    task_soft_time_limit=150,
    task_default_retry_delay=30,
    task_routes={
        "app.signals.tasks.collect_job_signals_12h": {"queue": "jobs"},
        "app.signals.tasks.collect_linkedin_signals_12h": {"queue": "linkedin"},
        "app.scoring.tasks.recompute_momentum_scores_12h": {"queue": "maintenance"},
        "app.signals.tasks.maintenance_pipeline_heartbeat": {"queue": "maintenance"},
    },
    worker_prefetch_multiplier=1,
    beat_schedule=beat_schedule,
    timezone="UTC",
)
