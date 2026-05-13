"""
Monthly policy & tax scraper for SA Career Guide.
Outputs 2026 SARS tax brackets, NSFAS status, and government policy updates
to public/data/policy-tax.json.

Run: python backend/policy_tax_scraper.py
Schedule: GitHub Actions on the 1st of each month at 09:00
"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any

import requests
from bs4 import BeautifulSoup


def get_tax_brackets() -> Dict[str, Any]:
    """
    Returns current SA income tax brackets.
    Source: SARS (sars.gov.za) — updated manually when Finance Minister announces budget.
    Hardcoded 2026/27 values; scraping SARS is unreliable due to PDF-based publications.
    """
    return {
        "tax_year": "2026/27",
        "primary_rebate": 17235,
        "secondary_rebate": 9444,       # age 65–74
        "tertiary_rebate": 3145,        # age 75+
        "tax_threshold": 95750,         # no tax below this annual income
        "uif_rate_percent": 1.0,        # employee contribution
        "uif_monthly_cap": 177.12,
        "brackets": [
            {"min": 0,        "max": 237100,   "rate": 18, "base": 0},
            {"min": 237100,   "max": 370500,   "rate": 26, "base": 42678},
            {"min": 370500,   "max": 512800,   "rate": 31, "base": 77362},
            {"min": 512800,   "max": 673000,   "rate": 36, "base": 121475},
            {"min": 673000,   "max": 857900,   "rate": 39, "base": 179147},
            {"min": 857900,   "max": 1817000,  "rate": 41, "base": 251258},
            {"min": 1817000,  "max": None,     "rate": 45, "base": 644489},
        ],
        "source": "SARS Budget 2026/27",
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }


def scrape_nsfas() -> Dict[str, Any]:
    """Attempt to scrape NSFAS application status from nsfas.org.za."""
    result: Dict[str, Any] = {
        "income_threshold": 350000,
        "application_status": "Check nsfas.org.za for current status",
        "deadline": "",
        "news": [],
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }

    try:
        resp = requests.get("https://www.nsfas.org.za/", timeout=12,
                            headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.content, "html.parser")

        headlines = []
        for el in soup.find_all(["h2", "h3", "h4", "p"])[:40]:
            text = el.get_text(strip=True)
            if len(text) > 30 and any(kw in text.lower() for kw in
                                       ["application", "deadline", "open", "close", "nsfas"]):
                headlines.append(text[:200])

        result["news"] = headlines[:5]

    except Exception as e:
        print(f"[nsfas] Could not scrape: {e}", file=sys.stderr)

    return result


def scrape_dbe_news() -> list:
    """Scrape education policy news from Department of Basic Education."""
    items = []
    try:
        resp = requests.get("https://www.education.gov.za/", timeout=12,
                            headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.content, "html.parser")

        for el in soup.find_all(["h2", "h3", "a"])[:30]:
            text = el.get_text(strip=True)
            if len(text) > 25 and any(kw in text.lower() for kw in
                                       ["matric", "curriculum", "school", "education", "exam"]):
                items.append({"title": text[:200], "source": "DBE",
                               "date": datetime.now(timezone.utc).isoformat()})
    except Exception as e:
        print(f"[dbe] Could not scrape: {e}", file=sys.stderr)

    return items[:5]


def run():
    data = {
        "income_tax": get_tax_brackets(),
        "nsfas": scrape_nsfas(),
        "education_news": scrape_dbe_news(),
        "updated": datetime.now(timezone.utc).isoformat(),
    }

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(repo_root, "landingpage", "public", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "policy-tax.json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[policy_tax_scraper] Written to {out_path}")


if __name__ == "__main__":
    run()
