"""
SA Water Data Scraper
=====================
Fetches dam level data from DWS and water alerts from municipal websites.
Writes to landingpage/public/data/water/latest.json (committed by GitHub Actions).

Sources:
  - DWS Weekly Dam Levels: https://www.dws.gov.za/Hydrology/Weekly/Weekly.aspx
  - City municipality water alert pages

Run:  python backend/water_scraper.py
Schedule: GitHub Actions daily at 07:00 SAST
"""

import os
import re
import json
import uuid
import logging
from datetime import datetime
from typing import Optional

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; SA-Water-Bot/1.0; +https://prospect.co.za)",
    "Accept": "text/html,application/xhtml+xml",
}

# ── Dam → province mapping ────────────────────────────────────────────────────

DAM_PROVINCE_MAP = {
    "Vaal Dam": "Gauteng",
    "Sterkfontein Dam": "Gauteng",
    "Hartebeespoort Dam": "Gauteng",
    "Roodeplaat Dam": "Gauteng",
    "Theewaterskloof Dam": "Western Cape",
    "Voëlvlei Dam": "Western Cape",
    "Berg River Dam": "Western Cape",
    "Wemmershoek Dam": "Western Cape",
    "Pongolapoort Dam": "KwaZulu-Natal",
    "Midmar Dam": "KwaZulu-Natal",
    "Hazelmere Dam": "KwaZulu-Natal",
    "Inanda Dam": "KwaZulu-Natal",
    "Gariep Dam": "Free State",
    "Vanderkloof Dam": "Northern Cape",
    "Katse Dam": "Eastern Cape",
    "Wriggleswade Dam": "Eastern Cape",
    "Nahoon Dam": "Eastern Cape",
    "Tzaneen Dam": "Limpopo",
    "Ebenezer Dam": "Limpopo",
    "Witbank Dam": "Mpumalanga",
    "Klerksdorp Dam": "North West",
    "Hartbeespoort Dam": "North West",
}

# ── Dam scraper ───────────────────────────────────────────────────────────────

def _dam_urgency(level: float) -> str:
    if level < 20: return "critical"
    if level < 40: return "high"
    if level < 60: return "medium"
    return "low"


def _fallback_dam_levels() -> list[dict]:
    now = datetime.utcnow().isoformat()
    dams = [
        ("Vaal Dam",              "Gauteng",        63.0, "stable"),
        ("Hartebeespoort Dam",    "Gauteng",        88.0, "rising"),
        ("Sterkfontein Dam",      "Gauteng",        42.0, "falling"),
        ("Theewaterskloof Dam",   "Western Cape",   79.0, "rising"),
        ("Voëlvlei Dam",          "Western Cape",   72.0, "stable"),
        ("Berg River Dam",        "Western Cape",   57.0, "falling"),
        ("Pongolapoort Dam",      "KwaZulu-Natal",  94.0, "rising"),
        ("Midmar Dam",            "KwaZulu-Natal",  61.0, "stable"),
        ("Katse Dam",             "Eastern Cape",   36.0, "falling"),
        ("Wriggleswade Dam",      "Eastern Cape",   17.0, "falling"),
        ("Gariep Dam",            "Free State",     82.0, "rising"),
        ("Vanderkloof Dam",       "Northern Cape",  47.0, "stable"),
        ("Tzaneen Dam",           "Limpopo",        75.0, "stable"),
        ("Witbank Dam",           "Mpumalanga",     54.0, "stable"),
        ("Klerksdorp Dam",        "North West",     60.0, "rising"),
    ]
    return [
        {
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"dam-{name}")),
            "province": prov,
            "damName": name,
            "levelPercent": pct,
            "trend": trend,
            "urgency": _dam_urgency(pct),
            "sourceUrl": "https://www.dws.gov.za",
            "lastUpdated": now,
            "isFallback": True,
        }
        for name, prov, pct, trend in dams
    ]


def scrape_dws_dam_levels() -> list[dict]:
    url = "https://www.dws.gov.za/Hydrology/Weekly/Weekly.aspx"
    log.info("Fetching DWS dam levels from %s", url)
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.raise_for_status()
    except requests.RequestException as e:
        log.warning("DWS fetch failed: %s — using fallback", e)
        return _fallback_dam_levels()

    soup = BeautifulSoup(resp.text, "html.parser")
    rows = []
    now = datetime.utcnow().isoformat()

    for table in soup.find_all("table"):
        for tr in table.find_all("tr")[1:]:
            cells = [td.get_text(strip=True) for td in tr.find_all("td")]
            if len(cells) < 4:
                continue
            dam_name = cells[0]
            if dam_name not in DAM_PROVINCE_MAP:
                continue
            level_pct: Optional[float] = None
            for cell in cells[1:4]:
                clean = re.sub(r"[^\d.]", "", cell)
                if clean:
                    try:
                        val = float(clean)
                        if 0 <= val <= 150:
                            level_pct = min(val, 100.0)
                            break
                    except ValueError:
                        pass
            if level_pct is None:
                continue
            rows.append({
                "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"dam-{dam_name}")),
                "province": DAM_PROVINCE_MAP[dam_name],
                "damName": dam_name,
                "levelPercent": level_pct,
                "trend": "stable",
                "urgency": _dam_urgency(level_pct),
                "sourceUrl": url,
                "lastUpdated": now,
                "isFallback": False,
            })

    if rows:
        log.info("Parsed %d dam records from DWS", len(rows))
        return rows

    log.warning("No dam rows parsed — using fallback")
    return _fallback_dam_levels()


# ── Alert scraper ─────────────────────────────────────────────────────────────

MUNICIPALITY_SOURCES = [
    {"province": "Gauteng",       "municipality": "City of Johannesburg", "url": "https://www.joburg.org.za/services_/Pages/Water-and-Sanitation.aspx",    "sourceUrl": "https://www.joburg.org.za"},
    {"province": "Gauteng",       "municipality": "City of Tshwane",      "url": "https://www.tshwane.gov.za/Sites/Departments/Water-and-Sanitation/Pages/Water-Notices.aspx", "sourceUrl": "https://www.tshwane.gov.za"},
    {"province": "Western Cape",  "municipality": "City of Cape Town",    "url": "https://www.capetown.gov.za/Family%20and%20home/residential-utility-services/residential-water-and-sanitation-services/water-restrictions-and-water-conservation", "sourceUrl": "https://www.capetown.gov.za"},
    {"province": "KwaZulu-Natal", "municipality": "eThekwini",            "url": "https://www.ethekwini.gov.za/services/customer-care/water-and-sanitation", "sourceUrl": "https://www.ethekwini.gov.za"},
]

WATER_KEYWORDS = [
    "water outage", "water interruption", "supply interruption", "water restriction",
    "boil water", "water advisory", "pipe burst", "pipe failure",
    "no water", "low pressure", "maintenance", "repair",
]

URGENCY_KEYWORDS = {
    "boil water": "critical", "contamination": "critical",
    "water restriction": "medium", "outage": "high",
    "interruption": "high", "pipe burst": "high",
    "repair": "medium", "maintenance": "medium", "low pressure": "low",
}

RECOMMENDATIONS = {
    "critical": "Boil all water for at least 1 minute before drinking or cooking. Do not use tap water until advisory is lifted.",
    "high": "Store sufficient water before the outage window. Use stored water sparingly.",
    "medium": "Reduce non-essential water use. Comply with any restrictions in place.",
    "low": "Monitor the situation. Consider storing a small emergency water supply.",
}


def _detect_urgency(text: str) -> str:
    t = text.lower()
    for kw, level in URGENCY_KEYWORDS.items():
        if kw in t:
            return level
    return "low"


def scrape_municipality_alerts() -> list[dict]:
    alerts = []
    now = datetime.utcnow().isoformat()
    for src in MUNICIPALITY_SOURCES:
        try:
            resp = requests.get(src["url"], headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                continue
            soup = BeautifulSoup(resp.text, "html.parser")
            for el in soup.find_all(["h2", "h3", "h4", "p", "li"]):
                text = el.get_text(strip=True)
                if len(text) < 20 or len(text) > 400:
                    continue
                if not any(kw in text.lower() for kw in WATER_KEYWORDS):
                    continue
                urgency = _detect_urgency(text)
                alerts.append({
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"alert-{src['municipality']}-{text[:60]}")),
                    "province": src["province"],
                    "municipality": src["municipality"],
                    "title": text[:120],
                    "description": text,
                    "urgency": urgency,
                    "affectedAreas": [],
                    "recommendation": RECOMMENDATIONS.get(urgency, ""),
                    "status": "active",
                    "startDate": now,
                    "sourceUrl": src["sourceUrl"],
                    "fetchedAt": now,
                })
            log.info("Scraped %s: %d total alerts so far", src["municipality"], len(alerts))
        except requests.RequestException as e:
            log.warning("Failed %s: %s", src["municipality"], e)
    return alerts


# ── Main ──────────────────────────────────────────────────────────────────────

def run():
    log.info("=== SA Water Scraper starting ===")
    dams   = scrape_dws_dam_levels()
    alerts = scrape_municipality_alerts()
    now    = datetime.utcnow().isoformat()

    output = {
        "fetched_at": now,
        "dams": dams,
        "alerts": alerts,
    }

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir   = os.path.join(repo_root, "landingpage", "public", "data", "water")
    os.makedirs(out_dir, exist_ok=True)
    out_path  = os.path.join(out_dir, "latest.json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    log.info("Wrote %d dams + %d alerts to %s", len(dams), len(alerts), out_path)
    log.info("=== Scraper complete ===")


if __name__ == "__main__":
    run()
