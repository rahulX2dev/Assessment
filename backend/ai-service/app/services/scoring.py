from datetime import datetime, timezone

from app.schemas import LeadScore, LeadScoreRequest, Recommendation, RecommendationSet

WEIGHTS = {
    "replies": 8,
    "page_views": 3,
    "opened_pricing": 20,
    "company_size": 1,
    "recency": 25,
}

CAPS = {
    "replies": 32,
    "page_views": 18,
    "company_size": 15,
}


def _recency_points(days: int) -> int:
    if days <= 1:
        return WEIGHTS["recency"]
    if days <= 3:
        return 18
    if days <= 7:
        return 12
    if days <= 14:
        return 6
    if days <= 30:
        return 2
    return 0


def _band(score: int) -> str:
    if score >= 75:
        return "hot"
    if score >= 45:
        return "warm"
    if score >= 20:
        return "cool"
    return "cold"


def score_lead(request: LeadScoreRequest) -> LeadScore:
    factors = {
        "replies": min(request.replies * WEIGHTS["replies"], CAPS["replies"]),
        "page_views": min(request.page_views * WEIGHTS["page_views"], CAPS["page_views"]),
        "opened_pricing": WEIGHTS["opened_pricing"] if request.opened_pricing else 0,
        "company_size": min(request.company_size // 10 * WEIGHTS["company_size"], CAPS["company_size"]),
        "recency": _recency_points(request.days_since_last_touch),
    }

    total = min(100, sum(factors.values()))
    band = _band(total)

    next_step = {
        "hot": "Call today and create a deal at the Demo stage",
        "warm": "Send the pricing template and book a walkthrough this week",
        "cool": "Add to the nurture sequence and revisit in ten days",
        "cold": "Keep in the newsletter audience only",
    }[band]

    return LeadScore(
        contact_id=request.contact_id,
        score=total,
        band=band,
        factors=factors,
        recommended_next_step=next_step,
    )


def recommendations_for(contact_id: str, score: LeadScore | None = None) -> RecommendationSet:
    band = score.band if score else "warm"

    catalogue: dict[str, list[Recommendation]] = {
        "hot": [
            Recommendation(
                title="Call within the next two hours",
                reason="Engagement peaked in the last 24 hours and pricing was viewed",
                channel="phone",
                priority=1,
            ),
            Recommendation(
                title="Send the Growth plan proposal",
                reason="Buying signals match accounts that convert on the Growth tier",
                channel="whatsapp",
                priority=2,
            ),
        ],
        "warm": [
            Recommendation(
                title="Share a 3 minute product walkthrough",
                reason="Repeat visits without a pricing view usually need product context",
                channel="whatsapp",
                priority=1,
            ),
            Recommendation(
                title="Offer a slot for a live demo",
                reason="Demo attendance roughly doubles the close rate at this stage",
                channel="email",
                priority=2,
            ),
        ],
        "cool": [
            Recommendation(
                title="Add to the fortnightly nurture sequence",
                reason="Low recent activity, needs value content before a sales touch",
                channel="email",
                priority=2,
            ),
        ],
        "cold": [
            Recommendation(
                title="Keep in newsletter audience only",
                reason="No meaningful engagement signal in the last 30 days",
                channel="email",
                priority=3,
            ),
        ],
    }

    return RecommendationSet(
        contact_id=contact_id,
        generated_at=datetime.now(timezone.utc),
        recommendations=catalogue[band],
    )
