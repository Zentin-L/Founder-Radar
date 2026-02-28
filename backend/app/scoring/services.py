from datetime import datetime, UTC
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.models import User  # noqa: F401
from app.scoring.engine import calculate_momentum_score, score_direction
from app.scoring.models import StartupScoreHistory
from app.signals.services import calculate_hiring_velocity, calculate_linkedin_growth_rate
from app.startups.models import Startup


async def recompute_startup_score(db: AsyncSession, startup: Startup) -> float:
    hiring_velocity, _, _ = await calculate_hiring_velocity(db, startup.id)
    linkedin_growth_rate, _, _ = await calculate_linkedin_growth_rate(db, startup.id)

    new_score = calculate_momentum_score(hiring_velocity, linkedin_growth_rate)
    previous_score = float(startup.momentum_score or 0.0)
    delta = round(new_score - previous_score, 2)
    direction = score_direction(delta)
    now = datetime.now(UTC)

    startup.momentum_score = new_score
    startup.score_change = delta
    startup.score_direction = direction
    startup.score_updated_at = now

    history = StartupScoreHistory(
        startup_id=startup.id,
        score=new_score,
        score_change=delta,
        score_direction=direction,
        calculated_at=now,
    )
    db.add(history)
    await db.flush()
    return new_score


async def recompute_all_startup_scores(db: AsyncSession, batch_size: int = 100) -> dict[str, int]:
    startups = list((await db.execute(select(Startup))).scalars().all())
    stats = {"processed": 0, "success": 0, "failed": 0}

    for startup in startups:
        stats["processed"] += 1
        try:
            await recompute_startup_score(db, startup)
            stats["success"] += 1
        except Exception:
            stats["failed"] += 1

    await db.flush()
    return stats


async def get_latest_score_state(db: AsyncSession, startup_id: UUID) -> Startup | None:
    return (await db.execute(select(Startup).where(Startup.id == startup_id))).scalar_one_or_none()


async def get_score_history(
    db: AsyncSession,
    startup_id: UUID,
    limit: int = 100,
    cursor: str | None = None,
) -> tuple[list[StartupScoreHistory], str | None, bool]:
    offset = int(cursor) if cursor else 0
    query = (
        select(StartupScoreHistory)
        .where(StartupScoreHistory.startup_id == startup_id)
        .order_by(StartupScoreHistory.calculated_at.desc())
        .offset(offset)
        .limit(limit + 1)
    )
    items = list((await db.execute(query)).scalars().all())
    has_more = len(items) > limit
    if has_more:
        items = items[:limit]
    next_cursor = str(offset + limit) if has_more else None
    return items, next_cursor, has_more
