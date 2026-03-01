from uuid import UUID
from urllib.parse import urlparse
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.models import User, SubscriptionTier
from app.signals.models import Signal, SignalType
from app.startups.models import Startup
from app.startups.enrichment import enrich_from_url


class StartupAlreadyExistsError(Exception):
    def __init__(self, startup: Startup):
        self.startup = startup


class SubmissionLimitExceededError(Exception):
    pass


def normalize_domain(url_or_domain: str) -> str:
    value = url_or_domain.strip().lower()
    if not value:
        return ""

    if "://" not in value:
        value = f"https://{value}"

    parsed = urlparse(value)
    domain = parsed.netloc or parsed.path
    if domain.startswith("www."):
        domain = domain[4:]
    return domain.strip("/")


async def get_startups(
    db: AsyncSession,
    q: str | None = None,
    sector: str | None = None,
    stage: str | None = None,
    min_score: float | None = None,
    max_score: float | None = None,
    cursor: str | None = None,
    limit: int = 50,
) -> tuple[list[Startup], int, bool]:
    query = select(Startup)

    if q:
        query = query.where(
            or_(
                Startup.name.ilike(f"%{q}%"),
                Startup.domain.ilike(f"%{q}%"),
            )
        )

    if sector:
        query = query.where(Startup.sector == sector)
    if stage:
        query = query.where(Startup.stage == stage)
    if min_score is not None:
        query = query.where(Startup.momentum_score >= min_score)
    if max_score is not None:
        query = query.where(Startup.momentum_score <= max_score)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply cursor (offset-based for simplicity)
    offset = int(cursor) if cursor else 0
    query = query.order_by(Startup.momentum_score.desc().nullslast(), Startup.name)
    query = query.offset(offset).limit(limit + 1)

    result = await db.execute(query)
    items = list(result.scalars().all())

    has_more = len(items) > limit
    if has_more:
        items = items[:limit]

    await enrich_signal_highlights(db, items)

    return items, total, has_more


async def get_startup_by_id(db: AsyncSession, startup_id: UUID) -> Startup | None:
    result = await db.execute(select(Startup).where(Startup.id == startup_id))
    startup = result.scalar_one_or_none()
    if startup:
        await enrich_signal_highlights(db, [startup])
    return startup


async def get_startup_by_domain(db: AsyncSession, domain: str) -> Startup | None:
    normalized_domain = normalize_domain(domain)
    result = await db.execute(select(Startup).where(Startup.domain == normalized_domain))
    return result.scalar_one_or_none()


async def search_startups(db: AsyncSession, query: str, limit: int = 20) -> list[Startup]:
    stmt = (
        select(Startup)
        .where(
            or_(
                Startup.name.ilike(f"%{query}%"),
                Startup.domain.ilike(f"%{query}%"),
            )
        )
        .order_by(Startup.momentum_score.desc().nullslast())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_startup(db: AsyncSession, **kwargs) -> Startup:
    if "domain" in kwargs and kwargs["domain"]:
        kwargs["domain"] = normalize_domain(kwargs["domain"])
    startup = Startup(**kwargs)
    db.add(startup)
    await db.flush()
    await db.refresh(startup)
    return startup


async def bulk_create_startups(db: AsyncSession, startups_data: list[dict]) -> int:
    created = 0
    for data in startups_data:
        domain = normalize_domain(data.get("domain", ""))
        if domain:
            existing = await get_startup_by_domain(db, domain)
            if existing:
                continue
            data["domain"] = domain
        startup = Startup(**data)
        db.add(startup)
        created += 1
    await db.flush()
    return created


async def count_user_submissions(db: AsyncSession, user_id: UUID) -> int:
    result = await db.execute(
        select(func.count()).where(
            Startup.submitted_by == user_id,
            Startup.source == "user_submitted",
        )
    )
    return result.scalar_one()


async def submit_startup(db: AsyncSession, url: str, user: User) -> Startup:
    domain = normalize_domain(url)
    existing = await get_startup_by_domain(db, domain)
    if existing:
        raise StartupAlreadyExistsError(existing)

    user_tier = user.subscription_tier
    if isinstance(user_tier, SubscriptionTier) and user_tier == SubscriptionTier.FREE:
        submissions = await count_user_submissions(db, user.id)
        if submissions >= 10:
            raise SubmissionLimitExceededError()

    enriched = await enrich_from_url(url)
    startup_name = enriched.get("name") or domain.split(".")[0].replace("-", " ").title()

    startup = await create_startup(
        db,
        name=startup_name,
        domain=enriched.get("domain") or domain,
        description=enriched.get("description"),
        logo_url=enriched.get("logo_url"),
        linkedin_url=enriched.get("linkedin_url"),
        source="user_submitted",
        signals_status="pending",
        submitted_by=user.id,
        momentum_score=0.0,
    )
    return startup


async def enrich_signal_highlights(db: AsyncSession, startups: list[Startup]) -> None:
    for startup in startups:
        startup.hiring_signal_delta = None
        startup.hiring_signal_collected_at = None
        startup.linkedin_signal_delta = None
        startup.linkedin_signal_collected_at = None

        hiring_stmt = (
            select(Signal.delta, Signal.collected_at)
            .where(
                Signal.startup_id == startup.id,
                Signal.signal_type == SignalType.HIRING,
            )
            .order_by(Signal.collected_at.desc())
            .limit(1)
        )
        hiring_row = (await db.execute(hiring_stmt)).first()
        if hiring_row:
            startup.hiring_signal_delta = hiring_row[0]
            startup.hiring_signal_collected_at = hiring_row[1]

        linkedin_stmt = (
            select(Signal.delta, Signal.collected_at)
            .where(
                Signal.startup_id == startup.id,
                Signal.signal_type == SignalType.LINKEDIN,
            )
            .order_by(Signal.collected_at.desc())
            .limit(1)
        )
        linkedin_row = (await db.execute(linkedin_stmt)).first()
        if linkedin_row:
            startup.linkedin_signal_delta = linkedin_row[0]
            startup.linkedin_signal_collected_at = linkedin_row[1]
