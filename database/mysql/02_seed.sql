USE hubflow;

INSERT INTO plans (id, name, description, monthly_price, yearly_price, currency,
                   conversation_allowance, seat_limit, featured, feature_list, sort_order)
VALUES
  ('starter', 'Starter', 'For small teams validating WhatsApp as a channel.',
   2499.00, 24990.00, 'INR', 5000, 2, 0,
   '2 team seats|5,000 conversations / month|Shared inbox and contact CRM|Template library and approvals|Email support', 1),
  ('growth', 'Growth', 'For growing revenue teams running always-on campaigns.',
   7999.00, 79990.00, 'INR', 50000, 10, 1,
   '10 team seats|50,000 conversations / month|Automation studio and lead scoring|AI reply drafting and intent routing|Campaign analytics and attribution|Priority support with 4h SLA', 2),
  ('enterprise', 'Enterprise', 'For multi-brand organisations with compliance needs.',
   0.00, 0.00, 'INR', NULL, NULL, 0,
   'Unlimited seats and sub-accounts|Dedicated throughput and IP pool|SSO, audit logs and data residency|HRMS and billing modules|Named success manager', 3)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  monthly_price = VALUES(monthly_price),
  yearly_price = VALUES(yearly_price);

INSERT INTO tenants (id, name, slug, gstin, whatsapp_number, status)
VALUES ('11111111-1111-1111-1111-111111111111', 'Acme Retail Pvt Ltd', 'acme-retail',
        '27AABCH1234M1ZP', '+919812340000', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, tenant_id, full_name, email, phone, password_hash,
                   email_verified, phone_verified, enabled)
VALUES ('22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111',
        'Rahul Pathak', 'owner@acme-retail.in', '+919812340001',
        '$2a$12$Xk1oQ8hZ9Q7oQ0fJx4rZ6uJ1YbWfQ4kQ2K6hV0oQ3nQ8mR5tW7uOa',
        1, 1, 1)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO user_roles (user_id, role)
VALUES ('22222222-2222-2222-2222-222222222222', 'OWNER'),
       ('22222222-2222-2222-2222-222222222222', 'ADMIN')
ON DUPLICATE KEY UPDATE role = VALUES(role);

INSERT INTO message_templates (id, tenant_id, name, language, category, body_text,
                               approval_status, quality_rating)
VALUES ('33333333-3333-3333-3333-333333333333',
        '11111111-1111-1111-1111-111111111111',
        'monsoon_offer', 'en', 'MARKETING',
        'Hi {{1}}, our monsoon sale is live with up to 45% off. Reply YES for the catalogue.',
        'APPROVED', 'GREEN'),
       ('44444444-4444-4444-4444-444444444444',
        '11111111-1111-1111-1111-111111111111',
        'hubflow_otp', 'en', 'AUTHENTICATION',
        'Your Hubflow verification code is {{1}}. It expires in 5 minutes.',
        'APPROVED', 'GREEN')
ON DUPLICATE KEY UPDATE body_text = VALUES(body_text);

INSERT INTO subscriptions (id, tenant_id, plan_id, billing_cycle, status,
                           current_period_start, current_period_end, conversations_used)
VALUES ('55555555-5555-5555-5555-555555555555',
        '11111111-1111-1111-1111-111111111111',
        'growth', 'YEARLY', 'ACTIVE',
        NOW(6), DATE_ADD(NOW(6), INTERVAL 365 DAY), 4956)
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO contacts (id, tenant_id, full_name, phone, email, company_name,
                      lifecycle_stage, lead_score, source, opted_out)
VALUES
  ('a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Meera Joshi', '+919812345678', 'meera@nexora.in', 'Nexora Retail', 'QUALIFIED', 88, 'landing_page', 0),
  ('a0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Arjun Bhatt', '+919876501234', 'arjun@bluepeak.co.in', 'Bluepeak Realty', 'DEMO', 71, 'referral', 0),
  ('a0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Sneha Kulkarni', '+919900112233', 'sneha@carepoint.health', 'CarePoint Health', 'NEGOTIATION', 92, 'webinar', 0),
  ('a0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'Vikram Sethi', '+919833445566', 'vikram@northbay.in', 'Northbay', 'LOST', 12, 'cold_list', 1)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO deals (id, tenant_id, contact_id, title, deal_value, stage, expected_close_date, win_probability)
VALUES
  ('b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'a0000000-0000-0000-0000-000000000003', 'CarePoint annual Growth plan', 95988.00,
   'NEGOTIATION', DATE_ADD(CURDATE(), INTERVAL 21 DAY), 75),
  ('b0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'a0000000-0000-0000-0000-000000000001', 'Nexora pilot', 29988.00,
   'QUALIFIED', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 30)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO employees (id, tenant_id, employee_code, full_name, email, department,
                       designation, date_of_joining, annual_ctc, status, leave_balance)
VALUES
  ('c0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'EMP001', 'Karan Shah', 'karan@acme-retail.in', 'Sales', 'Account Executive',
   '2025-04-01', 1200000.00, 'ACTIVE', 24),
  ('c0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'EMP002', 'Priya Nair', 'priya@acme-retail.in', 'Support', 'Support Lead',
   '2024-11-15', 950000.00, 'ACTIVE', 18)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
