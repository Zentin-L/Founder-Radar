"""
Run signal pipelines once and record health telemetry.
"""
import asyncio
from datetime import datetime, UTC

from app.database import async_session
from app.signals.health import log_pipeline_run
from app.signals.jobs_scraper import collect_job_signals
from app.signals.linkedin_scraper import collect_linkedin_signals


async def run_jobs() -> None:
    started_at = datetime.now(UTC)
    stats = {"processed": 0, "success": 0, "failed": 0, "skipped": 0}
    status = "success"
    error_message = None

    try:
        async with async_session() as session:
            stats = await collect_job_signals(session)
            await session.commit()
    except Exception as error:
        status = "failed"
        error_message = str(error)

    await log_pipeline_run(
        pipeline="jobs",
        task_name="collect_job_signals_12h",
        status=status,
        started_at=started_at,
        finished_at=datetime.now(UTC),
        processed_count=stats["processed"],
        success_count=stats["success"],
        failed_count=stats["failed"],
        skipped_count=stats["skipped"],
        error_message=error_message,
    )
    print("jobs", stats, status)


async def run_linkedin() -> None:
    started_at = datetime.now(UTC)
    stats = {"processed": 0, "success": 0, "failed": 0, "skipped": 0}
    status = "success"
    error_message = None

    try:
        async with async_session() as session:
            stats = await collect_linkedin_signals(session)
            await session.commit()
    except Exception as error:
        status = "failed"
        error_message = str(error)

    await log_pipeline_run(
        pipeline="linkedin",
        task_name="collect_linkedin_signals_12h",
        status=status,
        started_at=started_at,
        finished_at=datetime.now(UTC),
        processed_count=stats["processed"],
        success_count=stats["success"],
        failed_count=stats["failed"],
        skipped_count=stats["skipped"],
        error_message=error_message,
    )
    print("linkedin", stats, status)


async def main() -> None:
    await run_jobs()
    await run_linkedin()


if __name__ == "__main__":
    asyncio.run(main())
