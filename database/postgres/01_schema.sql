CREATE SCHEMA IF NOT EXISTS analytics;

SET search_path TO analytics, public;

CREATE TABLE IF NOT EXISTS conversation_events (
    id             BIGSERIAL,
    tenant_id      UUID          NOT NULL,
    contact_id     UUID          NOT NULL,
    campaign_id    UUID          NULL,
    message_id     VARCHAR(80)   NULL,
    direction      TEXT          NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    event_type     TEXT          NOT NULL CHECK (event_type IN ('sent','delivered','read','replied','failed','opt_out')),
    channel        TEXT          NOT NULL DEFAULT 'whatsapp',
    payload        JSONB         NULL,
    occurred_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

CREATE TABLE IF NOT EXISTS campaign_daily_metrics (
    tenant_id   UUID        NOT NULL,
    campaign_id UUID        NULL,
    event_day   DATE        NOT NULL,
    sent        INTEGER     NOT NULL DEFAULT 0,
    delivered   INTEGER     NOT NULL DEFAULT 0,
    read_count  INTEGER     NOT NULL DEFAULT 0,
    replies     INTEGER     NOT NULL DEFAULT 0,
    failed      INTEGER     NOT NULL DEFAULT 0,
    cost_inr    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    refreshed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (tenant_id, event_day, campaign_id)
);

CREATE TABLE IF NOT EXISTS ai_interactions (
    id             BIGSERIAL     PRIMARY KEY,
    tenant_id      UUID          NOT NULL,
    contact_id     UUID          NULL,
    user_id        UUID          NULL,
    intent         TEXT          NOT NULL,
    sentiment      TEXT          NOT NULL CHECK (sentiment IN ('positive','neutral','negative')),
    confidence     NUMERIC(4, 3) NOT NULL,
    routing_queue  TEXT          NOT NULL,
    escalated      BOOLEAN       NOT NULL DEFAULT FALSE,
    latency_ms     INTEGER       NOT NULL DEFAULT 0,
    message_excerpt TEXT         NULL,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_score_history (
    id           BIGSERIAL   PRIMARY KEY,
    tenant_id    UUID        NOT NULL,
    contact_id   UUID        NOT NULL,
    score        SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 100),
    band         TEXT        NOT NULL CHECK (band IN ('hot','warm','cool','cold')),
    factors      JSONB       NOT NULL,
    strategy     TEXT        NOT NULL DEFAULT 'weighted',
    computed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ocr_documents (
    id            BIGSERIAL   PRIMARY KEY,
    tenant_id     UUID        NOT NULL,
    file_id       TEXT        NOT NULL,
    document_type TEXT        NOT NULL DEFAULT 'invoice',
    confidence    NUMERIC(4, 3) NOT NULL,
    fields        JSONB       NOT NULL,
    processed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_runs (
    id           BIGSERIAL   PRIMARY KEY,
    job_name     TEXT        NOT NULL,
    state        TEXT        NOT NULL CHECK (state IN ('scheduled','running','succeeded','failed')),
    detail       TEXT        NULL,
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at  TIMESTAMPTZ NULL,
    duration_ms  INTEGER     NULL
);

CREATE TABLE IF NOT EXISTS conversation_events_2026_08 PARTITION OF conversation_events
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

CREATE TABLE IF NOT EXISTS conversation_events_2026_09 PARTITION OF conversation_events
    FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

CREATE TABLE IF NOT EXISTS conversation_events_default PARTITION OF conversation_events DEFAULT;

CREATE INDEX IF NOT EXISTS idx_events_tenant_time
    ON conversation_events (tenant_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_campaign
    ON conversation_events (campaign_id, event_type)
    WHERE campaign_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_contact
    ON conversation_events (contact_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_payload
    ON conversation_events USING GIN (payload jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_daily_metrics_lookup
    ON campaign_daily_metrics (tenant_id, event_day DESC);

CREATE INDEX IF NOT EXISTS idx_ai_tenant_time
    ON ai_interactions (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_intent
    ON ai_interactions (tenant_id, intent, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_escalated
    ON ai_interactions (tenant_id, created_at DESC)
    WHERE escalated;

CREATE INDEX IF NOT EXISTS idx_lead_history_contact
    ON lead_score_history (contact_id, computed_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_history_band
    ON lead_score_history (tenant_id, band, computed_at DESC);

CREATE INDEX IF NOT EXISTS idx_ocr_tenant
    ON ocr_documents (tenant_id, processed_at DESC);

CREATE INDEX IF NOT EXISTS idx_ocr_fields
    ON ocr_documents USING GIN (fields jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_job_runs_name_time
    ON job_runs (job_name, started_at DESC);

CREATE MATERIALIZED VIEW IF NOT EXISTS tenant_engagement_rollup AS
SELECT
    tenant_id,
    date_trunc('week', event_day)::date AS week_start,
    SUM(sent)       AS sent,
    SUM(delivered)  AS delivered,
    SUM(read_count) AS read_count,
    SUM(replies)    AS replies,
    SUM(failed)     AS failed,
    CASE WHEN SUM(sent) = 0 THEN 0
         ELSE ROUND(SUM(delivered)::numeric * 100 / SUM(sent), 2) END AS delivery_rate,
    CASE WHEN SUM(sent) = 0 THEN 0
         ELSE ROUND(SUM(replies)::numeric * 100 / SUM(sent), 2) END AS reply_rate
FROM campaign_daily_metrics
GROUP BY tenant_id, date_trunc('week', event_day);

CREATE UNIQUE INDEX IF NOT EXISTS idx_engagement_rollup_key
    ON tenant_engagement_rollup (tenant_id, week_start);

CREATE OR REPLACE FUNCTION refresh_engagement_rollup() RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY tenant_engagement_rollup;
END;
$$ LANGUAGE plpgsql;
