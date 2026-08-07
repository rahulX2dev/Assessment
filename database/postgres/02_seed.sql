SET search_path TO analytics, public;

INSERT INTO campaign_daily_metrics (tenant_id, campaign_id, event_day, sent, delivered, read_count, replies, failed, cost_inr)
SELECT
    '11111111-1111-1111-1111-111111111111'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    day::date,
    base,
    (base * 0.94)::int,
    (base * 0.74)::int,
    (base * 0.09)::int,
    (base * 0.06)::int,
    ROUND((base * 0.85)::numeric, 2)
FROM (
    SELECT
        generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') AS day,
        (3800 + (random() * 2400))::int AS base
) AS series
ON CONFLICT (tenant_id, event_day, campaign_id) DO NOTHING;

INSERT INTO ai_interactions (tenant_id, contact_id, intent, sentiment, confidence, routing_queue, escalated, latency_ms, message_excerpt)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001',
   'pricing_enquiry', 'neutral', 0.960, 'sales', FALSE, 42, 'How much does the Growth plan cost?'),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002',
   'payment_plan_request', 'neutral', 0.800, 'finance', TRUE, 38, 'Can I pay in two instalments?'),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000003',
   'support_issue', 'negative', 0.960, 'support', TRUE, 51, 'The dashboard is broken and throws an error'),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000004',
   'opt_out', 'neutral', 0.800, 'compliance', FALSE, 29, 'Please unsubscribe me');

INSERT INTO lead_score_history (tenant_id, contact_id, score, band, factors, strategy)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001', 88, 'hot',
   '{"replies": 32, "page_views": 18, "opened_pricing": 20, "recency": 18}'::jsonb, 'weighted'),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 71, 'warm',
   '{"replies": 16, "page_views": 9, "opened_pricing": 20, "recency": 18}'::jsonb, 'weighted'),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000004', 12, 'cold',
   '{"replies": 0, "page_views": 3, "opened_pricing": 0, "recency": 0}'::jsonb, 'weighted');

INSERT INTO job_runs (job_name, state, detail, finished_at, duration_ms)
VALUES
  ('rebuild_daily_metrics', 'succeeded', 'Rolled up campaign events into daily metrics', now(), 1840),
  ('refresh_lead_scores', 'succeeded', 'Recomputed scores for active contacts', now(), 620);

REFRESH MATERIALIZED VIEW tenant_engagement_rollup;
