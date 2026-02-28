import asyncio
from datetime import datetime, UTC

from app.database import async_session
from app.signals.health import log_pipeline_run, log_dead_letter
from app.signals.jobs_scraper import collect_job_signals
from app.signals.linkedin_scraper import collect_linkedin_signals
from app.workers.celery_app import celery_app


def _run(coro):
    return asyncio.run(coro)


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def collect_job_signals_12h(self):
    started_at = datetime.now(UTC)
    stats = {"processed": 0, "success": 0, "failed": 0, "skipped": 0}
    error_message = None
    status = "success"

    try:
        async def _execute():
            async with async_session() as session:
                result = await collect_job_signals(session)
                await session.commit()
                return result

        stats = _run(_execute())
    except Exception as error:
        status = "failed"
        error_message = str(error)
        raise
    finally:
        finished_at = datetime.now(UTC)
        _run(
            log_pipeline_run(
                pipeline="jobs",
                task_name="collect_job_signals_12h",
                status=status,
                started_at=started_at,
                finished_at=finished_at,
                processed_count=stats["processed"],
                success_count=stats["success"],
                failed_count=stats["failed"],
                skipped_count=stats["skipped"],
                error_message=error_message,
            )
        )
        if error_message:
            _run(
                log_dead_letter(
                    pipeline="jobs",
                    task_name="collect_job_signals_12h",
                    payload={"stats": stats},
                    error_message=error_message,
                )
            )

    return stats


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def collect_linkedin_signals_12h(self):
    started_at = datetime.now(UTC)
    stats = {"processed": 0, "success": 0, "failed": 0, "skipped": 0}
    error_message = None
    status = "success"

    try:
        async def _execute():
            async with async_session() as session:
                result = await collect_linkedin_signals(session)
                await session.commit()
                return result

        stats = _run(_execute())
    except Exception as error:
        status = "failed"
        error_message = str(error)
        raise
    finally:
        finished_at = datetime.now(UTC)
        _run(
            log_pipeline_run(
                pipeline="linkedin",
                task_name="collect_linkedin_signals_12h",
                status=status,
                started_at=started_at,
                finished_at=finished_at,
                processed_count=stats["processed"],
                success_count=stats["success"],
                failed_count=stats["failed"],
                skipped_count=stats["skipped"],
                error_message=error_message,
            )
        )
        if error_message:
            _run(
                log_dead_letter(
                    pipeline="linkedin",
                    task_name="collect_linkedin_signals_12h",
                    payload={"stats": stats},
                    error_message=error_message,
                )
            )

    return stats


@celery_app.task
def maintenance_pipeline_heartbeat():
    started_at = datetime.now(UTC)
    finished_at = datetime.now(UTC)
    _run(
        log_pipeline_run(
            pipeline="maintenance",
            task_name="maintenance_pipeline_heartbeat",
            status="success",
            started_at=started_at,
            finished_at=finished_at,
            processed_count=0,
            success_count=0,
            failed_count=0,
            skipped_count=0,
        )
    )
    return {"status": "ok"}
