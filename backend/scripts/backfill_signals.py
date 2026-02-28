"""
Backfill startup signals for a historical window.
Run: cd backend && python -m scripts.backfill_signals --days 30
"""
import argparse
import asyncio
import json
from pathlib import Path
from datetime import datetime, timedelta, UTC

from app.database import async_session
from app.signals.jobs_scraper import collect_job_signals
from app.signals.linkedin_scraper import collect_linkedin_signals


def _load_checkpoint(checkpoint_file: Path) -> int:
    if not checkpoint_file.exists():
        return 0
    data = json.loads(checkpoint_file.read_text(encoding="utf-8"))
    return int(data.get("next_index", 0))


def _save_checkpoint(checkpoint_file: Path, next_index: int) -> None:
    checkpoint_file.parent.mkdir(parents=True, exist_ok=True)
    checkpoint_file.write_text(json.dumps({"next_index": next_index}), encoding="utf-8")


async def run_backfill(days: int, dry_run: bool, interval_hours: int, checkpoint_file: Path) -> None:
    now = datetime.now(UTC)
    snapshots: list[datetime] = []
    total_steps = max(int((days * 24) / interval_hours), 1)
    for step in range(total_steps, 0, -1):
        snapshots.append(now - timedelta(hours=step * interval_hours))

    start_index = _load_checkpoint(checkpoint_file)
    async with async_session() as session:
        for index, snapshot_at in enumerate(snapshots[start_index:], start=start_index):
            print(f"Backfilling snapshot {index + 1}/{len(snapshots)} at {snapshot_at.isoformat()}...")

            job_stats = await collect_job_signals(session, collected_at=snapshot_at)
            linkedin_stats = await collect_linkedin_signals(session, collected_at=snapshot_at)

            print(f"  Jobs: {job_stats}")
            print(f"  LinkedIn: {linkedin_stats}")

            if dry_run:
                await session.rollback()
            else:
                await session.commit()
                _save_checkpoint(checkpoint_file, index + 1)

    if not dry_run and checkpoint_file.exists():
        checkpoint_file.unlink(missing_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Backfill signal history")
    parser.add_argument("--days", type=int, default=30)
    parser.add_argument("--interval-hours", type=int, default=12)
    parser.add_argument("--checkpoint-file", type=str, default="data/signal_backfill_checkpoint.json")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    asyncio.run(
        run_backfill(
            days=args.days,
            dry_run=args.dry_run,
            interval_hours=args.interval_hours,
            checkpoint_file=Path(args.checkpoint_file),
        )
    )


if __name__ == "__main__":
    main()
