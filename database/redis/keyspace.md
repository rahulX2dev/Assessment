# Redis Keyspace Design

Redis is the shared cache and coordination layer. It holds nothing that cannot be
rebuilt from MySQL or PostgreSQL, so a full flush degrades latency but never loses
business data.

## Databases

| DB | Owner | Purpose |
|----|-------|---------|
| 0 | API Gateway | Rate limiting, idempotency keys, WebSocket presence |
| 1 | AI Service | Classification cache, analytics response cache |
| 2 | Core Service | Session/token blocklist, plan catalogue cache, OTP throttle |
| 3 | C++ Engine | Bulk dispatch queues and per-number throughput counters |

## Key naming

All keys follow `<domain>:<entity>:<identifier>[:<qualifier>]`. Tenant-scoped keys
always carry the tenant id so a noisy tenant can be evicted in isolation.

### Rate limiting (DB 0)

| Key | Type | TTL | Notes |
|-----|------|-----|-------|
| `ratelimit:global:ip:<ip>` | String counter | 60s | Anonymous traffic |
| `ratelimit:auth:ip:<ip>` | String counter | 60s | Login and registration, max 10 |
| `ratelimit:otp:phone:<phone>` | String counter | 900s | Max 5 OTP sends per 15 min |
| `ratelimit:<scope>:tenant:<tenantId>:<userId>` | String counter | 60s | Authenticated traffic |
| `ratelimit:campaign-dispatch:tenant:<tenantId>` | String counter | 60s | Max 10 dispatches per minute |

Implemented as `INCR` plus `EXPIRE` on first write. The gateway reads the returned
counter and TTL in a single `MULTI` so the limit and reset header stay consistent.

### Idempotency and locks (DB 0)

| Key | Type | TTL | Notes |
|-----|------|-----|-------|
| `idem:<tenantId>:<idempotencyKey>` | String (JSON) | 24h | Cached response for replayed POSTs |
| `lock:campaign:<campaignId>` | String | 300s | `SET NX PX` guard so one dispatcher owns a campaign |
| `lock:job:<jobName>` | String | 600s | Prevents duplicate scheduled runs across replicas |

### WebSocket presence (DB 0)

| Key | Type | TTL | Notes |
|-----|------|-----|-------|
| `ws:tenant:<tenantId>:connections` | Set of socket ids | none | Trimmed on disconnect |
| `ws:socket:<socketId>` | Hash | 12h | userId, tenantId, subscribed channels |
| `ws:channel:<tenantId>:<channel>` | Set | none | Fan-out target for broadcasts |

### AI cache (DB 1)

| Key | Type | TTL | Notes |
|-----|------|-----|-------|
| `ai:classify:<sha1(text)>` | String (JSON) | 6h | Deterministic classifier output |
| `ai:dashboard:<tenantId>:<windowDays>` | String (JSON) | 300s | Analytics response cache |
| `ai:score:<contactId>` | String (JSON) | 1h | Last computed lead score |
| `ai:recommendations:<contactId>` | String (JSON) | 1h | Next-best-action list |

### Core service (DB 2)

| Key | Type | TTL | Notes |
|-----|------|-----|-------|
| `auth:blocklist:<jti>` | String | until token expiry | Revoked access tokens |
| `auth:lockout:<userId>` | String counter | 900s | Failed sign-in attempts |
| `catalogue:plans` | String (JSON) | 600s | Public plan list served to the marketing site |
| `tenant:<tenantId>:settings` | Hash | 900s | WhatsApp number, quality rating, feature flags |

### Dispatch queues (DB 3)

| Key | Type | TTL | Notes |
|-----|------|-----|-------|
| `queue:campaign:<tenantId>:urgent` | List | none | OTP and transactional traffic |
| `queue:campaign:<tenantId>:bulk` | List | none | Marketing broadcasts |
| `queue:retry:<tenantId>` | Sorted set (score = retry timestamp) | none | Exponential backoff |
| `throughput:<phoneNumberId>:<minute>` | String counter | 120s | Enforces the Meta per-number rate cap |
| `dlq:campaign:<campaignId>` | List | 7d | Messages that exhausted all retries |

Urgent and bulk are separate lists so a large broadcast can never starve OTP
delivery. Workers poll urgent first and only fall through to bulk when it is empty.

## Eviction and durability

- `maxmemory-policy allkeys-lru` on the cache databases (0 and 1).
- `noeviction` on DB 3 so queued messages are never silently dropped; the producer
  backs off when memory pressure is reported instead.
- AOF with `appendfsync everysec` for DB 3, RDB snapshots elsewhere.
- All cache reads tolerate a miss and fall back to the source database. The AI
  service and gateway both keep working with Redis entirely unavailable.

## Operational notes

- Keys are always written with an explicit TTL unless they are queue structures.
- `SCAN` is used for maintenance sweeps; `KEYS` is never issued in application code.
- Cluster mode uses hash tags such as `ratelimit:{<tenantId>}:...` so all keys for
  one tenant land on the same slot and can participate in a single transaction.
