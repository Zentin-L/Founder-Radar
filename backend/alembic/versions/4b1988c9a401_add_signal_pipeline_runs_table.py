"""add signal pipeline runs table

Revision ID: 4b1988c9a401
Revises: 3f7aa655bba4
Create Date: 2026-02-28 23:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "4b1988c9a401"
down_revision: Union[str, Sequence[str], None] = "3f7aa655bba4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


pipeline_status_enum = postgresql.ENUM("SUCCESS", "FAILED", "RUNNING", name="pipelinestatus", create_type=False)


def upgrade() -> None:
    pipeline_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "signal_pipeline_runs",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("pipeline", sa.String(length=50), nullable=False),
        sa.Column("task_name", sa.String(length=100), nullable=False),
        sa.Column("status", pipeline_status_enum, nullable=False),
        sa.Column("processed_count", sa.Integer(), nullable=False),
        sa.Column("success_count", sa.Integer(), nullable=False),
        sa.Column("failed_count", sa.Integer(), nullable=False),
        sa.Column("skipped_count", sa.Integer(), nullable=False),
        sa.Column("duration_ms", sa.Integer(), nullable=True),
        sa.Column("error_message", sa.String(length=1000), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_signal_pipeline_runs_pipeline"), "signal_pipeline_runs", ["pipeline"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_signal_pipeline_runs_pipeline"), table_name="signal_pipeline_runs")
    op.drop_table("signal_pipeline_runs")
    pipeline_status_enum.drop(op.get_bind(), checkfirst=True)
