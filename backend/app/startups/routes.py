from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.database import get_db
from app.startups.schemas import (
    StartupResponse,
    StartupListResponse,
    StartupSubmitRequest,
    StartupSubmitResponse,
)
from app.startups.services import (
    get_startups,
    get_startup_by_id,
    search_startups,
    submit_startup,
    StartupAlreadyExistsError,
    SubmissionLimitExceededError,
)

router = APIRouter(prefix="/api/startups", tags=["startups"])


@router.get("", response_model=StartupListResponse)
async def list_startups(
    q: str | None = None,
    sector: str | None = None,
    stage: str | None = None,
    min_score: float | None = None,
    max_score: float | None = None,
    cursor: str | None = None,
    limit: int = Query(default=50, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    items, total, has_more = await get_startups(
        db, q=q, sector=sector, stage=stage,
        min_score=min_score, max_score=max_score,
        cursor=cursor, limit=limit,
    )
    next_cursor = str(int(cursor or 0) + limit) if has_more else None
    return StartupListResponse(
        items=items, total=total, cursor=next_cursor, has_more=has_more,
    )


@router.get("/search", response_model=list[StartupResponse])
async def search(
    q: str = Query(..., min_length=1),
    limit: int = Query(default=20, le=50),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    results = await search_startups(db, q, limit)
    return results


@router.post("/submit", response_model=StartupSubmitResponse, status_code=status.HTTP_201_CREATED)
async def submit(
    payload: StartupSubmitRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        startup = await submit_startup(db, payload.url, user)
    except StartupAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "Startup already exists",
                "startup": StartupResponse.model_validate(error.startup).model_dump(mode="json"),
            },
        )
    except SubmissionLimitExceededError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Free plan submission limit reached (10). Upgrade to Pro for unlimited submissions.",
        )

    return StartupSubmitResponse(
        startup=startup,
        message="Startup submitted successfully. Signals discovery queued.",
    )


@router.get("/{startup_id}", response_model=StartupResponse)
async def get_startup(
    startup_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    startup = await get_startup_by_id(db, startup_id)
    if not startup:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Startup not found")
    return startup
