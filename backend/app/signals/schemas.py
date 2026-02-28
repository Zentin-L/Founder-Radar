from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SignalPoint(BaseModel):
    id: UUID
    value: float
    previous_value: float | None = None
    delta: float | None = None
    collected_at: datetime


class SignalSeriesResponse(BaseModel):
    startup_id: UUID
    signal_type: str
    items: list[SignalPoint]
    velocity: float | None = None
    growth_rate: float | None = None
    trend: str | None = None


class SignalTimelinePoint(BaseModel):
    id: UUID
    signal_type: str
    value: float
    delta: float | None = None
    collected_at: datetime


class SignalTimelineResponse(BaseModel):
    startup_id: UUID
    items: list[SignalTimelinePoint]
    cursor: str | None = None
    has_more: bool = False


class SignalHealthItem(BaseModel):
    pipeline: str
    task_name: str
    status: str
    alert_level: str
    success_count: int
    failed_count: int
    processed_count: int
    skipped_count: int
    duration_ms: int | None = None
    failure_rate: float
    started_at: datetime
    finished_at: datetime | None = None
    error_message: str | None = None


class SignalHealthResponse(BaseModel):
    items: list[SignalHealthItem]


class PipelineRunCreate(BaseModel):
    pipeline: str
    task_name: str
    status: str
    processed_count: int = 0
    success_count: int = 0
    failed_count: int = 0
    skipped_count: int = 0
    duration_ms: int | None = None
    error_message: str | None = None
    started_at: datetime
    finished_at: datetime | None = None
