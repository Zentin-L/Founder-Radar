from datetime import datetime, UTC

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.startups.models import Startup
from app.signals.models import SignalType
from app.signals.linkedin_parser import extract_employee_count
from app.signals.services import record_signal


async def _fetch_linkedin_employee_count(linkedin_url: str) -> int | None:
    async with httpx.AsyncClient(timeout=12.0, follow_redirects=True) as client:
        try:
            response = await client.get(linkedin_url)
            if response.status_code >= 400:
                return None
            value = extract_employee_count(response.text)
            if value is not None:
                return value
            return await _browser_fallback_employee_count(linkedin_url)
        except Exception:
            return None


async def _browser_fallback_employee_count(linkedin_url: str) -> int | None:
    try:
        from playwright.async_api import async_playwright
    except Exception:
        return None

    try:
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(linkedin_url, wait_until="domcontentloaded", timeout=15000)
            content = await page.content()
            await browser.close()
            return extract_employee_count(content)
    except Exception:
        return None


async def collect_linkedin_signals(
    db: AsyncSession,
    collected_at: datetime | None = None,
) -> dict[str, int]:
    now = collected_at or datetime.now(UTC)
    startups = list((await db.execute(select(Startup))).scalars().all())

    processed = 0
    success = 0
    failed = 0
    skipped = 0

    for startup in startups:
        processed += 1
        linkedin_url = startup.linkedin_url
        if not linkedin_url and startup.domain:
            linkedin_url = f"https://linkedin.com/company/{startup.domain.split('.')[0]}"

        if not linkedin_url:
            skipped += 1
            continue

        try:
            employee_count = await _fetch_linkedin_employee_count(linkedin_url)
            if employee_count is None:
                skipped += 1
                continue

            created = await record_signal(
                db,
                startup_id=startup.id,
                signal_type=SignalType.LINKEDIN,
                value=float(employee_count),
                collected_at=now,
            )
            if created is None:
                skipped += 1
            else:
                success += 1
        except Exception:
            failed += 1

    return {
        "processed": processed,
        "success": success,
        "failed": failed,
        "skipped": skipped,
    }
