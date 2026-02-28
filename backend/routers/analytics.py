import os
import uuid

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class AnalyticsEvent(BaseModel):
    legal_category: str
    pin_code: str
    state: str
    city: str


# In-memory store for demo purposes (resets on server restart)
# Replace with a persistent DB (Supabase) if needed after the hackathon
_analytics_store: list[dict] = []


@router.post("/log-case")
def log_case(event: AnalyticsEvent):
    """
    Logs an anonymized case event for analytics.
    Uses in-memory storage for the hackathon demo.
    """
    _analytics_store.append(
        {
            "id": str(uuid.uuid4()),
            "legal_category": event.legal_category,
            "pin_code": event.pin_code,
            "state": event.state,
            "city": event.city,
        }
    )
    return {"status": "logged", "total_cases": len(_analytics_store)}


@router.get("/hotspots")
def get_hotspots():
    """
    Returns aggregated case hotspots from the in-memory store.
    """
    from collections import Counter

    counts: Counter = Counter()
    for entry in _analytics_store:
        key = (entry["pin_code"], entry["state"], entry["city"], entry["legal_category"])
        counts[key] += 1

    results = [
        {"pin_code": k[0], "state": k[1], "city": k[2], "category": k[3], "count": v}
        for k, v in counts.most_common(20)
    ]
    return results


@router.get("/summary")
def get_summary():
    """
    Returns high-level summary stats for the dashboard.
    """
    from collections import Counter

    if not _analytics_store:
        return {"total_cases": 0, "top_category": None, "top_state": None}

    categories = Counter(e["legal_category"] for e in _analytics_store)
    states = Counter(e["state"] for e in _analytics_store)

    return {
        "total_cases": len(_analytics_store),
        "top_category": categories.most_common(1)[0][0] if categories else None,
        "top_state": states.most_common(1)[0][0] if states else None,
        "category_breakdown": dict(categories),
    }
