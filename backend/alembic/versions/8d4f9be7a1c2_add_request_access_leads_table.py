"""add request access leads table

Revision ID: 8d4f9be7a1c2
Revises: 11f8c3f7a201
Create Date: 2026-03-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8d4f9be7a1c2"
down_revision: Union[str, Sequence[str], None] = "11f8c3f7a201"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "request_access_leads",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("firm", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("sector", sa.String(length=100), nullable=False),
        sa.Column("stage_focus", sa.String(length=100), nullable=False),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("verification_token", sa.String(length=255), nullable=False),
        sa.Column("verified", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("verification_token"),
    )
    op.create_index(op.f("ix_request_access_leads_email"), "request_access_leads", ["email"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_request_access_leads_email"), table_name="request_access_leads")
    op.drop_table("request_access_leads")
