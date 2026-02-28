from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class StartupScoreStateResponse(BaseModel):
    startup_id: UUID
    momentum_score: float
    score_change: float
    score_direction: str
    score_updated_at: datetime | None


class StartupScoreHistoryPoint(BaseModel):
    score: float
    score_change: float | None = None
    score_direction: str
    calculated_at: datetime


class StartupScoreHistoryResponse(BaseModel):
    startup_id: UUID
    items: list[StartupScoreHistoryPoint]
    cursor: str | None = None
    has_more: bool = False


class ScoreRecomputeSummary(BaseModel):
    processed: int
    success: int
    failed: int
