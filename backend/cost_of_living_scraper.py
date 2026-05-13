"""
Monthly cost-of-living scraper for SA Career Guide.
Attempts to fetch current petrol prices from the AA website and merges
them with hardcoded estimates for electricity, water, and food.
Outputs to public/data/cost-of-living.json.

Run: python backend/cost_of_living_scraper.py
Schedule: GitHub Actions on the 1st of each month at 10:00
"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any

import requests
from bs4 import BeautifulSoup


# ── Hardcoded 2026 baseline estimates (overwritten by scraped data where available) ──

BASELINE_PROVINCES: Dict[str, Dict[str, Any]] = {
    "gauteng":        {"name": "Gauteng",        "petrol_95": 22.89, "petrol_93": 22.63, "diesel": 21.45, "electricity_per_kwh": 2.84, "water_per_kl": 15.20},
    "western_cape":   {"name": "Western Cape",   "petrol_95": 23.15, "petrol_93": 22.89, "diesel": 21.72, "electricity_per_kwh": 3.10, "water_per_kl": 18.50},
    "kwazulu_natal":  {"name": "KwaZulu-Natal",  "petrol_95": 23.02, "petrol_93": 22.76, "diesel": 21.59, "electricity_per_kwh": 2.72, "water_per_kl": 13.80},
    "eastern_cape":   {"name": "Eastern Cape",   "petrol_95": 23.28, "petrol_93": 23.02, "diesel": 21.85, "electricity_per_kwh": 2.65, "water_per_kl": 12.40},
    "limpopo":        {"name": "Limpopo",        "petrol_95": 23.55, "petrol_93": 23.29, "diesel": 22.12, "electricity_per_kwh": 2.58, "water_per_kl": 11.20},
    "mpumalanga":     {"name": "Mpumalanga",     "petrol_95": 23.40, "petrol_93": 23.14, "diesel": 21.97, "electricity_per_kwh": 2.61, "water_per_kl": 11.80},
    "north_west":     {"name": "North West",     "petrol_95": 23.45, "petrol_93": 23.19, "diesel": 22.02, "electricity_per_kwh": 2.55, "water_per_kl": 11.50},
    "free_state":     {"name": "Free State",     "petrol_95": 23.38, "petrol_93": 23.12, "diesel": 21.95, "electricity_per_kwh": 2.60, "water_per_kl": 12.00},
    "northern_cape":  {"name": "Northern Cape",  "petrol_95": 23.62, "petrol_93": 23.36, "diesel": 22.19, "electricity_per_kwh": 2.52, "water_per_kl": 13.20},
}

FOOD_BASKET = {
    "note": "Average retail prices at major SA supermarkets",
    "items": [
        {"name": "Brown bread (700g)",     "price": 14.99},
        {"name": "Full cream milk (2L)",   "price": 38.99},
        {"name": "Chicken braai pack (1kg)","price": 89.99},
        {"name": "Rice (2kg)",             "price": 42.99},
        {"name": "Eggs (6 pack)",          "price": 28.99},
        {"name": "Sunflower oil (750ml)",  "price": 44.99},
        {"name": "Tomatoes (1kg)",         "price": 22.99},
        {"name": "Onions (1kg)",           "price": 14.99},
        {"name": "Potatoes (2kg)",         "price": 29.99},
        {"name": "Maize meal (5kg)",       "price": 69.99},
    ],
    "monthly_estimate": {"single": 1800, "couple": 2800, "family_4": 4500},
}

LIFESTYLE_TIERS = {
    "minimal": {
        "label": "Minimal (student/starter)",
        "description": "Shared accommodation, public transport, basic food",
        "provinces": {
            "gauteng": 6500, "western_cape": 7200, "kwazulu_natal": 6200,
            "eastern_cape": 5800, "limpopo": 5200, "mpumalanga": 5400,
            "north_west": 5300, "free_state": 5500, "northern_cape": 5600,
        },
    },
    "moderate": {
        "label": "Moderate (working professional)",
        "description": "Own room, own car, standard grocery shop",
        "provinces": {
            "gauteng": 12500, "western_cape": 14000, "kwazulu_natal": 11500,
            "eastern_cape": 10500, "limpopo": 9500, "mpumalanga": 9800,
            "north_west": 9600, "free_state": 10000, "northern_cape": 10200,
        },
    },
    "comfortable": {
        "label": "Comfortable (established)",
        "description": "Own apartment, newer car, dining out occasionally",
        "provinces": {
            "gauteng": 22000, "western_cape": 26000, "kwazulu_natal": 20000,
            "eastern_cape": 18000, "limpopo": 16000, "mpumalanga": 16500,
            "north_west": 16200, "free_state": 17000, "northern_cape": 17500,
        },
    },
}


def try_scrape_aa_petrol() -> Dict[str, float]:
    """
    Attempt to scrape Gauteng 95 ULP from AA website.
    Returns {"petrol_95": float} or empty dict on failure.
    AA pages are JavaScript-rendered so scraping may fail — baseline is used as fallback.
    """
    try:
        resp = requests.get("https://www.aa.co.za/fuel-price/",
                            timeout=12, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.content, "html.parser")

        for el in soup.find_all(["td", "span", "p"]):
            text = el.get_text(strip=True).replace(",", ".")
            if "22." in text or "23." in text or "24." in text:
                try:
                    val = float(text[:5])
                    if 18.0 < val < 35.0:
                        print(f"[aa] Parsed petrol 95: R{val}", file=sys.stderr)
                        return {"petrol_95": val}
                except ValueError:
                    continue
    except Exception as e:
        print(f"[aa] Could not scrape: {e}", file=sys.stderr)

    return {}


def build_province_data(aa_override: Dict[str, float]) -> Dict[str, Any]:
    """Merge AA scraped data into baseline province data and add monthly estimates."""
    provinces: Dict[str, Any] = {}

    for key, base in BASELINE_PROVINCES.items():
        prov = dict(base)

        # Apply AA override for Gauteng petrol 95 and propagate differences to other provinces
        if "petrol_95" in aa_override and key == "gauteng":
            diff = aa_override["petrol_95"] - base["petrol_95"]
            prov["petrol_95"] = round(aa_override["petrol_95"], 2)
            prov["petrol_93"] = round(base["petrol_93"] + diff, 2)
            prov["diesel"] = round(base["diesel"] + diff * 0.85, 2)
        elif "petrol_95" in aa_override:
            # Inland provinces pay a transport levy on top of Gauteng price
            gaut_base = BASELINE_PROVINCES["gauteng"]["petrol_95"]
            diff = aa_override["petrol_95"] - gaut_base
            prov["petrol_95"] = round(base["petrol_95"] + diff, 2)
            prov["petrol_93"] = round(base["petrol_93"] + diff, 2)
            prov["diesel"] = round(base["diesel"] + diff * 0.85, 2)

        kwh = prov["electricity_per_kwh"]
        prov["electricity_monthly_estimate"] = {
            "low":    {"kwh": 100, "cost": round(kwh * 100)},
            "medium": {"kwh": 250, "cost": round(kwh * 250)},
            "high":   {"kwh": 500, "cost": round(kwh * 500)},
        }

        kl = prov["water_per_kl"]
        prov["water_monthly_estimate"] = {
            "low":    {"kl": 6,  "cost": round(kl * 6  + 80)},
            "medium": {"kl": 15, "cost": round(kl * 15 + 80)},
            "high":   {"kl": 30, "cost": round(kl * 30 + 80)},
        }

        provinces[key] = prov

    return provinces


def run():
    aa_data = try_scrape_aa_petrol()
    provinces = build_province_data(aa_data)

    output = {
        "last_updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": "Estimates based on published rates (AA, Eskom, Stats SA)",
        "currency": "ZAR",
        "provinces": provinces,
        "food_basket": FOOD_BASKET,
        "lifestyle_monthly_total": {"tiers": LIFESTYLE_TIERS},
    }

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(repo_root, "landingpage", "public", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "cost-of-living.json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"[cost_of_living_scraper] Written to {out_path}")
    if aa_data:
        print(f"[cost_of_living_scraper] AA petrol 95 (Gauteng): R{aa_data['petrol_95']}")
    else:
        print("[cost_of_living_scraper] AA scrape failed — using 2026 baseline estimates")


if __name__ == "__main__":
    run()
