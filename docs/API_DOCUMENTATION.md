# API Documentation

Base URLs

| Environment | Gateway | Core service | AI service |
|---|---|---|---|
| Local | `http://localhost:8080/api` | `http://localhost:8081` | `http://localhost:8000` |
| Docker Compose | `http://localhost/api` | internal only | internal only |
| Production | `https://app.hubflow.io/api` | internal only | internal only |

Interactive references: Swagger UI at `http://localhost:8081/swagger-ui.html`
(30 documented paths) and FastAPI docs at `http://localhost:8000/docs` (10 paths).

## Conventions

Every response uses one envelope.

Success:

```json
{ "success": true, "data": { }, "meta": { } }
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more fields failed validation",
    "details": { "email": "must be a well-formed email address" },
    "path": "/api/v1/auth/register",
    "requestId": "0f1c9a2e-..."
  }
}
```

`meta` carries pagination when a list is returned:

```json
{ "page": 0, "size": 20, "totalElements": 184, "totalPages": 10, "hasNext": true }
```

### Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Field-level validation failed; see `details` |
| `BAD_REQUEST` | 400 | Business rule rejected the request |
| `UNAUTHORIZED` | 401 | Missing, malformed or invalid token |
| `TOKEN_EXPIRED` | 401 | Access token expired; use the refresh endpoint |
| `FORBIDDEN` | 403 | Authenticated but lacking the required role |
| `RESOURCE_NOT_FOUND` | 404 | Entity does not exist in this tenant |
| `CONFLICT` | 409 | Uniqueness or state conflict |
| `RATE_LIMITED` | 429 | Bucket exhausted; see `Retry-After` |
| `UPSTREAM_ERROR` | 502 | A downstream service failed |
| `SERVICE_UNAVAILABLE` | 503 | Circuit breaker open |

### Authentication

All endpoints except registration, login, refresh, OTP, the public plan catalogue
and WhatsApp webhooks require:

```
Authorization: Bearer <accessToken>
```

Access tokens last 15 minutes. Refresh tokens last 30 days, are single-use, and
rotate on every refresh. Replaying a consumed refresh token revokes every token in
that family.

### Rate limits

| Bucket | Limit | Window |
|---|---|---|
| General authenticated | 120 requests | 60s |
| Login / registration | 10 requests | 60s |
| OTP send/verify | 5 requests | 15 min per phone |
| Campaign dispatch | 10 requests | 60s |
| AI endpoints | 60 requests | 60s |
| File upload | 20 requests | 60s |

Responses carry `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset`.

---

## Authentication

### POST /v1/auth/register

Creates a tenant and its owner account, then sends a phone-verification OTP.

```json
{
  "fullName": "Rahul Pathak",
  "email": "owner@acme-retail.in",
  "phone": "+919812345678",
  "password": "StrongPassw0rd!",
  "companyName": "Acme Retail Pvt Ltd"
}
```

`201 Created`

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "kQ8h-Zx1oQ...",
    "tokenType": "Bearer",
    "expiresInSeconds": 900,
    "user": {
      "id": "2f9c...",
      "fullName": "Rahul Pathak",
      "email": "owner@acme-retail.in",
      "tenantId": "11111111-...",
      "tenantName": "Acme Retail Pvt Ltd",
      "roles": ["OWNER", "ADMIN"],
      "phoneVerified": false
    }
  }
}
```

Password must be 10-72 characters. Duplicate email returns `409 CONFLICT`.

### POST /v1/auth/login

```json
{ "email": "owner@acme-retail.in", "password": "StrongPassw0rd!" }
```

Returns the same token payload. Five consecutive failures lock the account for
fifteen minutes and return `403 FORBIDDEN`.

### POST /v1/auth/refresh

```json
{ "refreshToken": "kQ8h-Zx1oQ..." }
```

Returns a new pair and invalidates the presented token.

### POST /v1/auth/otp/send

```json
{ "phone": "+919812345678", "purpose": "PHONE_VERIFICATION" }
```

`purpose` is one of `REGISTRATION`, `LOGIN`, `PHONE_VERIFICATION`, `PASSWORD_RESET`.

```json
{
  "success": true,
  "data": { "phone": "*********5678", "expiresAt": "...", "validitySeconds": 300 }
}
```

The phone is masked in the response. `devCode` appears only when
`hubflow.otp.expose-code=true`, which is never set in production.

### POST /v1/auth/otp/verify

```json
{ "phone": "+919812345678", "code": "755010", "purpose": "PHONE_VERIFICATION" }
```

Wrong codes return `400`. Five wrong attempts require a new OTP.

### GET /v1/auth/me

Returns the profile behind the current access token.

---

## CRM

### GET /v1/crm/contacts

Query: `page`, `size` (max 100), `search`, `stage`, `ownerId`.

`search` matches name, phone or email. `stage` is one of `NEW`, `QUALIFIED`,
`DEMO`, `NEGOTIATION`, `WON`, `LOST`.

### POST /v1/crm/contacts

```json
{
  "fullName": "Meera Joshi",
  "phone": "+919812345678",
  "email": "meera@nexora.in",
  "companyName": "Nexora Retail",
  "source": "landing_page"
}
```

A duplicate phone within the tenant returns `409 CONFLICT`.

### GET / PUT /v1/crm/contacts/{id}

Fetch or replace. `DELETE` requires `ADMIN` or `OWNER`.

### GET /v1/crm/deals

Query: `page`, `size`, `stage`.

### POST /v1/crm/deals

```json
{
  "contactId": "a0000000-...",
  "title": "Annual Growth plan",
  "value": 95988,
  "stage": "QUALIFIED"
}
```

### PATCH /v1/crm/deals/{id}/stage

```json
{ "stage": "NEGOTIATION" }
```

Win probability is recalculated from the stage (NEW 10, QUALIFIED 30, DEMO 50,
NEGOTIATION 75, WON 100, LOST 0) and the linked contact moves to the same stage.
Moving to `LOST` without `lostReason` returns `400`.

### GET /v1/crm/pipeline

Deal count and total value per stage.

---

## Campaigns

### GET /v1/campaigns

Query: `page`, `size`, `status`.

### POST /v1/campaigns

```json
{ "name": "Monsoon push", "templateId": "3333...", "scheduledAt": null }
```

Requires `ADMIN`, `OWNER` or `MARKETER`. The template must be `APPROVED`;
otherwise `400` with the current status in the message.

### POST /v1/campaigns/{id}/dispatch

`202 Accepted`

```json
{
  "success": true,
  "data": {
    "campaignId": "...",
    "status": "QUEUED",
    "queuedRecipients": 1842,
    "skippedOptOuts": 37,
    "queueBatchId": "batch_792f00fe-537"
  }
}
```

Dispatching an already queued or running campaign returns `409 CONFLICT`.

### GET /v1/campaigns/{id}/stats

```json
{
  "campaignId": "...",
  "totalRecipients": 1842,
  "byState": { "QUEUED": 12, "SENT": 40, "DELIVERED": 1204, "READ": 561, "FAILED": 25 },
  "deliveryRate": 95.82,
  "readRate": 30.45
}
```

### Templates

`GET /v1/campaigns/templates` lists templates with Meta approval status and quality
rating. `POST /v1/campaigns/templates` submits a new one (starts `PENDING`).
`PATCH /v1/campaigns/templates/{id}/approval?status=APPROVED` records Meta's
decision and requires `ADMIN` or `OWNER`.

---

## Billing

### GET /v1/billing/plans

Public, unauthenticated. Served from the core service; if it is unreachable the
gateway serves its cached catalogue and sets `x-served-from: gateway-cache`.

### POST /v1/billing/subscription

```json
{ "planId": "growth", "billingCycle": "YEARLY" }
```

Activates the subscription and raises an invoice. GST is 18% on platform plus
conversation charges. Example: platform 79,990.00 + conversation 0.00, tax
14,398.20, total 94,388.20.

### GET /v1/billing/invoices

Paginated, newest first. `GET /v1/billing/invoices/{id}` fetches one.

### GET /v1/billing/usage

Conversations used against the plan allowance, plus estimated overage cost at
Rs 0.85 per conversation.

---

## HRMS

| Endpoint | Method | Roles | Purpose |
|---|---|---|---|
| `/v1/hrms/employees` | GET | ADMIN, OWNER | List, filter by `department` |
| `/v1/hrms/employees` | POST | ADMIN, OWNER | Add an employee |
| `/v1/hrms/employees/{id}` | GET | ADMIN, OWNER | Fetch one |
| `/v1/hrms/leave` | POST | any | Apply for leave |
| `/v1/hrms/leave` | GET | any | List, filter by `status` |
| `/v1/hrms/leave/{id}` | PATCH | ADMIN, OWNER | Approve or reject |

Applying for more days than the balance returns `400`. Approval deducts the days.
Deciding an already-decided request returns `409`.

---

## Reports

### GET /v1/reports/summary

Contacts by stage, campaigns by status, pipeline value, invoice counts and active
headcount for the tenant.

---

## AI service

### POST /v1/ai/chat

```json
{ "message": "Can I pay in two instalments?", "contactId": "a000..." }
```

```json
{
  "reply": "We can split this into instalments...",
  "intent": "payment_plan_request",
  "sentiment": "neutral",
  "confidence": 0.8,
  "suggested_actions": ["notify_finance", "generate_instalment_plan"],
  "escalate_to_human": true,
  "latency_ms": 0
}
```

Intents: `pricing_enquiry`, `payment_plan_request`, `support_issue`,
`demo_request`, `cancellation`, `opt_out`, `general_query`.

Classification is a deterministic scored keyword model. Confidence combines match
margin with evidence strength and ranges from 0.40 (no signal) to 0.96 (multiple
strong signals). Escalation triggers on cancellation, support issues, payment-plan
requests, or any negative sentiment.

### POST /v1/ai/classify

```json
{ "text": "The dashboard is broken" }
```

Returns intent, sentiment, confidence, matched keywords and `routing_queue`
(`sales`, `finance`, `support`, `retention`, `compliance`).

### POST /v1/ai/score

```json
{
  "contactId": "a000...",
  "replies": 4,
  "pageViews": 6,
  "daysSinceLastTouch": 1,
  "openedPricing": true,
  "companySize": 120
}
```

Returns a 0-100 score, a band (`hot` ≥75, `warm` ≥45, `cool` ≥20, `cold` below),
the per-factor contribution, and a recommended next step.

### GET /v1/ai/recommendations/{contactId}

Next-best-action list, band-aware. Accepts the same engagement signals as query
parameters.

### GET /v1/ai/analytics/dashboard

Query: `window_days` (1-90, default 14). Returns daily sent/delivered/read/reply
series, rates, and intent mix. `totals.source_is_live` is `1` when the series came
from PostgreSQL and `0` when it is a modelled fallback.

### POST /v1/ai/ocr

```json
{ "fileId": "1754...-invoice.txt", "documentType": "invoice" }
```

Extracts invoice number, GSTIN, PAN, date, phone and total amount with a confidence
score derived from how many fields matched.

---

## File upload

### POST /v1/uploads/contacts/csv

`multipart/form-data`, field name `file`. CSV only, 10 MB max, must contain `phone`
and `name` columns.

`201 Created`

```json
{
  "jobId": "0f1c9a2e-...",
  "fileId": "1754...-contacts.csv",
  "totalRows": 25,
  "headers": ["id", "name", "phone", "..."],
  "preview": [{ "id": "CNT-1001", "name": "Meera Joshi" }],
  "nextStep": "Queued for the C++ ingestion engine via the core service"
}
```

Progress is pushed on the `imports` WebSocket channel.

---

## WebSocket

Connect to `ws://localhost:8080/ws?token=<accessToken>`. An invalid token is
rejected at the HTTP upgrade with `401`.

Client messages:

```json
{ "type": "subscribe", "channel": "campaigns" }
{ "type": "unsubscribe", "channel": "campaigns" }
{ "type": "ping" }
```

Server events: `connection.ready`, `subscribed`, `unsubscribed`, `pong`,
`campaign.created`, `campaign.queued`, `message.status`, `import.queued`,
`notification.received`, `error`.

Channels: `notifications` (subscribed by default), `campaigns`, `imports`.

Every frame is `{ "type": "...", "payload": { }, "ts": "ISO-8601" }`. The server
pings every 30 seconds and terminates sockets that miss a pong.

---

## Webhooks

### GET /api/v1/webhooks/whatsapp

Meta subscription handshake. Echoes `hub.challenge` when `hub.verify_token`
matches; otherwise `403`.

### POST /api/v1/webhooks/whatsapp

Consumes delivery and read receipts. Each status is matched on
`provider_message_id` and the campaign counters are recomputed from the recipients
table. Returns `{ "processed": <count> }`.

---

## Internal endpoints

Guarded by the `x-internal-token` header, never exposed through the ingress.

| Endpoint | Purpose |
|---|---|
| `POST /v1/notifications/dispatch` | Push an event to a tenant's WebSocket clients |
| `POST /api/v1/jobs/{name}/run` | Trigger a background job on the AI service |
