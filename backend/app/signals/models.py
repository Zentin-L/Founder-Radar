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
