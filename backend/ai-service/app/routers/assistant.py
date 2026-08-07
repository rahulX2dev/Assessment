import logging

from fastapi import APIRouter, Depends

from app.schemas import (
    ApiResponse,
    ChatReply,
    ChatRequest,
    ClassifyRequest,
    ClassifyResult,
    LeadScore,
    LeadScoreRequest,
    RecommendationSet,
)
from app.security import Principal, current_principal
from app.services import assistant, scoring

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["AI Assistant"])


@router.post("/assistant/chat", response_model=ApiResponse[ChatReply])
def chat(request: ChatRequest, principal: Principal = Depends(current_principal)):
    reply = assistant.answer(request)

    log.info(
        "assistant reply generated",
        extra={
            "tenant_id": principal.tenant_id,
            "intent": reply.intent.value,
            "escalate": reply.escalate_to_human,
        },
    )

    return ApiResponse(data=reply)


@router.post("/assistant/classify", response_model=ApiResponse[ClassifyResult])
def classify(request: ClassifyRequest, principal: Principal = Depends(current_principal)):
    return ApiResponse(data=assistant.classify_to_schema(request.text))


@router.post("/assistant/score", response_model=ApiResponse[LeadScore])
def score(request: LeadScoreRequest, principal: Principal = Depends(current_principal)):
    return ApiResponse(data=scoring.score_lead(request))


@router.get("/recommendations/{contact_id}", response_model=ApiResponse[RecommendationSet])
def recommendations(
    contact_id: str,
    replies: int = 0,
    page_views: int = 0,
    days_since_last_touch: int = 0,
    opened_pricing: bool = False,
    principal: Principal = Depends(current_principal),
):
    lead = scoring.score_lead(
        LeadScoreRequest(
            contactId=contact_id,
            replies=replies,
            pageViews=page_views,
            daysSinceLastTouch=days_since_last_touch,
            openedPricing=opened_pricing,
        )
    )

    return ApiResponse(
        data=scoring.recommendations_for(contact_id, lead),
        meta={"score": lead.score, "band": lead.band},
    )
