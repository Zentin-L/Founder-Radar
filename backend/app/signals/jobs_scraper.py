from datetime import datetime, UTC

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.startups.models import Startup
from app.signals.models import SignalType
from app.signals.jobs_parser import extract_job_posting_count
from app.signals.services import record_signal


JOB_PATHS = ["/careers", "/jobs", "/about/careers", "/company/careers"]


async def _browser_fallback_job_count(url: str) -> int | None:
    try:
        from playwright.async_api import async_playwright
    except Exception:
        return None

    try:
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            content = await page.content()
            await browser.close()
            return extract_job_posting_count(content)
    except Exception:
        return None


async def _find_job_count_for_domain(domain: str) -> int | None:
    async with httpx.AsyncClient(timeout=12.0, follow_redirects=True) as client:
        for path in JOB_PATHS:
            url = f"https://{domain}{path}"
            try:
                response = await client.get(url)
                if response.status_code >= 400:
                    continue
                count = extract_job_posting_count(response.text)
                if count is not None:
                    return count
                fallback_count = await _browser_fallback_job_count(url)
                if fallback_count is not None:
                    return fallback_count
            except Exception:
                continue
    return None


async def collect_job_signals(
    db: AsyncSession,
    collected_at: datetime | None = None,
) -> dict[str, int]:
    now = collected_at or datetime.now(UTC)
    startups = list((await db.execute(select(Startup).where(Startup.domain.is_not(None)))).scalars().all())

    processed = 0
    success = 0
    failed = 0
    skipped = 0

    for startup in startups:
        processed += 1
        try:
            count = await _find_job_count_for_domain(startup.domain or "")
            if count is None:
                skipped += 1
                continue
            created = await record_signal(
                db,
                startup_id=startup.id,
                signal_type=SignalType.HIRING,
                value=float(count),
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
