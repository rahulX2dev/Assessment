import re
import time
from dataclasses import dataclass

from app.schemas import (
    ChatReply,
    ChatRequest,
    ClassifyResult,
    Intent,
    Sentiment,
)

TOKEN_PATTERN = re.compile(r"[a-z0-9']+")

INTENT_SIGNALS: dict[Intent, tuple[str, ...]] = {
    Intent.PRICING_ENQUIRY: (
        "price", "pricing", "cost", "quote", "charges", "rate", "plan", "how much", "fees",
    ),
    Intent.PAYMENT_PLAN_REQUEST: (
        "instalment", "installment", "emi", "part payment", "pay later", "split payment",
        "two parts", "monthly payment",
    ),
    Intent.SUPPORT_ISSUE: (
        "not working", "issue", "error", "bug", "broken", "failed", "problem", "stuck",
        "cannot", "can't", "unable", "complaint",
    ),
    Intent.DEMO_REQUEST: (
        "demo", "walkthrough", "trial", "show me", "book a call", "schedule", "onboarding",
    ),
    Intent.CANCELLATION: (
        "cancel", "refund", "terminate", "close my account", "downgrade", "stop billing",
    ),
    Intent.OPT_OUT: (
        "unsubscribe", "opt out", "stop messaging", "do not message", "remove me", "stop",
    ),
}

POSITIVE_WORDS = frozenset({
    "thanks", "thank", "great", "perfect", "awesome", "good", "happy", "love", "excellent",
    "helpful", "brilliant", "smooth",
})

NEGATIVE_WORDS = frozenset({
    "angry", "worst", "bad", "terrible", "useless", "poor", "delay", "delayed", "frustrated",
    "disappointed", "never", "waiting", "refund", "complaint", "unacceptable",
})

ROUTING = {
    Intent.PRICING_ENQUIRY: "sales",
    Intent.PAYMENT_PLAN_REQUEST: "finance",
    Intent.SUPPORT_ISSUE: "support",
    Intent.DEMO_REQUEST: "sales",
    Intent.CANCELLATION: "retention",
    Intent.OPT_OUT: "compliance",
    Intent.GENERAL_QUERY: "support",
}

REPLIES = {
    Intent.PRICING_ENQUIRY: (
        "Happy to help with pricing. Growth is Rs 7,999 a month and covers 50,000 conversations, "
        "10 seats and the automation studio. Would you like the full breakdown on a quick call?"
    ),
    Intent.PAYMENT_PLAN_REQUEST: (
        "We can split this into instalments. The usual arrangement is 60% now and 40% within "
        "fifteen days. I am routing you to the finance team to confirm the schedule."
    ),
    Intent.SUPPORT_ISSUE: (
        "Sorry that this is not working as expected. I have raised a ticket and a support "
        "engineer will pick it up. Could you share a screenshot and the time it last happened?"
    ),
    Intent.DEMO_REQUEST: (
        "I can set up a walkthrough. Sessions run about 30 minutes and cover campaigns, the CRM "
        "pipeline and reporting. Which day this week suits you?"
    ),
    Intent.CANCELLATION: (
        "I understand you are considering cancelling. Before we process it, may I ask what is not "
        "working for you? Our retention team can often adjust the plan instead."
    ),
    Intent.OPT_OUT: (
        "You have been removed from our messaging list and will not receive further campaigns. "
        "Transactional updates about existing orders will still reach you."
    ),
    Intent.GENERAL_QUERY: (
        "Thanks for reaching out. I have passed this to the team and someone will respond shortly. "
        "Is there anything else I can note down for them?"
    ),
}

ACTIONS = {
    Intent.PRICING_ENQUIRY: ["send_pricing_pdf", "create_deal", "schedule_followup"],
    Intent.PAYMENT_PLAN_REQUEST: ["notify_finance", "generate_instalment_plan"],
    Intent.SUPPORT_ISSUE: ["create_ticket", "attach_conversation", "notify_support_lead"],
    Intent.DEMO_REQUEST: ["send_calendar_link", "create_deal", "assign_owner"],
    Intent.CANCELLATION: ["notify_retention", "offer_downgrade", "flag_churn_risk"],
    Intent.OPT_OUT: ["set_opted_out", "suppress_from_campaigns"],
    Intent.GENERAL_QUERY: ["assign_agent"],
}

ESCALATION_INTENTS = frozenset({Intent.CANCELLATION, Intent.SUPPORT_ISSUE, Intent.PAYMENT_PLAN_REQUEST})


@dataclass(frozen=True)
class Classification:
    intent: Intent
    sentiment: Sentiment
    confidence: float
    keywords: tuple[str, ...]


def _tokenise(text: str) -> list[str]:
    return TOKEN_PATTERN.findall(text.lower())


def classify(text: str) -> Classification:
    lowered = text.lower()
    tokens = _tokenise(text)
    token_set = set(tokens)

    scores: dict[Intent, int] = {}
    matched: dict[Intent, list[str]] = {}

    for intent, signals in INTENT_SIGNALS.items():
        hits = [signal for signal in signals if signal in lowered]
        if hits:
            scores[intent] = sum(2 if " " in signal else 1 for signal in hits)
            matched[intent] = hits

    if scores:
        intent = max(scores, key=lambda key: scores[key])
        top = scores[intent]
        total = sum(scores.values())

        margin = top / total
        evidence = min(top / 4, 1.0)
        confidence = round(min(0.96, 0.45 + margin * 0.3 + evidence * 0.21), 2)
        keywords = tuple(matched[intent][:5])
    else:
        intent = Intent.GENERAL_QUERY
        confidence = 0.4
        keywords = ()

    positive = len(token_set & POSITIVE_WORDS)
    negative = len(token_set & NEGATIVE_WORDS)

    if negative > positive:
        sentiment = Sentiment.NEGATIVE
    elif positive > negative:
        sentiment = Sentiment.POSITIVE
    else:
        sentiment = Sentiment.NEUTRAL

    return Classification(intent=intent, sentiment=sentiment, confidence=confidence, keywords=keywords)


def classify_to_schema(text: str) -> ClassifyResult:
    result = classify(text)
    return ClassifyResult(
        intent=result.intent,
        sentiment=result.sentiment,
        confidence=result.confidence,
        keywords=list(result.keywords),
        routing_queue=ROUTING[result.intent],
    )


def answer(request: ChatRequest) -> ChatReply:
    started = time.perf_counter()
    result = classify(request.message)

    escalate = result.intent in ESCALATION_INTENTS or result.sentiment is Sentiment.NEGATIVE

    return ChatReply(
        reply=REPLIES[result.intent],
        intent=result.intent,
        sentiment=result.sentiment,
        confidence=result.confidence,
        suggested_actions=ACTIONS[result.intent],
        escalate_to_human=escalate,
        latency_ms=int((time.perf_counter() - started) * 1000),
    )
