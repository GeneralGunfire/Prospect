"""
Daily news scraper for SA Career Guide.
Fetches articles from News24 and BusinessTech, filters sensitive content,
scores importance 0-100, and writes top 50 to public/data/news/latest.json.

Run: python backend/news_scraper.py
Schedule: GitHub Actions daily at 08:00 SAST
"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import List, Dict

import requests
from bs4 import BeautifulSoup

# ── Sensitivity filter — articles containing ANY of these are excluded ──────────

EXCLUDED_KEYWORDS = [
    # health/sensitive
    "covid", "pandemic", "virus", "hiv", "aids", "std", "sti",
    # violence/crime
    "murder", "killing", "killed", "death", "dead", "rape", "assault",
    "violence", "shooting", "stabbing", "hijack", "robbery", "theft",
    "crime", "criminal", "arrest", "sentenced", "prison", "jail",
    # social/political conflict
    "xenophobia", "racism", "racist", "protest", "strike", "shutdown",
    "riot", "looting", "unrest",
    # sensitive social topics
    "lgbtq", "gay", "lesbian", "transgender", "gender-based",
    "suicide", "self-harm", "sexual", "sex worker",
    # substance
    "drug", "narcotics", "alcohol", "substance abuse",
    # corruption
    "corruption", "fraud", "bribery", "money laundering", "accused",
]

# ── Priority topics — articles mentioning these score higher ───────────────────

PRIORITY_KEYWORDS: Dict[str, str] = {
    # Job Market
    "load shedding": "Job Market",
    "loadshedding": "Job Market",
    "electricity": "Job Market",
    "renewable energy": "Job Market",
    "solar": "Job Market",
    "unemployment": "Job Market",
    "job creation": "Job Market",
    "jobs": "Job Market",
    "skills shortage": "Job Market",
    "minimum wage": "Job Market",
    "employment": "Job Market",
    "hiring": "Job Market",
    # Education
    "university": "Education",
    "universities": "Education",
    "matric": "Education",
    "nsfas": "Education",
    "tuition": "Education",
    "school": "Education",
    "tvet": "Education",
    "bursary": "Education",
    "scholarship": "Education",
    "higher education": "Education",
    "dhet": "Education",
    "dbe": "Education",
    # Economy
    "inflation": "Economy",
    "cost of living": "Economy",
    "interest rate": "Economy",
    "rand": "Economy",
    "economy": "Economy",
    "petrol": "Economy",
    "fuel price": "Economy",
    "grocery": "Economy",
    "food price": "Economy",
    "eskom": "Economy",
    "tariff": "Economy",
    # Government
    "tax": "Government",
    "sars": "Government",
    "policy": "Government",
    "parliament": "Government",
    "government": "Government",
    "budget": "Government",
    "national treasury": "Government",
    "home affairs": "Government",
    "social grant": "Government",
    "sassa": "Government",
}


def is_sensitive(title: str, summary: str) -> bool:
    """Return True if article should be excluded."""
    content = f"{title} {summary}".lower()
    return any(kw in content for kw in EXCLUDED_KEYWORDS)


def score_and_categorise(title: str, summary: str) -> tuple[int, str]:
    """Return (priority_score 0-100, category string)."""
    content = f"{title} {summary}".lower()
    score = 0
    category = "General"
    seen_categories: Dict[str, int] = {}

    for kw, cat in PRIORITY_KEYWORDS.items():
        if kw in content:
            score += 15
            seen_categories[cat] = seen_categories.get(cat, 0) + 1

    if seen_categories:
        category = max(seen_categories, key=lambda c: seen_categories[c])

    return min(score, 100), category


def scrape_news24() -> List[Dict]:
    """Scrape News24 South Africa."""
    articles = []
    urls = [
        "https://www.news24.com/news24/southafrica/news",
        "https://www.news24.com/fin24",
    ]
    for url in urls:
        try:
            resp = requests.get(url, timeout=12, headers={"User-Agent": "Mozilla/5.0"})
            soup = BeautifulSoup(resp.content, "html.parser")

            for article in soup.find_all("article")[:25]:
                try:
                    h = article.find(["h2", "h3", "h4"])
                    p = article.find("p")
                    a = article.find("a", href=True)

                    title = h.get_text(strip=True) if h else ""
                    summary = p.get_text(strip=True) if p else ""
                    link = a["href"] if a else url

                    if not title or len(title) < 20:
                        continue
                    if is_sensitive(title, summary):
                        continue

                    score, category = score_and_categorise(title, summary)
                    if score < 15:
                        continue

                    articles.append({
                        "id": f"n24-{abs(hash(title)) % 100000}",
                        "source": "News24",
                        "title": title,
                        "summary": summary or title,
                        "category": category,
                        "priority_score": score,
                        "url": link if link.startswith("http") else f"https://www.news24.com{link}",
                        "date": datetime.now(timezone.utc).isoformat(),
                    })
                except Exception:
                    continue
        except Exception as e:
            print(f"[news24] Error scraping {url}: {e}", file=sys.stderr)

    return articles


def scrape_businesstech() -> List[Dict]:
    """Scrape BusinessTech."""
    articles = []
    urls = [
        "https://businesstech.co.za/news/",
        "https://businesstech.co.za/news/finance/",
        "https://businesstech.co.za/news/energy/",
    ]
    for url in urls:
        try:
            resp = requests.get(url, timeout=12, headers={"User-Agent": "Mozilla/5.0"})
            soup = BeautifulSoup(resp.content, "html.parser")

            for article in soup.find_all("article")[:20]:
                try:
                    h = article.find(["h2", "h3"])
                    p = article.find("p")
                    a = article.find("a", href=True)

                    title = h.get_text(strip=True) if h else ""
                    summary = p.get_text(strip=True) if p else ""
                    link = a["href"] if a else url

                    if not title or len(title) < 20:
                        continue
                    if is_sensitive(title, summary):
                        continue

                    score, category = score_and_categorise(title, summary)
                    if score < 15:
                        continue

                    articles.append({
                        "id": f"bt-{abs(hash(title)) % 100000}",
                        "source": "BusinessTech",
                        "title": title,
                        "summary": summary or title,
                        "category": category,
                        "priority_score": score,
                        "url": link if link.startswith("http") else f"https://businesstech.co.za{link}",
                        "date": datetime.now(timezone.utc).isoformat(),
                    })
                except Exception:
                    continue
        except Exception as e:
            print(f"[businesstech] Error scraping {url}: {e}", file=sys.stderr)

    return articles


def deduplicate(articles: List[Dict]) -> List[Dict]:
    """Remove articles with near-identical titles."""
    seen: set[str] = set()
    unique = []
    for art in articles:
        key = art["title"][:60].lower().strip()
        if key not in seen:
            seen.add(key)
            unique.append(art)
    return unique


def run():
    all_articles: List[Dict] = []
    all_articles.extend(scrape_news24())
    all_articles.extend(scrape_businesstech())

    all_articles = deduplicate(all_articles)
    all_articles.sort(key=lambda x: x["priority_score"], reverse=True)
    top_50 = all_articles[:50]

    # Determine output path — works whether run from repo root or backend/
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(repo_root, "landingpage", "public", "data", "news")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "latest.json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(top_50, f, ensure_ascii=False, indent=2)

    print(f"[news_scraper] Wrote {len(top_50)} articles to {out_path}")


if __name__ == "__main__":
    run()
