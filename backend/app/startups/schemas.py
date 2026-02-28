from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class StartupResponse(BaseModel):
    id: UUID
    name: str
    domain: str | None = None
    sector: str | None = None
    stage: str | None = None
    founded_year: int | None = None
    description: str | None = None
    team_size: int | None = None
    momentum_score: float | None = 0.0
    score_change: float | None = 0.0
    score_direction: str | None = "flat"
    score_updated_at: datetime | None = None
    source: str | None = None
    signals_status: str | None = None
    linkedin_url: str | None = None
    logo_url: str | None = None
    submitted_by: UUID | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class StartupListResponse(BaseModel):
    items: list[StartupResponse]
    total: int
    cursor: str | None = None
    has_more: bool = False


class StartupFilters(BaseModel):
    sector: str | None = None
    stage: str | None = None
    min_score: float | None = None
    max_score: float | None = None


class StartupSubmitRequest(BaseModel):
    url: str


class StartupSubmitResponse(BaseModel):
    startup: StartupResponse
    message: str
