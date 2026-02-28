from datetime import datetime, timedelta, UTC
from uuid import UUID

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.signals.models import PipelineStatus, Signal, SignalPipelineRun, SignalType


def _as_signal_type(signal_type: SignalType | str) -> SignalType:
    if isinstance(signal_type, SignalType):
        return signal_type
    return SignalType(signal_type)


def _trend_from_delta(delta: float | None) -> str:
    if delta is None:
        return "flat"
    if delta > 0:
        return "up"
    if delta < 0:
        return "down"
    return "flat"


async def get_latest_signal(
    db: AsyncSession,
    startup_id: UUID,
    signal_type: SignalType | str,
) -> Signal | None:
    signal_type_enum = _as_signal_type(signal_type)
    stmt = (
        select(Signal)
        .where(
            Signal.startup_id == startup_id,
            Signal.signal_type == signal_type_enum,
        )
        .order_by(Signal.collected_at.desc())
        .limit(1)
    )
    return (await db.execute(stmt)).scalar_one_or_none()


async def record_signal(
    db: AsyncSession,
    startup_id: UUID,
    signal_type: SignalType | str,
    value: float,
    collected_at: datetime | None = None,
    dedupe_window_minutes: int = 60,
) -> Signal | None:
    signal_type_enum = _as_signal_type(signal_type)
    collected = collected_at or datetime.now(UTC)

    existing_stmt = (
        select(Signal)
        .where(
            Signal.startup_id == startup_id,
            Signal.signal_type == signal_type_enum,
            Signal.collected_at >= collected - timedelta(minutes=dedupe_window_minutes),
            Signal.collected_at <= collected + timedelta(minutes=dedupe_window_minutes),
            Signal.value == value,
        )
        .order_by(Signal.collected_at.desc())
        .limit(1)
    )
    existing = (await db.execute(existing_stmt)).scalar_one_or_none()
    if existing:
        return None

    previous_stmt = (
        select(Signal)
        .where(
            Signal.startup_id == startup_id,
            Signal.signal_type == signal_type_enum,
            Signal.collected_at < collected,
        )
        .order_by(Signal.collected_at.desc())
        .limit(1)
    )
    previous = (await db.execute(previous_stmt)).scalar_one_or_none()

    previous_value = previous.value if previous else None
    delta = value - previous_value if previous_value is not None else None

    signal = Signal(
        startup_id=startup_id,
        signal_type=signal_type_enum,
        value=value,
        previous_value=previous_value,
        delta=delta,
        collected_at=collected,
    )
    db.add(signal)
    await db.flush()
    await db.refresh(signal)
    return signal


async def get_signal_history(
    db: AsyncSession,
    startup_id: UUID,
    signal_type: SignalType | str,
    from_at: datetime | None = None,
    to_at: datetime | None = None,
    limit: int = 100,
    cursor: str | None = None,
) -> tuple[list[Signal], str | None, bool]:
    signal_type_enum = _as_signal_type(signal_type)
    offset = int(cursor) if cursor else 0

    query = select(Signal).where(
        Signal.startup_id == startup_id,
        Signal.signal_type == signal_type_enum,
    )
    if from_at:
        query = query.where(Signal.collected_at >= from_at)
    if to_at:
        query = query.where(Signal.collected_at <= to_at)

    query = query.order_by(Signal.collected_at.desc()).offset(offset).limit(limit + 1)
    items = list((await db.execute(query)).scalars().all())
    has_more = len(items) > limit
    if has_more:
        items = items[:limit]
    next_cursor = str(offset + limit) if has_more else None
    return items, next_cursor, has_more


async def get_merged_signal_history(
    db: AsyncSession,
    startup_id: UUID,
    signal_type: str | None = None,
    from_at: datetime | None = None,
    to_at: datetime | None = None,
    limit: int = 100,
    cursor: str | None = None,
) -> tuple[list[Signal], str | None, bool]:
    offset = int(cursor) if cursor else 0
    query = select(Signal).where(Signal.startup_id == startup_id)

    if signal_type:
        query = query.where(Signal.signal_type == _as_signal_type(signal_type))
    if from_at:
        query = query.where(Signal.collected_at >= from_at)
    if to_at:
        query = query.where(Signal.collected_at <= to_at)

    query = query.order_by(Signal.collected_at.desc()).offset(offset).limit(limit + 1)
    items = list((await db.execute(query)).scalars().all())
    has_more = len(items) > limit
    if has_more:
        items = items[:limit]
    next_cursor = str(offset + limit) if has_more else None
    return items, next_cursor, has_more


async def calculate_hiring_velocity(
    db: AsyncSession,
    startup_id: UUID,
    window_days: int = 30,
) -> tuple[float | None, float | None, str]:
    from_at = datetime.now(UTC) - timedelta(days=window_days)
    stmt = (
        select(Signal)
        .where(
            Signal.startup_id == startup_id,
            Signal.signal_type == SignalType.HIRING,
            Signal.collected_at >= from_at,
        )
        .order_by(Signal.collected_at.asc())
    )
    items = list((await db.execute(stmt)).scalars().all())
    if len(items) < 2:
        return None, None, "flat"

    first, last = items[0], items[-1]
    elapsed_days = max((last.collected_at - first.collected_at).total_seconds() / 86400, 1 / 24)
    delta = last.value - first.value
    velocity = delta / elapsed_days
    return velocity, delta, _trend_from_delta(delta)


async def calculate_linkedin_growth_rate(
    db: AsyncSession,
    startup_id: UUID,
    window_days: int = 30,
) -> tuple[float | None, float | None, str]:
    from_at = datetime.now(UTC) - timedelta(days=window_days)
    stmt = (
        select(Signal)
        .where(
            Signal.startup_id == startup_id,
            Signal.signal_type == SignalType.LINKEDIN,
            Signal.collected_at >= from_at,
        )
        .order_by(Signal.collected_at.asc())
    )
    items = list((await db.execute(stmt)).scalars().all())
    if len(items) < 2:
        return None, None, "flat"

    first, last = items[0], items[-1]
    delta = last.value - first.value
    if first.value <= 0:
        return None, delta, _trend_from_delta(delta)

    growth_rate = (delta / first.value) * 100.0
    return growth_rate, delta, _trend_from_delta(delta)


async def create_pipeline_run(
    db: AsyncSession,
    pipeline: str,
    task_name: str,
    status: PipelineStatus | str,
    started_at: datetime,
    finished_at: datetime | None,
    processed_count: int = 0,
    success_count: int = 0,
    failed_count: int = 0,
    skipped_count: int = 0,
    duration_ms: int | None = None,
    error_message: str | None = None,
) -> SignalPipelineRun:
    status_enum = PipelineStatus(status) if isinstance(status, str) else status
    run = SignalPipelineRun(
        pipeline=pipeline,
        task_name=task_name,
        status=status_enum,
        processed_count=processed_count,
        success_count=success_count,
        failed_count=failed_count,
        skipped_count=skipped_count,
        duration_ms=duration_ms,
        error_message=error_message,
        started_at=started_at,
        finished_at=finished_at,
    )
    db.add(run)
    await db.flush()
    await db.refresh(run)
    return run


async def get_pipeline_health_snapshot(db: AsyncSession) -> list[SignalPipelineRun]:
    subquery = (
        select(
            SignalPipelineRun.pipeline,
            func.max(SignalPipelineRun.started_at).label("max_started_at"),
        )
        .group_by(SignalPipelineRun.pipeline)
        .subquery()
    )

    query = (
        select(SignalPipelineRun)
        .join(
            subquery,
            and_(
                SignalPipelineRun.pipeline == subquery.c.pipeline,
                SignalPipelineRun.started_at == subquery.c.max_started_at,
            ),
        )
        .order_by(SignalPipelineRun.pipeline.asc())
    )
    return list((await db.execute(query)).scalars().all())
