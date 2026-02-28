from datetime import datetime
import json
from pathlib import Path

from app.database import async_session
from app.signals.services import create_pipeline_run


async def log_pipeline_run(
    pipeline: str,
    task_name: str,
    status: str,
    started_at: datetime,
    finished_at: datetime,
    processed_count: int = 0,
    success_count: int = 0,
    failed_count: int = 0,
    skipped_count: int = 0,
    error_message: str | None = None,
) -> None:
    duration_ms = max(int((finished_at - started_at).total_seconds() * 1000), 0)
    async with async_session() as session:
        await create_pipeline_run(
            session,
            pipeline=pipeline,
            task_name=task_name,
            status=status,
            started_at=started_at,
            finished_at=finished_at,
            processed_count=processed_count,
            success_count=success_count,
            failed_count=failed_count,
            skipped_count=skipped_count,
            duration_ms=duration_ms,
            error_message=error_message,
        )
        await session.commit()


async def log_dead_letter(
    pipeline: str,
    task_name: str,
    payload: dict,
    error_message: str,
) -> None:
    dead_letter_path = Path(__file__).resolve().parents[2] / "data" / "signal_dead_letters.jsonl"
    dead_letter_path.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "recorded_at": datetime.utcnow().isoformat() + "Z",
        "pipeline": pipeline,
        "task_name": task_name,
        "error_message": error_message,
        "payload": payload,
    }
    with dead_letter_path.open("a", encoding="utf-8") as file:
        file.write(json.dumps(entry) + "\n")
