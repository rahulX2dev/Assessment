# HubUnicon Technical Assessment — Hubflow Automation

A full-stack submission covering all three phases: four responsive React interfaces,
a five-runtime backend for the Hubflow Automation SaaS, a three-store data layer,
and the deployment architecture that runs it.

Submitted by **Rahul Pathak**.

---

## What is in here

| Path | Contents |
|---|---|
| `frontend/` | React 18 + Vite. Four projects on one shared design system |
| `backend/api-gateway/` | Node.js edge gateway: auth, rate limiting, WebSocket, uploads |
| `backend/core-service/` | Spring Boot: auth, OTP, CRM, campaigns, billing, HRMS, reports |
| `backend/ai-service/` | FastAPI: assistant, scoring, analytics, OCR, scheduled jobs |
| `backend/engine-cpp/` | C++17 bulk campaign engine with a worker pool |
| `backend/fileops-c/` | C11 CSV, record and report utility |
| `database/` | MySQL DDL and seed, PostgreSQL analytics schema, Redis keyspace |
| `deployment/` | Dockerfiles, Compose stack, Nginx configs, Kubernetes manifests |
| `.github/workflows/` | CI and CD pipelines |
| `docs/` | Architecture, ER diagram, schema, API reference, deployment guide |
| `postman/` | 44-request collection with assertions and token chaining |
| `samples/` | Sample contact and delivery CSVs used by the engines and CI |

### Documentation index

| Document | Covers |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, request topology, degradation, security, trade-offs |
| [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md) | Mermaid ER diagrams and relationship rules |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Indexing strategy with the query behind each index |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Every endpoint, error code, rate limit and WebSocket event |
| [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Local setup, env vars, Kubernetes, AWS, CI/CD, troubleshooting |
| [docs/COMPANY_UNDERSTANDING.md](docs/COMPANY_UNDERSTANDING.md) | Phase 3 answers |

---

## Phase 1 — Frontend

Four responsive interfaces built from one token set and one UI kit.

| Route | Project | Notable work |
|---|---|---|
| `/` | Launcher | Index of all four builds |
| `/hubflow` | Hubflow Automation landing page | Pricing fetched over REST with a cached fallback, interactive automation builder, animated counters |
| `/ecommerce` | E-Commerce home page | Live FakeStore API catalogue, cart reducer with drawer, search, sort, skeletons, offline fallback |
| `/pw` | Physics Wallah clone | Exam grid, filterable batch catalogue, faculty carousel, results, app section |
| `/stripe` | Stripe clone | Angled gradient hero, tabbed multi-language code samples, dark developer section |

**Shared foundation.** `src/components/ui` holds Button, Badge, Card, Section,
Accordion, Rating, Marquee, Switch, Avatar, Input, Skeleton, Reveal and a
dependency-free SVG icon set. `src/hooks` holds `useReveal`, `useAsync`,
`useMediaQuery`, `useScrollPosition`, `useLockBodyScroll` and `useCountUp`. Every
project composes these rather than restyling from scratch.

**Performance.** Each project is a lazy route, so visiting one never downloads the
other three. Production build:

```
index.css              46.61 kB │ gzip:  8.76 kB
StripePage.js          22.53 kB │ gzip:  6.40 kB
PwPage.js              27.94 kB │ gzip:  7.59 kB
EcommercePage.js       32.30 kB │ gzip:  8.93 kB
HubflowPage.js         39.23 kB │ gzip: 11.44 kB
router.js             161.82 kB │ gzip: 52.84 kB
```

Icons are inline SVG rather than an icon library, images are lazy-loaded with
explicit dimensions, and React and the router are split into their own vendor
chunks.

**Responsive and accessible.** Mobile-first from 320px. Semantic landmarks,
labelled controls, `aria-expanded` on every disclosure, visible focus rings,
`aria-pressed` on toggles, and a full `prefers-reduced-motion` path that disables
animation and scroll smoothing.

**API integration.** `src/lib/apiClient.js` is a shared fetch wrapper with timeout,
abort propagation and a normalised `ApiError`. `useAsync` pairs it with loading,
error and degraded states so every network surface has a defined offline behaviour.

**Configuration.** No base URL is hardcoded. Both API hosts and both timeouts come
from `frontend/.env`, and `vite.config.js` reads the dev port and proxy target
through `loadEnv`. Only `VITE_`-prefixed values reach the browser; they are inlined
at build time and therefore public, which is why this one `.env` is committed while
every backend `.env` is git-ignored. The frontend image takes the same values as
build arguments.

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build

VITE_GATEWAY_URL=https://staging.hubflow.io/api npm run build   # env wins over .env
```

---

## Phase 2 — Backend

### Node.js API Gateway (`:8080`)

Not a pass-through. It owns JWT verification, tenant-aware sliding-window rate
limiting (Redis-backed with an in-memory fallback), a circuit breaker with
exponential-backoff retry on idempotent verbs, CSV upload validation, and an
authenticated WebSocket hub with channel subscriptions and heartbeats.

### Java Spring Boot core service (`:8081`)

Registration, login, refresh-token rotation, WhatsApp OTP, CRM contacts and deals,
campaign dispatch, WhatsApp Cloud API integration with delivery webhooks, billing
with GST invoicing, HRMS leave workflow, cross-module reports, Swagger/OpenAPI, and
a `@RestControllerAdvice` that maps every failure onto one error envelope.

30 documented API paths. `dev` runs on in-memory H2 so no database is needed;
`prod` runs on MySQL with Flyway.

### Python FastAPI AI service (`:8000`)

Intent and sentiment classification, lead scoring with per-factor breakdown,
next-best-action recommendations, dashboard analytics over PostgreSQL, OCR field
extraction, and APScheduler background jobs. Structured JSON logging throughout.

The classifier is a deterministic scored keyword model, not an LLM call. It runs
offline, costs nothing per request, and leaves a clean seam to swap in a hosted
model. Confidence spreads from 0.40 with no signal to 0.96 with several.

### C++ campaign engine

`CsvReader` with quoted-field and embedded-newline handling, a `Contact` domain
model, pluggable `ScoringStrategy` implementations, a thread-safe priority
`BulkMessageQueue`, a worker-pool `CampaignEngine` with retry, an `AnalyticsEngine`
computing rates and p95 latency, and a `ReportWriter` hierarchy emitting CSV, JSON
or text. Strategy, template-method and RAII throughout; smart pointers, no raw
`new`.

### C file management system

Streaming CSV parser, dynamic record store with growth and compaction, atomic
writes via temp-and-rename, generation-rotating backups, FNV-1a checksums, and a
five-command CLI. Every allocation goes through a tracking wrapper, so each run
prints an allocation summary and CI fails the build on any definite leak under
Valgrind.

---

## Database layer

| Store | Role |
|---|---|
| MySQL 8 | 15-table transactional core with foreign keys and check constraints |
| PostgreSQL 16 | Monthly-partitioned event history, JSONB payloads, materialised rollup |
| Redis 7 | Rate limits, dispatch queues, caches, WebSocket presence |

Indexes are justified one by one against the query that needs them in
[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md). Highlights: every composite
index leads with `tenant_id` so a tenant's rows stay contiguous;
`uk_recipient_provider_message` turns the delivery-webhook lookup into a single row
read; partial indexes cover the small hot slices; `conversation_events` is
range-partitioned so retiring a month is a `DROP PARTITION`.

---

## Deployment

Five Dockerfiles, all multi-stage and running as non-root with healthchecks. A
Compose stack brings up the whole system including databases, which auto-load their
schemas on first boot. Kubernetes manifests cover Deployments, Services, HPAs, PDBs,
Ingress with TLS, a NetworkPolicy restricting backend access to the edge tier, and
CronJobs for the native engines. Nginx handles TLS, per-zone rate limits and
WebSocket upgrades.

CI builds and tests all five runtimes on every push, including running the C and C++
binaries against the sample CSVs under Valgrind. CD publishes images to GHCR, scans
them with Trivy, rolls out to EKS and rolls back on a failed health check.

```bash
cd deployment
cp .env.example .env
docker compose up -d --build
```

---

## Verification performed

Everything below was executed on this machine, not assumed. Last verified 2026-08-07.

| Check | Result |
|---|---|
| Frontend production build | Passes, 110 modules, code split per route |
| Gateway boot and health | `up`, request ids present on every response |
| Plan catalogue fallback | Serves cached catalogue with `x-served-from: gateway-cache` when core is down |
| JWT auth | Valid token accepted; tampered rejected 401; expired returns `TOKEN_EXPIRED` |
| Role enforcement | `VIEWER` blocked from an admin route with 403 |
| Rate limiting | Login bucket tripped on request 11 of 10, `Retry-After: 60` |
| Circuit breaker | 3 retries with backoff, then 502 `UPSTREAM_ERROR` |
| WebSocket | Auth accepted, channel subscribed, broadcast received; unsigned token rejected |
| Core service compile | Clean |
| Core service end-to-end | 31 assertions covering registration, OTP, CRM, campaigns, billing, HRMS, reports, token rotation |
| GST calculation | 79,990.00 × 18% = 14,398.20, total 94,388.20 |
| Business rules | Unapproved template, double dispatch, double leave decision, LOST without reason, refresh replay all correctly rejected |
| AI service | 22 checks: classification, escalation, scoring bands, recommendations, analytics fallback, OCR, jobs, internal-token guard |
| C++ engine compile | Clean at `/W4` |
| C utility compile | Clean at `/W4` |
| Postman collection | Valid JSON, 44 requests, 8 folders |
| All YAML | 9 files parse; 28 Kubernetes documents across 12 resource kinds |
| **Three-service integration** | Gateway → core → AI wired together and driven end to end |
| Readiness reporting | Both upstreams `reachable: true`, circuits closed |
| Proxied surface | Auth, CRM, campaigns, templates, billing, HRMS, reports, AI, webhooks all verified through the gateway |
| Webhook handshake | Challenge echoed through the gateway; wrong verify token rejected 403; receipt processed |

Driving the full chain surfaced four real defects, all fixed and re-verified:

1. **`/v1/reports` and `/v1/hrms` were never proxied.** The docs advertised them but
   the gateway had no route, so they 404'd. Routes added.
2. **The WhatsApp webhook had no gateway route.** Since the ingress sends `/api` to
   the gateway, Meta's callback would have 404'd in production. Route added.
3. **`GET /v1/campaigns/templates` was shadowed by `GET /v1/campaigns/:id`.** Express
   matched the literal path as an id. Template routes moved above the parameterised
   ones.
4. **The service client crashed on non-JSON upstream bodies.** Spring returns the
   webhook challenge as plain text under a JSON content-type; the client called
   `.json()` unconditionally and turned a 200 into a 502. Parsing is now tolerant.

**One limitation.** This machine enforces Windows Device Guard / Smart App Control,
which blocks execution of any freshly compiled unsigned native binary. Both native
projects compile warning-free, but I could not run them locally. They are exercised
in CI on Ubuntu, where the workflow runs both binaries against the sample CSVs and
checks the C utility under Valgrind. I did not disable the security policy to work
around this.

---

## Running the whole stack

```bash
# 1. Databases and everything else
cd deployment && cp .env.example .env && docker compose up -d --build

# 2. Or run services individually
cd frontend            && npm install && npm run dev
cd backend/api-gateway && npm install && npm run dev
cd backend/core-service && mvn spring-boot:run -Dspring-boot.run.profiles=dev
cd backend/ai-service  && pip install -r requirements.txt && uvicorn app.main:app --reload
cd backend/engine-cpp  && make all
cd backend/fileops-c   && make all
```

Full instructions, environment variables and troubleshooting in
[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md).

---

## Notes on the work

Data in the interfaces is representative rather than scraped. The PW and Stripe
pages are interface recreations built as a UI exercise and are not affiliated with
either company; both footers say so.

The commit history is split by phase so the build order is legible. Every
architectural decision I would defend in review — including the ones I would argue
against at a smaller company, such as running five runtimes — is written down with
its reasoning in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).


##date: 07-08-2026