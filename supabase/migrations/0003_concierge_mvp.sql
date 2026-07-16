-- WalkPerro — Concierge MVP Migration
-- Two tables for the concierge phase: intake_submissions (the landing-page
-- form + operator ops pipeline) and orders (Stripe payment-link sales log).
-- Schema: walkperro. Reuses walkperro.set_updated_at() from 0001.
--
-- NOTE: the full self-serve SaaS schema (15 tables) is parked on the
-- `saas-full-build` branch as 0003_creator_platform.sql — renumber it to
-- 0004+ when that branch resumes.
--
-- Access model: admin/operator only. RLS enabled with NO policies =>
-- default deny; every read/write goes through the service-role client.

-- ============================================================================
-- 1. intake_submissions
-- ============================================================================
create table if not exists walkperro.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  -- contact
  name text not null,
  email text not null,
  phone text,
  -- where they create
  platform text not null check (platform in ('tiktok','instagram','youtube')),
  handle text not null,
  other_links text,
  -- expertise questionnaire (the product engine's real input)
  niche text,
  audience_size text,                          -- bucket: <10k | 10k-50k | 50k-200k | 200k+
  q_always_ask text,                           -- "what do people always ask you?"
  q_result text,                               -- "what result have you gotten that followers want?"
  q_would_charge text,                         -- "what would you charge for your best advice?"
  -- operator ops pipeline
  status text not null default 'new'
    check (status in ('new','building','delivered','live','selling')),
  notes text,
  -- stripe connect (filled by operator from /admin)
  stripe_account_id text,
  product_title text,
  price_cents int,
  stripe_payment_link_id text,                 -- maps webhook sessions back to this row
  payment_link_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists intake_status_idx on walkperro.intake_submissions (status);
create index if not exists intake_created_idx on walkperro.intake_submissions (created_at desc);
create index if not exists intake_email_idx on walkperro.intake_submissions (email);
create index if not exists intake_plink_idx on walkperro.intake_submissions (stripe_payment_link_id);

drop trigger if exists trg_intake_updated_at on walkperro.intake_submissions;
create trigger trg_intake_updated_at
  before update on walkperro.intake_submissions
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 2. orders  (concierge sales log, written by the Stripe webhook)
-- ============================================================================
create table if not exists walkperro.orders (
  id uuid primary key default gen_random_uuid(),
  intake_submission_id uuid references walkperro.intake_submissions(id) on delete set null,
  stripe_checkout_session_id text not null unique,   -- idempotency key
  stripe_payment_intent_id text,
  stripe_payment_link_id text,
  destination_account text,                          -- connected acct the funds went to
  buyer_email text,
  amount_cents int not null default 0,
  application_fee_cents int not null default 0,
  created_at timestamptz default now()
);
create index if not exists orders_intake_idx on walkperro.orders (intake_submission_id);
create index if not exists orders_created_idx on walkperro.orders (created_at desc);

-- ============================================================================
-- RLS — default deny (no policies). Service role bypasses.
-- ============================================================================
alter table walkperro.intake_submissions enable row level security;
alter table walkperro.orders enable row level security;
