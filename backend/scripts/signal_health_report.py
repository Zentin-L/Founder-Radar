"""
Print recent signal pipeline health.
Run: cd backend && python -m scripts.signal_health_report
"""
import asyncio

from app.database import async_session
from app.signals.services import get_pipeline_health_snapshot


async def report() -> None:
    async with async_session() as session:
        runs = await get_pipeline_health_snapshot(session)

    if not runs:
        print("No pipeline runs recorded yet.")
        return

    print("Signal Pipeline Health")
    print("=" * 60)
    for run in runs:
        failure_rate = (run.failed_count / run.processed_count * 100) if run.processed_count else 0
        alert_level = "critical" if failure_rate >= 50 else "warning" if failure_rate >= 20 else "ok"
        print(f"Pipeline: {run.pipeline}")
        print(f"  Task: {run.task_name}")
        print(f"  Status: {run.status.value}")
        print(f"  Alert level: {alert_level}")
        print(f"  Processed: {run.processed_count} | Success: {run.success_count} | Failed: {run.failed_count} | Skipped: {run.skipped_count}")
        print(f"  Failure rate: {failure_rate:.2f}%")
        print(f"  Started: {run.started_at}")
        print(f"  Finished: {run.finished_at}")
        if run.error_message:
            print(f"  Error: {run.error_message}")
        print("-" * 60)


if __name__ == "__main__":
    asyncio.run(report())
