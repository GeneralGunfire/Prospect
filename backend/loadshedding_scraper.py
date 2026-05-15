"""
Load Shedding Scraper
=====================
Scrapes the Eskom load shedding status page and writes to
public/data/loadshedding/latest.json (committed by GitHub Actions).

Sources:
  - https://loadshedding.eskom.co.za/  (HTML status page)
  - https://www.eskom.co.za/distribution/customer-service/outages/load-shedding-status/

Run:  python backend/loadshedding_scraper.py
Schedule: GitHub Actions every 30 minutes
"""

import json
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; SA-LoadShedding-Bot/1.0; +https://prospect.co.za)",
    "Accept": "text/html,application/xhtml+xml",
}

OUT_PATH = Path(__file__).parent.parent / "public" / "data" / "loadshedding" / "latest.json"

# Known status page URLs to try in order
ESKOM_URLS = [
    "https://loadshedding.eskom.co.za/",
    "https://www.eskom.co.za/distribution/customer-service/outages/load-shedding-status/",
]

STAGE_KEYWORDS = {
    "no load shedding": 0,
    "suspended": 0,
    "stage 1": 1,
    "stage 2": 2,
    "stage 3": 3,
    "stage 4": 4,
    "stage 5": 5,
    "stage 6": 6,
    "stage 7": 7,
    "stage 8": 8,
}


def _fallback_data(note: str) -> dict:
    """Return safe fallback — Stage 0, suspended, with an explanatory note."""
    return {
        "currentStage": 0,
        "suspended": True,
        "suspendedSince": "2024-03-26",
        "statusText": "No Load Shedding",
        "statusNote": note,
        "forecast": [],
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "loadshedding.eskom.co.za",
        "scrapedAt": datetime.now(timezone.utc).isoformat(),
    }


def _parse_stage_from_text(text: str) -> Optional[int]:
    text_lower = text.lower()
    for keyword, stage in sorted(STAGE_KEYWORDS.items(), key=lambda x: -len(x[0])):
        if keyword in text_lower:
            return stage
    # Try regex: "stage X" where X is a digit
    m = re.search(r"stage\s+(\d)", text_lower)
    if m:
        return min(int(m.group(1)), 8)
    return None


def scrape_eskom_status() -> dict:
    for url in ESKOM_URLS:
        log.info("Trying %s", url)
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
        except requests.RequestException as e:
            log.warning("Fetch failed for %s: %s", url, e)
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        page_text = soup.get_text(" ", strip=True)

        stage = _parse_stage_from_text(page_text)
        if stage is None:
            log.warning("Could not parse stage from %s", url)
            continue

        suspended = stage == 0 and (
            "suspend" in page_text.lower() or "no load shedding" in page_text.lower()
        )

        now = datetime.now(timezone.utc).isoformat()
        log.info("Parsed stage=%d suspended=%s from %s", stage, suspended, url)
        return {
            "currentStage": stage,
            "suspended": suspended,
            "suspendedSince": "2024-03-26" if suspended else None,
            "statusText": "No Load Shedding" if stage == 0 else f"Stage {stage}",
            "statusNote": (
                "Eskom suspended load shedding on 26 March 2024."
                if suspended
                else f"Stage {stage} load shedding is currently active."
            ),
            "forecast": [],
            "updatedAt": now,
            "source": url,
            "scrapedAt": now,
        }

    log.warning("All sources failed — writing fallback data")
    return _fallback_data(
        "Eskom status page is currently unreachable. "
        "Load shedding has been suspended since 26 March 2024. "
        "Check loadshedding.eskom.co.za for live status."
    )


def main():
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    data = scrape_eskom_status()
    OUT_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    log.info("Written to %s (stage=%d)", OUT_PATH, data["currentStage"])


if __name__ == "__main__":
    main()
