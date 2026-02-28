import re


def extract_job_posting_count(html: str) -> int | None:
    compact = re.sub(r"\s+", " ", html.lower())

    explicit_patterns = [
        r"([\d,]+)\s+(?:open\s+)?(?:jobs|roles|positions)",
        r"(?:jobs|roles|positions)\s*[:\-]?\s*([\d,]+)",
    ]
    for pattern in explicit_patterns:
        match = re.search(pattern, compact)
        if match:
            return int(match.group(1).replace(",", ""))

    heuristics = len(re.findall(r"\b(job|role|position)\b", compact))
    if heuristics > 0:
        return min(heuristics, 200)

    return None
