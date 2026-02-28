from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.database import get_db
from app.scoring.schemas import StartupScoreHistoryPoint, StartupScoreHistoryResponse, StartupScoreStateResponse
from app.scoring.services import get_latest_score_state, get_score_history

router = APIRouter(prefix="/api/scoring", tags=["scoring"])


@router.get("/startups/{startup_id}", response_model=StartupScoreStateResponse)
async def get_score_state(
    startup_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    startup = await get_latest_score_state(db, startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    return StartupScoreStateResponse(
        startup_id=startup.id,
        momentum_score=float(startup.momentum_score or 0.0),
        score_change=float(startup.score_change or 0.0),
        score_direction=startup.score_direction or "flat",
        score_updated_at=startup.score_updated_at,
    )


@router.get("/startups/{startup_id}/history", response_model=StartupScoreHistoryResponse)
async def get_startup_score_history(
    startup_id: UUID,
    limit: int = Query(default=100, le=500),
    cursor: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    items, next_cursor, has_more = await get_score_history(db, startup_id, limit=limit, cursor=cursor)
    return StartupScoreHistoryResponse(
        startup_id=startup_id,
        items=[
            StartupScoreHistoryPoint(
                score=item.score,
                score_change=item.score_change,
                score_direction=item.score_direction,
                calculated_at=item.calculated_at,
            )
            for item in items
        ],
        cursor=next_cursor,
        has_more=has_more,
    )
