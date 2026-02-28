"""
Run one score recomputation cycle manually.
"""
import asyncio

from sqlalchemy import func, select

from app.database import async_session
from app.scoring.services import recompute_all_startup_scores
from app.startups.models import Startup


async def main() -> None:
    async with async_session() as session:
        stats = await recompute_all_startup_scores(session)
        await session.commit()

        min_score = (await session.execute(select(func.min(Startup.momentum_score)))).scalar_one()
        max_score = (await session.execute(select(func.max(Startup.momentum_score)))).scalar_one()
        avg_score = (await session.execute(select(func.avg(Startup.momentum_score)))).scalar_one()

    print("recompute", stats)
    print("distribution", {"min": min_score, "max": max_score, "avg": float(avg_score or 0.0)})


if __name__ == "__main__":
    asyncio.run(main())
