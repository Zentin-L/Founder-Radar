from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.database import get_db
from app.signals.schemas import (
    SignalHealthItem,
    SignalHealthResponse,
    SignalPoint,
    SignalSeriesResponse,
    SignalTimelinePoint,
    SignalTimelineResponse,
)
from app.signals.services import (
    calculate_hiring_velocity,
    calculate_linkedin_growth_rate,
    get_merged_signal_history,
    get_pipeline_health_snapshot,
    get_signal_history,
)

router = APIRouter(prefix="/api/signals", tags=["signals"])


def _alert_level(failure_rate: float) -> str:
    if failure_rate >= 0.5:
        return "critical"
    if failure_rate >= 0.2:
        return "warning"
    return "ok"


@router.get("/health", response_model=SignalHealthResponse)
async def get_signals_health(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    runs = await get_pipeline_health_snapshot(db)
    items: list[SignalHealthItem] = []
    for run in runs:
        failure_rate = (run.failed_count / run.processed_count) if run.processed_count > 0 else 0.0
        items.append(
            SignalHealthItem(
                pipeline=run.pipeline,
                task_name=run.task_name,
                status=run.status.value,
                alert_level=_alert_level(failure_rate),
                success_count=run.success_count,
                failed_count=run.failed_count,
                processed_count=run.processed_count,
                skipped_count=run.skipped_count,
                duration_ms=run.duration_ms,
                failure_rate=failure_rate,
                started_at=run.started_at,
                finished_at=run.finished_at,
                error_message=run.error_message,
            )
        )
    return SignalHealthResponse(items=items)


@router.get("/hiring/{startup_id}", response_model=SignalSeriesResponse)
async def get_hiring_signals(
    startup_id: UUID,
    from_at: datetime | None = None,
    to_at: datetime | None = None,
    limit: int = Query(default=100, le=500),
    cursor: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    history, _, _ = await get_signal_history(
        db,
        startup_id=startup_id,
        signal_type="hiring",
        from_at=from_at,
        to_at=to_at,
        limit=limit,
        cursor=cursor,
    )
    velocity, _, trend = await calculate_hiring_velocity(db, startup_id)
    return SignalSeriesResponse(
        startup_id=startup_id,
        signal_type="hiring",
        items=[
            SignalPoint(
                id=item.id,
                value=item.value,
                previous_value=item.previous_value,
                delta=item.delta,
                collected_at=item.collected_at,
            )
            for item in history
        ],
        velocity=velocity,
        trend=trend,
    )


@router.get("/linkedin/{startup_id}", response_model=SignalSeriesResponse)
async def get_linkedin_signals(
    startup_id: UUID,
    from_at: datetime | None = None,
    to_at: datetime | None = None,
    limit: int = Query(default=100, le=500),
    cursor: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    history, _, _ = await get_signal_history(
        db,
        startup_id=startup_id,
        signal_type="linkedin",
        from_at=from_at,
        to_at=to_at,
        limit=limit,
        cursor=cursor,
    )
    growth_rate, _, trend = await calculate_linkedin_growth_rate(db, startup_id)
    return SignalSeriesResponse(
        startup_id=startup_id,
        signal_type="linkedin",
        items=[
            SignalPoint(
                id=item.id,
                value=item.value,
                previous_value=item.previous_value,
                delta=item.delta,
                collected_at=item.collected_at,
            )
            for item in history
        ],
        growth_rate=growth_rate,
        trend=trend,
    )


@router.get("/{startup_id}", response_model=SignalTimelineResponse)
async def get_signal_timeline(
    startup_id: UUID,
    type: str | None = Query(default=None),
    from_at: datetime | None = None,
    to_at: datetime | None = None,
    limit: int = Query(default=100, le=500),
    cursor: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    items, next_cursor, has_more = await get_merged_signal_history(
        db,
        startup_id=startup_id,
        signal_type=type,
        from_at=from_at,
        to_at=to_at,
        limit=limit,
        cursor=cursor,
    )
    return SignalTimelineResponse(
        startup_id=startup_id,
        items=[
            SignalTimelinePoint(
                id=item.id,
                signal_type=item.signal_type.value,
                value=item.value,
                delta=item.delta,
                collected_at=item.collected_at,
            )
            for item in items
        ],
        cursor=next_cursor,
        has_more=has_more,
    )
