CREATE DATABASE IF NOT EXISTS hubflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE hubflow;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE tenants (
  id                   CHAR(36)      NOT NULL,
  name                 VARCHAR(160)  NOT NULL,
  slug                 VARCHAR(80)   NOT NULL,
  gstin                VARCHAR(15)   NULL,
  whatsapp_number      VARCHAR(20)   NULL,
  whatsapp_business_id VARCHAR(64)   NULL,
  status               ENUM('TRIAL','ACTIVE','PAST_DUE','SUSPENDED','CANCELLED')
                                     NOT NULL DEFAULT 'TRIAL',
  created_at           DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at           DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                     ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_tenants_slug (slug),
  KEY idx_tenants_status (status)
) ENGINE = InnoDB;

CREATE TABLE users (
  id                    CHAR(36)     NOT NULL,
  tenant_id             CHAR(36)     NOT NULL,
  full_name             VARCHAR(120) NOT NULL,
  email                 VARCHAR(180) NOT NULL,
  phone                 VARCHAR(20)  NULL,
  password_hash         VARCHAR(100) NOT NULL,
  email_verified        TINYINT(1)   NOT NULL DEFAULT 0,
  phone_verified        TINYINT(1)   NOT NULL DEFAULT 0,
  enabled               TINYINT(1)   NOT NULL DEFAULT 1,
  failed_login_attempts INT          NOT NULL DEFAULT 0,
  locked_until          DATETIME(6)  NULL,
  last_login_at         DATETIME(6)  NULL,
  created_at            DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at            DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                     ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_tenant (tenant_id),
  KEY idx_users_phone (phone),
  CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE user_roles (
  user_id CHAR(36) NOT NULL,
  role    ENUM('OWNER','ADMIN','MARKETER','AGENT','FINANCE','VIEWER') NOT NULL,
  PRIMARY KEY (user_id, role),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE refresh_tokens (
  id         CHAR(36)     NOT NULL,
  user_id    CHAR(36)     NOT NULL,
  token_hash VARCHAR(100) NOT NULL,
  expires_at DATETIME(6)  NOT NULL,
  revoked_at DATETIME(6)  NULL,
  user_agent VARCHAR(240) NULL,
  created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                          ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_refresh_hash (token_hash),
  KEY idx_refresh_user (user_id),
  KEY idx_refresh_expiry (expires_at),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE otp_tokens (
  id            CHAR(36)     NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  code_hash     VARCHAR(100) NOT NULL,
  purpose       ENUM('REGISTRATION','LOGIN','PHONE_VERIFICATION','PASSWORD_RESET') NOT NULL,
  expires_at    DATETIME(6)  NOT NULL,
  attempts_used INT          NOT NULL DEFAULT 0,
  consumed_at   DATETIME(6)  NULL,
  created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                             ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_otp_phone_purpose (phone, purpose, consumed_at),
  KEY idx_otp_expires (expires_at)
) ENGINE = InnoDB;

CREATE TABLE contacts (
  id                CHAR(36)     NOT NULL,
  tenant_id         CHAR(36)     NOT NULL,
  full_name         VARCHAR(120) NOT NULL,
  phone             VARCHAR(20)  NOT NULL,
  email             VARCHAR(180) NULL,
  company_name      VARCHAR(160) NULL,
  lifecycle_stage   ENUM('NEW','QUALIFIED','DEMO','NEGOTIATION','WON','LOST')
                                 NOT NULL DEFAULT 'NEW',
  owner_id          CHAR(36)     NULL,
  lead_score        INT          NOT NULL DEFAULT 0,
  tags              VARCHAR(240) NULL,
  source            VARCHAR(60)  NULL,
  opted_out         TINYINT(1)   NOT NULL DEFAULT 0,
  last_contacted_at DATETIME(6)  NULL,
  created_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                 ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_contacts_tenant_phone (tenant_id, phone),
  KEY idx_contacts_tenant_stage (tenant_id, lifecycle_stage),
  KEY idx_contacts_owner (owner_id),
  KEY idx_contacts_email (email),
  KEY idx_contacts_tenant_created (tenant_id, created_at DESC),
  KEY idx_contacts_dispatch (tenant_id, opted_out, lead_score DESC),
  CONSTRAINT fk_contacts_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT fk_contacts_owner FOREIGN KEY (owner_id)
    REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE deals (
  id                  CHAR(36)       NOT NULL,
  tenant_id           CHAR(36)       NOT NULL,
  contact_id          CHAR(36)       NOT NULL,
  title               VARCHAR(160)   NOT NULL,
  deal_value          DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  currency            CHAR(3)        NOT NULL DEFAULT 'INR',
  stage               ENUM('NEW','QUALIFIED','DEMO','NEGOTIATION','WON','LOST')
                                     NOT NULL DEFAULT 'NEW',
  owner_id            CHAR(36)       NULL,
  expected_close_date DATE           NULL,
  win_probability     INT            NULL DEFAULT 20,
  lost_reason         VARCHAR(240)   NULL,
  created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                     ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_deals_tenant_stage (tenant_id, stage),
  KEY idx_deals_contact (contact_id),
  KEY idx_deals_close_date (expected_close_date),
  KEY idx_deals_forecast (tenant_id, stage, expected_close_date),
  CONSTRAINT fk_deals_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT fk_deals_contact FOREIGN KEY (contact_id)
    REFERENCES contacts (id) ON DELETE CASCADE,
  CONSTRAINT fk_deals_owner FOREIGN KEY (owner_id)
    REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT chk_deals_probability CHECK (win_probability BETWEEN 0 AND 100)
) ENGINE = InnoDB;

CREATE TABLE message_templates (
  id               CHAR(36)     NOT NULL,
  tenant_id        CHAR(36)     NOT NULL,
  name             VARCHAR(120) NOT NULL,
  language         VARCHAR(12)  NOT NULL DEFAULT 'en',
  category         ENUM('MARKETING','UTILITY','AUTHENTICATION') NOT NULL DEFAULT 'MARKETING',
  body_text        TEXT         NOT NULL,
  header_text      VARCHAR(200) NULL,
  footer_text      VARCHAR(200) NULL,
  approval_status  ENUM('PENDING','APPROVED','REJECTED','PAUSED','DISABLED')
                                NOT NULL DEFAULT 'PENDING',
  meta_template_id VARCHAR(64)  NULL,
  quality_rating   VARCHAR(20)  NULL,
  created_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_templates_tenant_name (tenant_id, name, language),
  KEY idx_templates_tenant_status (tenant_id, approval_status),
  CONSTRAINT fk_templates_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE campaigns (
  id               CHAR(36)     NOT NULL,
  tenant_id        CHAR(36)     NOT NULL,
  name             VARCHAR(160) NOT NULL,
  template_id      CHAR(36)     NOT NULL,
  segment_filter   VARCHAR(500) NULL,
  status           ENUM('DRAFT','SCHEDULED','QUEUED','RUNNING','PAUSED','COMPLETED','FAILED','CANCELLED')
                                NOT NULL DEFAULT 'DRAFT',
  scheduled_at     DATETIME(6)  NULL,
  started_at       DATETIME(6)  NULL,
  completed_at     DATETIME(6)  NULL,
  total_recipients INT          NOT NULL DEFAULT 0,
  sent_count       INT          NOT NULL DEFAULT 0,
  delivered_count  INT          NOT NULL DEFAULT 0,
  read_count       INT          NOT NULL DEFAULT 0,
  failed_count     INT          NOT NULL DEFAULT 0,
  created_by       CHAR(36)     NULL,
  created_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_campaigns_tenant_status (tenant_id, status),
  KEY idx_campaigns_scheduled (status, scheduled_at),
  KEY idx_campaigns_tenant_created (tenant_id, created_at DESC),
  CONSTRAINT fk_campaigns_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT fk_campaigns_template FOREIGN KEY (template_id)
    REFERENCES message_templates (id) ON DELETE RESTRICT,
  CONSTRAINT fk_campaigns_creator FOREIGN KEY (created_by)
    REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE campaign_recipients (
  id                  CHAR(36)     NOT NULL,
  campaign_id         CHAR(36)     NOT NULL,
  contact_id          CHAR(36)     NOT NULL,
  phone               VARCHAR(20)  NOT NULL,
  delivery_state      ENUM('PENDING','QUEUED','SENT','DELIVERED','READ','FAILED','SKIPPED')
                                   NOT NULL DEFAULT 'PENDING',
  provider_message_id VARCHAR(80)  NULL,
  failure_reason      VARCHAR(240) NULL,
  sent_at             DATETIME(6)  NULL,
  delivered_at        DATETIME(6)  NULL,
  read_at             DATETIME(6)  NULL,
  retry_count         INT          NOT NULL DEFAULT 0,
  created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                   ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_recipient_campaign_contact (campaign_id, contact_id),
  UNIQUE KEY uk_recipient_provider_message (provider_message_id),
  KEY idx_recipients_campaign_state (campaign_id, delivery_state),
  KEY idx_recipients_contact (contact_id),
  CONSTRAINT fk_recipients_campaign FOREIGN KEY (campaign_id)
    REFERENCES campaigns (id) ON DELETE CASCADE,
  CONSTRAINT fk_recipients_contact FOREIGN KEY (contact_id)
    REFERENCES contacts (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE plans (
  id                     VARCHAR(40)    NOT NULL,
  name                   VARCHAR(80)    NOT NULL,
  description            VARCHAR(240)   NOT NULL,
  monthly_price          DECIMAL(12, 2) NOT NULL,
  yearly_price           DECIMAL(12, 2) NOT NULL,
  currency               CHAR(3)        NOT NULL DEFAULT 'INR',
  conversation_allowance INT            NULL,
  seat_limit             INT            NULL,
  featured               TINYINT(1)     NOT NULL DEFAULT 0,
  feature_list           VARCHAR(1000)  NULL,
  sort_order             INT            NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_plans_sort (sort_order)
) ENGINE = InnoDB;

CREATE TABLE subscriptions (
  id                   CHAR(36)    NOT NULL,
  tenant_id            CHAR(36)    NOT NULL,
  plan_id              VARCHAR(40) NOT NULL,
  billing_cycle        ENUM('MONTHLY','YEARLY') NOT NULL DEFAULT 'MONTHLY',
  status               ENUM('TRIALING','ACTIVE','PAST_DUE','CANCELLED','EXPIRED')
                                   NOT NULL DEFAULT 'TRIALING',
  current_period_start DATETIME(6) NOT NULL,
  current_period_end   DATETIME(6) NOT NULL,
  cancel_at_period_end TINYINT(1)  NOT NULL DEFAULT 0,
  conversations_used   INT         NOT NULL DEFAULT 0,
  created_at           DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at           DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                   ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_subscriptions_tenant (tenant_id, created_at DESC),
  KEY idx_subscriptions_period_end (current_period_end),
  KEY idx_subscriptions_renewal (status, current_period_end),
  CONSTRAINT fk_subscriptions_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id)
    REFERENCES plans (id) ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE invoices (
  id                  CHAR(36)       NOT NULL,
  tenant_id           CHAR(36)       NOT NULL,
  invoice_number      VARCHAR(40)    NOT NULL,
  subscription_id     CHAR(36)       NULL,
  platform_amount     DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  conversation_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  tax_amount          DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  total_amount        DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  currency            CHAR(3)        NOT NULL DEFAULT 'INR',
  status              ENUM('DRAFT','ISSUED','PAID','OVERDUE','VOID') NOT NULL DEFAULT 'DRAFT',
  issue_date          DATE           NOT NULL,
  due_date            DATE           NOT NULL,
  paid_at             DATETIME(6)    NULL,
  created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                     ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_invoices_number (invoice_number),
  KEY idx_invoices_tenant_status (tenant_id, status),
  KEY idx_invoices_due (due_date),
  KEY idx_invoices_collections (status, due_date),
  CONSTRAINT fk_invoices_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT fk_invoices_subscription FOREIGN KEY (subscription_id)
    REFERENCES subscriptions (id) ON DELETE SET NULL,
  CONSTRAINT chk_invoices_total CHECK (total_amount >= 0)
) ENGINE = InnoDB;

CREATE TABLE employees (
  id              CHAR(36)       NOT NULL,
  tenant_id       CHAR(36)       NOT NULL,
  employee_code   VARCHAR(24)    NOT NULL,
  full_name       VARCHAR(120)   NOT NULL,
  email           VARCHAR(180)   NOT NULL,
  phone           VARCHAR(20)    NULL,
  department      VARCHAR(80)    NOT NULL,
  designation     VARCHAR(80)    NOT NULL,
  date_of_joining DATE           NOT NULL,
  annual_ctc      DECIMAL(14, 2) NULL,
  manager_id      CHAR(36)       NULL,
  status          ENUM('ACTIVE','ON_NOTICE','ON_LEAVE','EXITED') NOT NULL DEFAULT 'ACTIVE',
  leave_balance   INT            NOT NULL DEFAULT 24,
  created_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                                 ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_employees_tenant_code (tenant_id, employee_code),
  KEY idx_employees_tenant_status (tenant_id, status),
  KEY idx_employees_manager (manager_id),
  KEY idx_employees_department (tenant_id, department),
  CONSTRAINT fk_employees_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT fk_employees_manager FOREIGN KEY (manager_id)
    REFERENCES employees (id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE leave_requests (
  id          CHAR(36)     NOT NULL,
  tenant_id   CHAR(36)     NOT NULL,
  employee_id CHAR(36)     NOT NULL,
  leave_type  ENUM('CASUAL','SICK','EARNED','UNPAID','MATERNITY','PATERNITY')
                           NOT NULL DEFAULT 'CASUAL',
  start_date  DATE         NOT NULL,
  end_date    DATE         NOT NULL,
  day_count   INT          NOT NULL,
  reason      VARCHAR(400) NULL,
  status      ENUM('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  decided_by  CHAR(36)     NULL,
  decided_at  DATETIME(6)  NULL,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                           ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_leave_employee_status (employee_id, status),
  KEY idx_leave_dates (start_date, end_date),
  KEY idx_leave_tenant_status (tenant_id, status),
  CONSTRAINT fk_leave_tenant FOREIGN KEY (tenant_id)
    REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id)
    REFERENCES employees (id) ON DELETE CASCADE,
  CONSTRAINT chk_leave_range CHECK (end_date >= start_date)
) ENGINE = InnoDB;

CREATE TABLE audit_logs (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id   CHAR(36)        NOT NULL,
  actor_id    CHAR(36)        NULL,
  action      VARCHAR(80)     NOT NULL,
  entity_type VARCHAR(60)     NOT NULL,
  entity_id   VARCHAR(64)     NULL,
  metadata    JSON            NULL,
  ip_address  VARCHAR(45)     NULL,
  created_at  DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_audit_tenant_time (tenant_id, created_at DESC),
  KEY idx_audit_entity (entity_type, entity_id),
  KEY idx_audit_actor (actor_id)
) ENGINE = InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
