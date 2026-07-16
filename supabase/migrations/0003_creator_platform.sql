-- WalkPerro — Creator Platform Migration
-- The multi-tenant creator SaaS data model: creators (on Supabase Auth),
-- connected social accounts, the scrape→analyze→generate pipeline, voice
-- profiles, product opportunities, products + versioned assets, storefronts,
-- orders + ledger + payouts, subscriptions, plan limits, and webhook idempotency.
-- Schema: walkperro. Reuses walkperro.set_updated_at() from 0001.
--
-- RLS model: owner-scoped policies for the `authenticated` role (creator reads
-- via the @supabase/ssr client go through RLS); service role (Inngest, webhooks,
-- storefront SSR) bypasses RLS entirely. Published storefronts/products are
-- public-readable as defense-in-depth.

-- ============================================================================
-- 1. creators  (1:1 with auth.users)
-- ============================================================================
create table if not exists walkperro.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  username text unique,                       -- claimed storefront slug (see storefronts)
  display_name text,
  avatar_url text,
  plan text not null default 'free',          -- free | pro_29 | studio_79
  stripe_customer_id text,                    -- platform billing customer (subscriptions)
  stripe_account_id text,                     -- Connect Express account (null = deferred)
  stripe_account_status text not null default 'none', -- none | onboarding | active | restricted
  onboarded_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint creators_username_format
    check (username is null or username ~ '^[a-z0-9_.]{3,30}$')
);
create index if not exists creators_user_idx on walkperro.creators (user_id);
create index if not exists creators_username_idx on walkperro.creators (username);
create index if not exists creators_plan_idx on walkperro.creators (plan);

drop trigger if exists trg_creators_updated_at on walkperro.creators;
create trigger trg_creators_updated_at
  before update on walkperro.creators
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 2. connected_accounts  (social profiles a creator links)
-- ============================================================================
create table if not exists walkperro.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references walkperro.creators(id) on delete cascade,
  platform text not null check (platform in ('tiktok','instagram','youtube')),
  handle text not null,
  profile_url text not null,
  bio text,
  follower_count int,
  avatar_url text,
  last_scraped_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (creator_id, platform, handle)
);
create index if not exists connected_accounts_creator_idx on walkperro.connected_accounts (creator_id);

drop trigger if exists trg_connected_accounts_updated_at on walkperro.connected_accounts;
create trigger trg_connected_accounts_updated_at
  before update on walkperro.connected_accounts
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 3. pipeline_runs  (scrape→transcribe→analyze→generate jobs; drives wow-screen)
-- ============================================================================
create table if not exists walkperro.pipeline_runs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references walkperro.creators(id) on delete cascade,
  connected_account_id uuid references walkperro.connected_accounts(id) on delete set null,
  kind text not null default 'analyze',       -- analyze | refresh | generate
  status text not null default 'queued',      -- queued | running | succeeded | failed
  stage text,                                 -- current step label
  stage_detail jsonb default '{}',            -- {videos_found, transcribed, analyzed, ...}
  pct int not null default 0,
  apify_run_id text,
  cost_cents int not null default 0,          -- accumulated Apify + Whisper + LLM cost
  error text,
  created_at timestamptz default now(),
  finished_at timestamptz
);
create index if not exists pipeline_runs_creator_idx on walkperro.pipeline_runs (creator_id);
create index if not exists pipeline_runs_status_idx on walkperro.pipeline_runs (status);
create index if not exists pipeline_runs_apify_idx on walkperro.pipeline_runs (apify_run_id);

-- ============================================================================
-- 4. source_videos  (normalized scraped videos + transcripts + extractions)
-- ============================================================================
create table if not exists walkperro.source_videos (
  id uuid primary key default gen_random_uuid(),
  connected_account_id uuid not null references walkperro.connected_accounts(id) on delete cascade,
  platform_video_id text not null,
  url text,
  caption text,
  hashtags text[] default '{}',
  posted_at timestamptz,
  views bigint,
  likes int,
  comments_count int,
  shares int,
  duration_seconds int,
  transcript text,
  transcript_source text,                     -- captions | actor | whisper | none
  extraction jsonb,                           -- Haiku output: topics, hooks, advice, phrases
  top_comments jsonb,
  created_at timestamptz default now(),
  unique (connected_account_id, platform_video_id)
);
create index if not exists source_videos_account_idx on walkperro.source_videos (connected_account_id);
create index if not exists source_videos_views_idx on walkperro.source_videos (views desc);

-- ============================================================================
-- 5. voice_profiles  (versioned; profile jsonb + byte-stable cached prompt prefix)
-- ============================================================================
create table if not exists walkperro.voice_profiles (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references walkperro.creators(id) on delete cascade,
  version int not null default 1,
  profile jsonb not null,                     -- tone, vocabulary, rhythm, catchphrases, POV, audience, dos/donts
  prompt_prefix text not null,                -- deterministic rendered cache prefix (>4096 tokens)
  videos_analyzed int,
  created_at timestamptz default now(),
  unique (creator_id, version)
);
create index if not exists voice_profiles_creator_idx on walkperro.voice_profiles (creator_id);

-- ============================================================================
-- 6. product_opportunities  (topic clusters; powers the wow-screen)
-- ============================================================================
create table if not exists walkperro.product_opportunities (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references walkperro.creators(id) on delete cascade,
  pipeline_run_id uuid references walkperro.pipeline_runs(id) on delete set null,
  title text not null,
  angle text,
  description text,
  demand_score numeric,                       -- engagement-weighted
  evidence jsonb,                             -- [{video_id, views, why}], comment quotes
  status text not null default 'suggested',   -- suggested | selected | dismissed
  created_at timestamptz default now()
);
create index if not exists product_opportunities_creator_idx on walkperro.product_opportunities (creator_id);

-- ============================================================================
-- 7. products
-- ============================================================================
create table if not exists walkperro.products (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references walkperro.creators(id) on delete cascade,
  opportunity_id uuid references walkperro.product_opportunities(id) on delete set null,
  slug text not null,
  title text not null,
  price_cents int not null default 2900,
  status text not null default 'generating',  -- generating | review | published | archived
  format text not null default 'interactive', -- interactive | pdf | tool | quiz (bake-off)
  stripe_product_id text,
  stripe_price_id text,
  quality_report jsonb,                       -- rubric scores from the quality gate
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (creator_id, slug)
);
create index if not exists products_creator_idx on walkperro.products (creator_id);
create index if not exists products_status_idx on walkperro.products (status);

drop trigger if exists trg_products_updated_at on walkperro.products;
create trigger trg_products_updated_at
  before update on walkperro.products
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 8. product_assets  (versioned; content jsonb is the source of truth for regen/edit)
-- ============================================================================
create table if not exists walkperro.product_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references walkperro.products(id) on delete cascade,
  kind text not null,   -- guide | workbook | checklist | sales_page | cover | email_sequence | launch_script | course_outline | tool | quiz
  version int not null default 1,
  content jsonb,                              -- structured blocks
  file_path text,                            -- rendered artifact in Storage (null for web/interactive)
  status text not null default 'pending',    -- pending | generated | approved | failed
  edited_by_creator boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (product_id, kind, version)
);
create index if not exists product_assets_product_idx on walkperro.product_assets (product_id);

drop trigger if exists trg_product_assets_updated_at on walkperro.product_assets;
create trigger trg_product_assets_updated_at
  before update on walkperro.product_assets
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 9. storefronts  (1:1 with creator; walkperro.com/[username])
-- ============================================================================
create table if not exists walkperro.storefronts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null unique references walkperro.creators(id) on delete cascade,
  username text not null unique,
  headline text,
  about text,
  theme jsonb not null default '{}',          -- palette, font_pair, layout variant
  custom_domain text unique,                  -- paid tier
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint storefronts_username_format check (username ~ '^[a-z0-9_.]{3,30}$')
);
create index if not exists storefronts_username_idx on walkperro.storefronts (username);
create index if not exists storefronts_domain_idx on walkperro.storefronts (custom_domain);

drop trigger if exists trg_storefronts_updated_at on walkperro.storefronts;
create trigger trg_storefronts_updated_at
  before update on walkperro.storefronts
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 10. orders
-- ============================================================================
create table if not exists walkperro.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references walkperro.products(id) on delete restrict,
  creator_id uuid not null references walkperro.creators(id) on delete restrict,
  buyer_email text not null,
  amount_cents int not null,
  currency text not null default 'usd',
  charge_mode text not null,                  -- platform_mor | destination
  application_fee_cents int not null default 0,
  net_to_creator_cents int not null default 0,
  stripe_payment_intent_id text unique,
  stripe_checkout_session_id text,
  status text not null default 'paid',        -- paid | refunded | disputed
  download_token text unique,
  token_expires_at timestamptz,
  downloaded_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists orders_creator_idx on walkperro.orders (creator_id);
create index if not exists orders_product_idx on walkperro.orders (product_id);
create index if not exists orders_token_idx on walkperro.orders (download_token);

-- ============================================================================
-- 11. payouts  (declared before ledger_entries which references it)
-- ============================================================================
create table if not exists walkperro.payouts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references walkperro.creators(id) on delete restrict,
  amount_cents int not null,
  stripe_transfer_id text unique,
  status text not null default 'pending',     -- pending | paid | failed
  created_at timestamptz default now()
);
create index if not exists payouts_creator_idx on walkperro.payouts (creator_id);

-- ============================================================================
-- 12. ledger_entries  (free-tier held balance; balance = SUM(amount_cents))
-- ============================================================================
create table if not exists walkperro.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references walkperro.creators(id) on delete cascade,
  order_id uuid references walkperro.orders(id) on delete set null,
  payout_id uuid references walkperro.payouts(id) on delete set null,
  kind text not null,                         -- sale_credit | refund_debit | payout_debit | adjustment
  amount_cents int not null,                  -- signed
  created_at timestamptz default now()
);
create index if not exists ledger_entries_creator_idx on walkperro.ledger_entries (creator_id);

create or replace function walkperro.creator_balance(p_creator_id uuid)
returns int
language sql
stable
as $$
  select coalesce(sum(amount_cents), 0)::int
  from walkperro.ledger_entries
  where creator_id = p_creator_id;
$$;

-- ============================================================================
-- 13. subscriptions  (Stripe Billing for $29/$79 tiers)
-- ============================================================================
create table if not exists walkperro.subscriptions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null unique references walkperro.creators(id) on delete cascade,
  stripe_subscription_id text unique,
  plan text not null,                         -- pro_29 | studio_79
  status text not null,                       -- active | past_due | canceled | trialing
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists subscriptions_creator_idx on walkperro.subscriptions (creator_id);

drop trigger if exists trg_subscriptions_updated_at on walkperro.subscriptions;
create trigger trg_subscriptions_updated_at
  before update on walkperro.subscriptions
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 14. plan_limits  (seeded config, keyed by plan)
-- ============================================================================
create table if not exists walkperro.plan_limits (
  plan text primary key,
  max_videos_scraped int not null,
  max_whisper_minutes int not null,
  max_products int not null,
  max_generations_per_month int not null,
  revshare_bps int not null,                  -- 1000 = 10%; 0 for paid
  watermark boolean not null default true
);

insert into walkperro.plan_limits
  (plan, max_videos_scraped, max_whisper_minutes, max_products, max_generations_per_month, revshare_bps, watermark)
values
  ('free',      50,  60,   1,  3, 1000, true),
  ('pro_29',   200, 180, 999, 999,   0, false),
  ('studio_79',500, 400, 999, 999,   0, false)
on conflict (plan) do update set
  max_videos_scraped = excluded.max_videos_scraped,
  max_whisper_minutes = excluded.max_whisper_minutes,
  max_products = excluded.max_products,
  max_generations_per_month = excluded.max_generations_per_month,
  revshare_bps = excluded.revshare_bps,
  watermark = excluded.watermark;

-- ============================================================================
-- 15. webhook_events  (Stripe + Apify idempotency)
-- ============================================================================
create table if not exists walkperro.webhook_events (
  id text primary key,                        -- provider event id
  provider text not null,                     -- stripe | stripe_connect | apify
  type text,
  payload jsonb,
  processed_at timestamptz default now()
);

-- ============================================================================
-- RLS — enable on every table.
-- Owner-scoped policies target the `authenticated` role (creator dashboard
-- reads via @supabase/ssr). Service role bypasses RLS. Published storefronts
-- and products are public-readable (defense-in-depth; SSR uses service role).
-- ============================================================================
alter table walkperro.creators enable row level security;
alter table walkperro.connected_accounts enable row level security;
alter table walkperro.pipeline_runs enable row level security;
alter table walkperro.source_videos enable row level security;
alter table walkperro.voice_profiles enable row level security;
alter table walkperro.product_opportunities enable row level security;
alter table walkperro.products enable row level security;
alter table walkperro.product_assets enable row level security;
alter table walkperro.storefronts enable row level security;
alter table walkperro.orders enable row level security;
alter table walkperro.payouts enable row level security;
alter table walkperro.ledger_entries enable row level security;
alter table walkperro.subscriptions enable row level security;
alter table walkperro.plan_limits enable row level security;
alter table walkperro.webhook_events enable row level security;

-- creators: a user can read/update only their own row
drop policy if exists "creator reads own row" on walkperro.creators;
create policy "creator reads own row" on walkperro.creators
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "creator updates own row" on walkperro.creators;
create policy "creator updates own row" on walkperro.creators
  for update to authenticated using (user_id = (select auth.uid()));

-- Helper predicate is inlined per table: creator_id belongs to the caller.
-- connected_accounts
drop policy if exists "creator reads own accounts" on walkperro.connected_accounts;
create policy "creator reads own accounts" on walkperro.connected_accounts
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));

-- pipeline_runs
drop policy if exists "creator reads own runs" on walkperro.pipeline_runs;
create policy "creator reads own runs" on walkperro.pipeline_runs
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));

-- voice_profiles
drop policy if exists "creator reads own voice" on walkperro.voice_profiles;
create policy "creator reads own voice" on walkperro.voice_profiles
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));

-- product_opportunities
drop policy if exists "creator reads own opportunities" on walkperro.product_opportunities;
create policy "creator reads own opportunities" on walkperro.product_opportunities
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));

-- products (owner read/update; public read when published)
drop policy if exists "creator reads own products" on walkperro.products;
create policy "creator reads own products" on walkperro.products
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));
drop policy if exists "public reads published products" on walkperro.products;
create policy "public reads published products" on walkperro.products
  for select to anon, authenticated using (status = 'published');

-- product_assets (owner read via product ownership)
drop policy if exists "creator reads own assets" on walkperro.product_assets;
create policy "creator reads own assets" on walkperro.product_assets
  for select to authenticated
  using (product_id in (
    select p.id from walkperro.products p
    join walkperro.creators c on c.id = p.creator_id
    where c.user_id = (select auth.uid())
  ));

-- storefronts (owner read/update; public read when published)
drop policy if exists "creator reads own storefront" on walkperro.storefronts;
create policy "creator reads own storefront" on walkperro.storefronts
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));
drop policy if exists "creator updates own storefront" on walkperro.storefronts;
create policy "creator updates own storefront" on walkperro.storefronts
  for update to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));
drop policy if exists "public reads published storefronts" on walkperro.storefronts;
create policy "public reads published storefronts" on walkperro.storefronts
  for select to anon, authenticated using (published = true);

-- orders / payouts / ledger / subscriptions: owner read only
drop policy if exists "creator reads own orders" on walkperro.orders;
create policy "creator reads own orders" on walkperro.orders
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));
drop policy if exists "creator reads own payouts" on walkperro.payouts;
create policy "creator reads own payouts" on walkperro.payouts
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));
drop policy if exists "creator reads own ledger" on walkperro.ledger_entries;
create policy "creator reads own ledger" on walkperro.ledger_entries
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));
drop policy if exists "creator reads own subscription" on walkperro.subscriptions;
create policy "creator reads own subscription" on walkperro.subscriptions
  for select to authenticated
  using (creator_id in (select id from walkperro.creators where user_id = (select auth.uid())));

-- plan_limits: readable by any authenticated user (config)
drop policy if exists "authenticated reads plan limits" on walkperro.plan_limits;
create policy "authenticated reads plan limits" on walkperro.plan_limits
  for select to anon, authenticated using (true);

-- source_videos and webhook_events: no policies => default deny (service role only).

-- ============================================================================
-- Grants for the authenticated / anon roles (RLS still applies on top).
-- Service role already has full access from 0001's schema setup.
-- ============================================================================
grant usage on schema walkperro to authenticated, anon;
grant select on walkperro.creators, walkperro.connected_accounts, walkperro.pipeline_runs,
  walkperro.voice_profiles, walkperro.product_opportunities, walkperro.products,
  walkperro.product_assets, walkperro.storefronts, walkperro.orders, walkperro.payouts,
  walkperro.ledger_entries, walkperro.subscriptions, walkperro.plan_limits
  to authenticated;
grant update on walkperro.creators, walkperro.storefronts to authenticated;
grant select on walkperro.products, walkperro.storefronts, walkperro.plan_limits to anon;

-- NOTE: expose the `walkperro` schema to the Data API in the Supabase dashboard
-- (Settings → API → Exposed schemas) so the authenticated/anon PostgREST roles
-- can reach these tables. The service-role admin client already uses it.
