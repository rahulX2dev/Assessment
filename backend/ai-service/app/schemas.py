from datetime import date, datetime
from enum import Enum
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    meta: dict[str, Any] | None = None


class Intent(str, Enum):
    PRICING_ENQUIRY = "pricing_enquiry"
    PAYMENT_PLAN_REQUEST = "payment_plan_request"
    SUPPORT_ISSUE = "support_issue"
    DEMO_REQUEST = "demo_request"
    CANCELLATION = "cancellation"
    OPT_OUT = "opt_out"
    GENERAL_QUERY = "general_query"


class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    tenant_id: str | None = Field(default=None, alias="tenantId")
    contact_id: str | None = Field(default=None, alias="contactId")
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)

    model_config = {"populate_by_name": True}


class ChatReply(BaseModel):
    reply: str
    intent: Intent
    sentiment: Sentiment
    confidence: float
    suggested_actions: list[str]
    escalate_to_human: bool
    latency_ms: int


class ClassifyRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)


class ClassifyResult(BaseModel):
    intent: Intent
    sentiment: Sentiment
    confidence: float
    keywords: list[str]
    routing_queue: str


class LeadScoreRequest(BaseModel):
    contact_id: str = Field(alias="contactId")
    replies: int = 0
    page_views: int = Field(default=0, alias="pageViews")
    days_since_last_touch: int = Field(default=0, alias="daysSinceLastTouch")
    opened_pricing: bool = Field(default=False, alias="openedPricing")
    company_size: int = Field(default=0, alias="companySize")

    model_config = {"populate_by_name": True}


class LeadScore(BaseModel):
    contact_id: str
    score: int
    band: str
    factors: dict[str, int]
    recommended_next_step: str


class Recommendation(BaseModel):
    title: str
    reason: str
    channel: str
    priority: int


class RecommendationSet(BaseModel):
    contact_id: str
    generated_at: datetime
    recommendations: list[Recommendation]


class DashboardPoint(BaseModel):
    day: date
    sent: int
    delivered: int
    read: int
    replies: int


class DashboardAnalytics(BaseModel):
    tenant_id: str
    window_days: int
    totals: dict[str, int]
    delivery_rate: float
    read_rate: float
    reply_rate: float
    series: list[DashboardPoint]
    top_intents: list[dict[str, Any]]


class OcrRequest(BaseModel):
    file_id: str = Field(alias="fileId")
    document_type: str = Field(default="invoice", alias="documentType")

    model_config = {"populate_by_name": True}


class OcrResult(BaseModel):
    file_id: str
    document_type: str
    confidence: float
    fields: dict[str, str]
    raw_text_preview: str


class JobRecord(BaseModel):
    id: str
    name: str
    state: str
    scheduled_for: datetime | None = None
    finished_at: datetime | None = None
    detail: str | None = None
