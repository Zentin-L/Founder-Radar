"""
Seed script — imports startup data from JSON/CSV into the database.
Run: cd backend && python -m scripts.seed_startups
"""
import asyncio
import csv
import json
import os
import sys
from collections import Counter
from urllib.parse import urlparse

# Add parent dir to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select, func
from app.database import async_session
from app.auth.models import User  # noqa: F401
from app.startups.models import Startup


SECTOR_MAP = {
    "ai": "ai_ml",
    "ml": "ai_ml",
    "machine learning": "ai_ml",
    "artificial intelligence": "ai_ml",
    "fintech": "fintech",
    "payments": "fintech",
    "banking": "fintech",
    "health": "healthtech",
    "healthcare": "healthtech",
    "medtech": "healthtech",
    "saas": "saas_b2b",
    "b2b": "saas_b2b",
    "ecommerce": "ecommerce",
    "e-commerce": "ecommerce",
    "climate": "climate",
    "cyber": "cybersecurity",
    "security": "cybersecurity",
    "edtech": "edtech",
}


def normalize_domain(url_or_domain: str) -> str:
    value = (url_or_domain or "").strip().lower()
    if not value:
        return ""

    if "://" not in value:
        value = f"https://{value}"

    parsed = urlparse(value)
    domain = parsed.netloc or parsed.path
    if domain.startswith("www."):
        domain = domain[4:]
    return domain.strip("/")


def normalize_sector(raw_sector: str | None) -> str:
    if not raw_sector:
        return "other"
    sector = raw_sector.strip().lower()
    if sector in {
        "ai_ml",
        "fintech",
        "healthtech",
        "saas_b2b",
        "ecommerce",
        "climate",
        "cybersecurity",
        "edtech",
        "other",
    }:
        return sector

    for key, mapped_value in SECTOR_MAP.items():
        if key in sector:
            return mapped_value
    return "other"


def normalize_stage(raw_stage: str | None) -> str:
    if not raw_stage:
        return "Seed"
    stage = raw_stage.strip().lower()
    if "pre" in stage and "seed" in stage:
        return "Pre-seed"
    if "seed" in stage:
        return "Seed"
    if "series a" in stage:
        return "Series A"
    if "series b" in stage or "series c" in stage or "series d" in stage or "+" in stage:
        return "Series B+"
    return "Seed"


def load_yc_startups(data_dir: str) -> list[dict]:
    yc_path = os.path.join(data_dir, "yc_startups.json")
    with open(yc_path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_curated_startups(data_dir: str) -> list[dict]:
    curated_path = os.path.join(data_dir, "curated_startups.csv")
    if not os.path.exists(curated_path):
        return []

    with open(curated_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        return list(reader)


def prepare_records(raw_records: list[dict], source: str) -> list[dict]:
    prepared: list[dict] = []
    for record in raw_records:
        domain = normalize_domain(record.get("domain", ""))
        if not domain:
            continue

        name = (record.get("name") or domain.split(".")[0]).strip()
        founded_year = record.get("founded_year")
        team_size = record.get("team_size")

        prepared.append(
            {
                "name": name,
                "domain": domain,
                "sector": normalize_sector(record.get("sector")),
                "stage": normalize_stage(record.get("stage")),
                "founded_year": int(founded_year) if str(founded_year or "").isdigit() else None,
                "description": record.get("description") or None,
                "team_size": int(team_size) if str(team_size or "").isdigit() else None,
                "source": source,
                "signals_status": "active",
            }
        )
    return prepared


async def seed():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

    yc_raw = load_yc_startups(data_dir)
    curated_raw = load_curated_startups(data_dir)

    yc_records = prepare_records(yc_raw, "seeded")
    curated_records = prepare_records(curated_raw, "seeded")
    startups_data = yc_records + curated_records

    print(f"Loaded {len(yc_records)} startups from yc_startups.json")
    print(f"Loaded {len(curated_records)} startups from curated_startups.csv")

    created = 0
    skipped_existing = 0
    skipped_batch_duplicates = 0
    sector_counter: Counter[str] = Counter()
    seen_domains: set[str] = set()

    async with async_session() as session:
        for data in startups_data:
            domain = data["domain"]

            if domain in seen_domains:
                skipped_batch_duplicates += 1
                continue
            seen_domains.add(domain)

            existing = await session.execute(
                select(Startup).where(Startup.domain == domain)
            )
            if existing.scalar_one_or_none():
                skipped_existing += 1
                continue

            startup = Startup(
                name=data["name"],
                domain=domain,
                sector=data.get("sector"),
                stage=data.get("stage"),
                founded_year=data.get("founded_year"),
                description=data.get("description"),
                team_size=data.get("team_size"),
                source=data.get("source", "seeded"),
                signals_status=data.get("signals_status", "active"),
            )
            session.add(startup)
            created += 1
            sector_counter[startup.sector or "other"] += 1

        await session.commit()

        # Get totals
        result = await session.execute(select(func.count()).select_from(Startup))
        total = result.scalar_one()

        # Sector distribution
        sectors = await session.execute(
            select(Startup.sector, func.count(Startup.id))
            .group_by(Startup.sector)
            .order_by(func.count(Startup.id).desc())
        )
        sector_counts = sectors.all()

    print(f"\n--- Seed Results ---")
    print(f"Created: {created}")
    print(f"Skipped (existing DB duplicates): {skipped_existing}")
    print(f"Skipped (batch duplicates): {skipped_batch_duplicates}")
    print(f"Total in DB: {total}")
    print(f"\nSector distribution:")
    for sector, count in sector_counts:
        print(f"  {sector or 'unknown'}: {count}")

    if sector_counter:
        print("\nInserted in this run by sector:")
        for sector, count in sorted(sector_counter.items(), key=lambda item: item[1], reverse=True):
            print(f"  {sector}: {count}")


if __name__ == "__main__":
    asyncio.run(seed())
