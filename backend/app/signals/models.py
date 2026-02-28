import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Float, DateTime, Enum, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class SignalType(str, enum.Enum):
    HIRING = "hiring"
    LINKEDIN = "linkedin"


class PipelineStatus(str, enum.Enum):
    SUCCESS = "success"
    FAILED = "failed"
    RUNNING = "running"


class Signal(Base):
    __tablename__ = "signals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    startup_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("startups.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    signal_type: Mapped[SignalType] = mapped_column(
        Enum(SignalType), nullable=False, index=True
    )
    value: Mapped[float] = mapped_column(Float, nullable=False)
    previous_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    delta: Mapped[float | None] = mapped_column(Float, nullable=True)
    collected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class SignalPipelineRun(Base):
    __tablename__ = "signal_pipeline_runs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    pipeline: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    task_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[PipelineStatus] = mapped_column(Enum(PipelineStatus), nullable=False)
    processed_count: Mapped[int] = mapped_column(nullable=False, default=0)
    success_count: Mapped[int] = mapped_column(nullable=False, default=0)
    failed_count: Mapped[int] = mapped_column(nullable=False, default=0)
    skipped_count: Mapped[int] = mapped_column(nullable=False, default=0)
    duration_ms: Mapped[int | None] = mapped_column(nullable=True)
    error_message: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
