import re


def extract_employee_count(html: str) -> int | None:
    compact = re.sub(r"\s+", " ", html.lower())
    patterns = [
        r"([\d,]+)\+?\s+employees",
        r"company\s+size\s*[:\-]?\s*([\d,]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, compact)
        if match:
            value = int(match.group(1).replace(",", ""))
            if 0 < value < 2_000_000:
                return value

    return None
