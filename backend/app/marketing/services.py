import logging
import uuid

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.marketing.models import RequestAccessLead
from app.marketing.schemas import RequestAccessCreate

logger = logging.getLogger(__name__)
settings = get_settings()


async def create_request_access_lead(db: AsyncSession, payload: RequestAccessCreate) -> RequestAccessLead:
    lead = RequestAccessLead(
        email=payload.email,
        firm=payload.firm,
        role=payload.role,
        sector=payload.sector,
        stage_focus=payload.stageFocus,
        message=payload.message,
        verification_token=uuid.uuid4().hex,
        verified=False,
        status="new",
    )
    db.add(lead)
    await db.flush()
    await db.refresh(lead)
    return lead


async def get_request_access_lead_by_token(db: AsyncSession, token: str) -> RequestAccessLead | None:
    statement = select(RequestAccessLead).where(RequestAccessLead.verification_token == token)
    result = await db.execute(statement)
    return result.scalar_one_or_none()


async def mark_request_access_lead_verified(lead: RequestAccessLead) -> RequestAccessLead:
    if not lead.verified:
        lead.verified = True
        lead.status = "reviewing"
    return lead


async def _send_email(to: str, subject: str, html: str) -> None:
    if not settings.RESEND_API_KEY:
        logger.info("[request-access] RESEND_API_KEY missing, skipping email", extra={"to": to, "subject": subject})
        return

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": settings.MARKETING_FROM_EMAIL,
                "to": to,
                "subject": subject,
                "html": html,
            },
        )
        response.raise_for_status()


async def send_request_access_emails(lead: RequestAccessLead) -> None:
    verify_url = f"{settings.FRONTEND_URL}/verify?token={lead.verification_token}"

    tasks = [
        _send_email(
            lead.email,
            "Verify your Founder Radar beta request",
            (
                "<p>Thanks for requesting early access to Founder Radar.</p>"
                f"<p><a href=\"{verify_url}\">Verify your email</a> to complete your request.</p>"
            ),
        )
    ]

    if settings.MARKETING_ADMIN_EMAIL:
        tasks.append(
            _send_email(
                settings.MARKETING_ADMIN_EMAIL,
                f"New Founder Radar lead: {lead.firm}",
                (
                    "<p>New lead submitted.</p>"
                    f"<ul><li>Email: {lead.email}</li><li>Firm: {lead.firm}</li><li>Role: {lead.role}</li>"
                    f"<li>Sector: {lead.sector}</li><li>Stage: {lead.stage_focus}</li></ul>"
                ),
            )
        )

    for task in tasks:
        try:
            await task
        except Exception as error:
            logger.warning("Failed sending request-access email: %s", error)
