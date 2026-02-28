from celery.schedules import crontab

beat_schedule = {
    "collect-job-signals-12h": {
        "task": "app.signals.tasks.collect_job_signals_12h",
        "schedule": crontab(minute=0, hour="*/12"),
        "options": {"queue": "jobs"},
    },
    "collect-linkedin-signals-12h": {
        "task": "app.signals.tasks.collect_linkedin_signals_12h",
        "schedule": crontab(minute=10, hour="*/12"),
        "options": {"queue": "linkedin"},
    },
    "recompute-momentum-scores-12h": {
        "task": "app.scoring.tasks.recompute_momentum_scores_12h",
        "schedule": crontab(minute=30, hour="*/12"),
        "options": {"queue": "maintenance"},
    },
    "maintenance-pipeline-heartbeat": {
        "task": "app.signals.tasks.maintenance_pipeline_heartbeat",
        "schedule": crontab(minute="*/30"),
        "options": {"queue": "maintenance"},
    },
}
