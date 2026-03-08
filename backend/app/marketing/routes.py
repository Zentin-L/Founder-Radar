from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.marketing.schemas import (
    RequestAccessCreate,
    RequestAccessCreateResponse,
    RequestAccessVerifyResponse,
)
from app.marketing.services import (
    create_request_access_lead,
    get_request_access_lead_by_token,
    mark_request_access_lead_verified,
    send_request_access_emails,
)

router = APIRouter(prefix="/api/marketing/request-access", tags=["marketing"])


@router.post("", response_model=RequestAccessCreateResponse)
async def request_access(
    payload: RequestAccessCreate,
    db: AsyncSession = Depends(get_db),
):
    lead = await create_request_access_lead(db, payload)
    await send_request_access_emails(lead)
    return RequestAccessCreateResponse(success=True)


@router.get("/verify", response_model=RequestAccessVerifyResponse)
async def verify_request_access(
    token: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing token.")

    lead = await get_request_access_lead_by_token(db, token)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid or expired token.")

    await mark_request_access_lead_verified(lead)

    return RequestAccessVerifyResponse(
        success=True,
        message="Email verified. We'll review your request soon.",
    )
