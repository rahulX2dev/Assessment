# Database Design and Indexing Strategy

## Why three stores

| Store | Workload | Why it was chosen |
|---|---|---|
| MySQL 8 (InnoDB) | Transactional writes on tenants, users, CRM, campaigns, billing, HRMS | Row-level locking, foreign keys and mature replication. Billing needs real transactions and referential integrity |
| PostgreSQL 16 | Append-only event history, aggregates, JSONB payloads | Partitioning, GIN indexes on JSONB, materialised views and window functions the reporting queries lean on |
| Redis 7 | Rate limits, dispatch queues, caches, WebSocket presence | Sub-millisecond counters and list operations that would otherwise hammer MySQL |

Splitting them keeps a 40-million-row event table from competing with invoice
writes for the same buffer pool.

## Files

| Path | Contents |
|---|---|
| `database/mysql/01_schema.sql` | Full DDL: 15 tables, foreign keys, check constraints |
| `database/mysql/02_seed.sql` | Plans, one demo tenant, contacts, deals, employees |
| `database/postgres/01_schema.sql` | Analytics tables, partitions, indexes, materialised view |
| `database/postgres/02_seed.sql` | Fourteen days of metrics plus AI and lead-score history |
| `database/redis/keyspace.md` | Key naming, TTLs, eviction policy per database |

## Indexing strategy

Indexes were chosen from the queries the services actually issue, not added
speculatively. Each one below names the access path that justifies it.

### Contacts

| Index | Columns | Serves |
|---|---|---|
| `uk_contacts_tenant_phone` | `(tenant_id, phone)` | Upsert-by-phone during CSV import; enforces per-tenant uniqueness |
| `idx_contacts_tenant_stage` | `(tenant_id, lifecycle_stage)` | Pipeline counts on the dashboard |
| `idx_contacts_tenant_created` | `(tenant_id, created_at DESC)` | Default contact list, newest first |
| `idx_contacts_dispatch` | `(tenant_id, opted_out, lead_score DESC)` | Campaign audience build: filter opt-outs, order by score |
| `idx_contacts_owner` | `(owner_id)` | "My contacts" view for a sales rep |

The leading `tenant_id` on every composite index is deliberate. It keeps each
tenant's rows contiguous and lets MySQL discard other tenants before any further
filtering.

### Campaign recipients

This is the largest MySQL table — one row per contact per campaign.

| Index | Columns | Serves |
|---|---|---|
| `uk_recipient_campaign_contact` | `(campaign_id, contact_id)` | Idempotent enqueue; a retry cannot double-send |
| `uk_recipient_provider_message` | `(provider_message_id)` | Webhook lookup when Meta posts a delivery receipt |
| `idx_recipients_campaign_state` | `(campaign_id, delivery_state)` | Per-state counters that drive the stats endpoint |

The webhook path is the hot one: a receipt arrives with only the provider message
id, so that unique index turns an otherwise full scan into a single row read.

### Campaigns, invoices, subscriptions

| Index | Columns | Serves |
|---|---|---|
| `idx_campaigns_scheduled` | `(status, scheduled_at)` | Scheduler sweep for campaigns due to run |
| `idx_invoices_collections` | `(status, due_date)` | Overdue-invoice job |
| `idx_subscriptions_renewal` | `(status, current_period_end)` | Renewal reminders 14 days out |

Each of these is a status-plus-time pair because the jobs all ask the same shape of
question: "which rows in this state crossed this timestamp?"

### PostgreSQL

| Index | Type | Serves |
|---|---|---|
| `idx_events_tenant_time` | B-tree `(tenant_id, occurred_at DESC)` | Time-window scans per tenant |
| `idx_events_payload` | GIN `jsonb_path_ops` | Ad-hoc filters inside the raw webhook payload |
| `idx_events_campaign` | Partial, `WHERE campaign_id IS NOT NULL` | Skips inbound conversation rows entirely |
| `idx_ai_escalated` | Partial, `WHERE escalated` | Escalation queue is a small slice of all interactions |
| `idx_engagement_rollup_key` | Unique `(tenant_id, week_start)` | Required for `REFRESH MATERIALIZED VIEW CONCURRENTLY` |

`conversation_events` is range-partitioned by month. Dropping a partition retires a
month of history in constant time instead of a multi-hour `DELETE`, and the planner
prunes partitions outside the requested window before touching an index.

Partial indexes matter here: roughly 6% of AI interactions escalate, so
`idx_ai_escalated` is about a fifteenth the size of a full index on the same column.

## Deliberate denormalisation

`campaigns` carries `sent_count`, `delivered_count`, `read_count` and
`failed_count`. These are derivable from `campaign_recipients` but are maintained
as counters because the campaign list renders them for every row, and recomputing
five aggregates per campaign on each page load does not hold up at scale. They are
recalculated from the source table whenever a delivery receipt lands, so a lost
webhook self-corrects on the next one rather than drifting permanently.

## Constraints that encode business rules

- `chk_deals_probability` — win probability stays within 0-100.
- `chk_leave_range` — a leave request cannot end before it starts.
- `chk_invoices_total` — no negative invoice totals.
- `uk_templates_tenant_name` on `(tenant_id, name, language)` — one template per
  name per language, matching how Meta itself scopes template approval.

Putting these in the schema means a bug in any of the four services cannot write
data that violates them.

## Migrations

Flyway runs on core-service startup in the `prod` profile from
`classpath:db/migration`. The `dev` profile uses H2 with `create-drop` plus a seed
script, so a developer needs no database installed to run the test suite. Schema
changes ship as new `V<n>__description.sql` files; existing migrations are never
edited once merged.

## Backup and retention

| Store | Backup | Retention |
|---|---|---|
| MySQL | Nightly `mysqldump --single-transaction` plus binlog shipping | 30 days full, 7 days point-in-time |
| PostgreSQL | `pg_basebackup` weekly, WAL archived continuously | 90 days; partitions older than 13 months dropped |
| Redis | AOF `everysec` on the queue database only | Not backed up; rebuilt from source of truth |

## Capacity notes

At 3,200 tenants averaging 12,000 contacts, `contacts` sits near 38 million rows —
comfortable for InnoDB with the indexes above. `campaign_recipients` grows fastest;
rows older than 90 days are archived to PostgreSQL and pruned from MySQL by a
scheduled job, which keeps the hot table inside the buffer pool.
