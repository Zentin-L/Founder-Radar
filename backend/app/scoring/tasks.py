import asyncio
from datetime import datetime, UTC

from app.database import async_session
from app.scoring.services import recompute_all_startup_scores
from app.signals.health import log_dead_letter, log_pipeline_run
from app.workers.celery_app import celery_app


def _run(coro):
    return asyncio.run(coro)


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def recompute_momentum_scores_12h(self):
    started_at = datetime.now(UTC)
    stats = {"processed": 0, "success": 0, "failed": 0}
    status = "success"
    error_message = None

    try:
        async def _execute():
            async with async_session() as session:
                result = await recompute_all_startup_scores(session)
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
                pipeline="scoring",
                task_name="recompute_momentum_scores_12h",
                status=status,
                started_at=started_at,
                finished_at=finished_at,
                processed_count=stats["processed"],
                success_count=stats["success"],
                failed_count=stats["failed"],
                skipped_count=max(stats["processed"] - stats["success"] - stats["failed"], 0),
                error_message=error_message,
            )
        )
        if error_message:
            _run(
                log_dead_letter(
                    pipeline="scoring",
                    task_name="recompute_momentum_scores_12h",
                    payload={"stats": stats},
                    error_message=error_message,
                )
            )

    return stats
