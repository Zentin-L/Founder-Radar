from html import unescape
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup


def _normalize_domain(url_or_domain: str) -> str:
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


def _domain_to_company_slug(domain: str) -> str:
    if not domain:
        return ""
    return domain.split(".")[0].replace("_", "-").lower()


async def enrich_from_url(url: str) -> dict:
    domain = _normalize_domain(url)
    result = {
        "name": _domain_to_company_slug(domain).replace("-", " ").title() if domain else None,
        "description": None,
        "domain": domain or None,
        "logo_url": None,
        "linkedin_url": f"https://linkedin.com/company/{_domain_to_company_slug(domain)}" if domain else None,
    }

    if not domain:
        return result

    target_url = url if "://" in url else f"https://{url}"

    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(target_url)
            response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        title_tag = soup.find("meta", property="og:title")
        if not title_tag or not title_tag.get("content"):
            title_tag = soup.find("title")

        description_tag = soup.find("meta", property="og:description")
        if not description_tag or not description_tag.get("content"):
            description_tag = soup.find("meta", attrs={"name": "description"})

        image_tag = soup.find("meta", property="og:image")

        title_value = (
            title_tag.get("content")
            if title_tag and title_tag.has_attr("content")
            else (title_tag.get_text(strip=True) if title_tag else None)
        )
        description_value = (
            description_tag.get("content")
            if description_tag and description_tag.has_attr("content")
            else None
        )
        image_value = image_tag.get("content") if image_tag and image_tag.has_attr("content") else None

        if title_value:
            result["name"] = unescape(title_value).strip()
        if description_value:
            result["description"] = unescape(description_value).strip()
        if image_value:
            result["logo_url"] = image_value.strip()

        redirected_domain = _normalize_domain(str(response.url))
        if redirected_domain:
            result["domain"] = redirected_domain
            result["linkedin_url"] = f"https://linkedin.com/company/{_domain_to_company_slug(redirected_domain)}"

    except Exception:
        return result

    return result
