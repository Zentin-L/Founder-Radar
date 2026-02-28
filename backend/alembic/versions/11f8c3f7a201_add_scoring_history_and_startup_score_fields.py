"""add scoring history and startup score fields

Revision ID: 11f8c3f7a201
Revises: 4b1988c9a401
Create Date: 2026-02-28 23:58:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "11f8c3f7a201"
down_revision: Union[str, Sequence[str], None] = "4b1988c9a401"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("startups", sa.Column("score_change", sa.Float(), nullable=True))
    op.add_column("startups", sa.Column("score_direction", sa.String(length=10), nullable=True))

    op.execute("UPDATE startups SET score_change = 0.0 WHERE score_change IS NULL")
    op.execute("UPDATE startups SET score_direction = 'flat' WHERE score_direction IS NULL")

    op.create_table(
        "startup_score_history",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("startup_id", sa.UUID(), nullable=False),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("score_change", sa.Float(), nullable=True),
        sa.Column("score_direction", sa.String(length=10), nullable=False),
        sa.Column("calculated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["startup_id"], ["startups.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_startup_score_history_startup_id"), "startup_score_history", ["startup_id"], unique=False)
    op.create_index(op.f("ix_startup_score_history_calculated_at"), "startup_score_history", ["calculated_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_startup_score_history_calculated_at"), table_name="startup_score_history")
    op.drop_index(op.f("ix_startup_score_history_startup_id"), table_name="startup_score_history")
    op.drop_table("startup_score_history")

    op.drop_column("startups", "score_direction")
    op.drop_column("startups", "score_change")
