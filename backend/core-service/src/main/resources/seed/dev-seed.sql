INSERT INTO plans (id, name, description, monthly_price, yearly_price, currency, conversation_allowance, seat_limit, featured, feature_list, sort_order)
VALUES
  ('starter', 'Starter', 'For small teams validating WhatsApp as a channel.', 2499.00, 24990.00, 'INR', 5000, 2, FALSE,
   '2 team seats|5,000 conversations / month|Shared inbox and contact CRM|Template library and approvals|Email support', 1),
  ('growth', 'Growth', 'For growing revenue teams running always-on campaigns.', 7999.00, 79990.00, 'INR', 50000, 10, TRUE,
   '10 team seats|50,000 conversations / month|Automation studio and lead scoring|AI reply drafting and intent routing|Campaign analytics and attribution|Priority support with 4h SLA', 2),
  ('enterprise', 'Enterprise', 'For multi-brand organisations with compliance needs.', 0.00, 0.00, 'INR', NULL, NULL, FALSE,
   'Unlimited seats and sub-accounts|Dedicated throughput and IP pool|SSO, audit logs and data residency|HRMS and billing modules|Named success manager', 3);
