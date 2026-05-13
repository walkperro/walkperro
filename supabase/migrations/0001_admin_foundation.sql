-- WalkPerro — Admin Foundation Migration
-- Creates all tables for: subscribers, posts, NOW strip, tools, tool downloads,
-- drafts, admin users + sessions + audit log + password resets, and rate limits.
-- Schema: walkperro

-- ============================================================================
-- updated_at trigger function (shared)
-- ============================================================================
create or replace function walkperro.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 1. subscribers
-- ============================================================================
create table if not exists walkperro.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null,
  status text not null default 'active',
  tags text[] default '{}',
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists subscribers_email_idx on walkperro.subscribers (email);
create index if not exists subscribers_source_idx on walkperro.subscribers (source);
create index if not exists subscribers_created_idx on walkperro.subscribers (created_at desc);

drop trigger if exists trg_subscribers_updated_at on walkperro.subscribers;
create trigger trg_subscribers_updated_at
  before update on walkperro.subscribers
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 2. posts
-- ============================================================================
create table if not exists walkperro.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'BUILD LOG',
  excerpt text,
  body_md text not null,
  status text not null default 'draft',
  scheduled_for timestamptz,
  published_at timestamptz,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists posts_slug_idx on walkperro.posts (slug);
create index if not exists posts_status_idx on walkperro.posts (status);
create index if not exists posts_published_idx on walkperro.posts (published_at desc);

drop trigger if exists trg_posts_updated_at on walkperro.posts;
create trigger trg_posts_updated_at
  before update on walkperro.posts
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 3. now_strip
-- ============================================================================
create table if not exists walkperro.now_strip (
  id uuid primary key default gen_random_uuid(),
  building text,
  reading text,
  listening text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_now_strip_updated_at on walkperro.now_strip;
create trigger trg_now_strip_updated_at
  before update on walkperro.now_strip
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 4. tools
-- ============================================================================
create table if not exists walkperro.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  status text not null default 'DRAFT',
  url text,
  file_path text,
  price_cents int default 0,
  stripe_price_id text,
  requires_email boolean default true,
  download_count int default 0,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_tools_updated_at on walkperro.tools;
create trigger trg_tools_updated_at
  before update on walkperro.tools
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 5. tool_downloads
-- ============================================================================
create table if not exists walkperro.tool_downloads (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references walkperro.tools(id) on delete cascade,
  subscriber_id uuid references walkperro.subscribers(id) on delete set null,
  email text not null,
  stripe_payment_intent_id text,
  amount_paid_cents int default 0,
  download_token text not null unique,
  token_expires_at timestamptz not null,
  downloaded_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists tool_downloads_token_idx on walkperro.tool_downloads (download_token);
create index if not exists tool_downloads_email_idx on walkperro.tool_downloads (email);

-- ============================================================================
-- 6. drafts
-- ============================================================================
create table if not exists walkperro.drafts (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  platforms text[] default '{}',
  caption text,
  body jsonb default '{}',
  asset_paths text[] default '{}',
  status text not null default 'pending',
  scheduled_for timestamptz,
  posted_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists drafts_status_idx on walkperro.drafts (status);

drop trigger if exists trg_drafts_updated_at on walkperro.drafts;
create trigger trg_drafts_updated_at
  before update on walkperro.drafts
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 7. admin_users
-- ============================================================================
create table if not exists walkperro.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  totp_secret text,
  totp_enabled boolean default false,
  backup_codes text[] default '{}',
  last_login_at timestamptz,
  last_login_ip text,
  failed_login_count int default 0,
  locked_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_admin_users_updated_at on walkperro.admin_users;
create trigger trg_admin_users_updated_at
  before update on walkperro.admin_users
  for each row execute function walkperro.set_updated_at();

-- ============================================================================
-- 8. admin_sessions
-- ============================================================================
create table if not exists walkperro.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references walkperro.admin_users(id) on delete cascade,
  session_token_hash text not null unique,
  ip_address text,
  user_agent text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists admin_sessions_token_idx on walkperro.admin_sessions (session_token_hash);
create index if not exists admin_sessions_user_idx on walkperro.admin_sessions (admin_user_id);

-- ============================================================================
-- 9. admin_audit_log
-- ============================================================================
create table if not exists walkperro.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references walkperro.admin_users(id) on delete set null,
  action text not null,
  details jsonb default '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);
create index if not exists audit_log_user_idx on walkperro.admin_audit_log (admin_user_id);
create index if not exists audit_log_created_idx on walkperro.admin_audit_log (created_at desc);

-- ============================================================================
-- 10. password_resets (for admin forgot-password flow)
-- ============================================================================
create table if not exists walkperro.password_resets (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references walkperro.admin_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists password_resets_token_idx on walkperro.password_resets (token_hash);

-- ============================================================================
-- 11. rate_limits (counter-based, Supabase-backed)
-- ============================================================================
create table if not exists walkperro.rate_limits (
  key text primary key,
  count int not null default 0,
  window_started_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '1 minute')
);
create index if not exists rate_limits_expires_idx on walkperro.rate_limits (expires_at);

-- Atomic increment function: returns new count.
-- If the existing row's window has expired (now() > expires_at), reset count = 1.
-- Otherwise, increment count by 1.
create or replace function walkperro.bump_rate_limit(
  p_key text,
  p_window_seconds int,
  p_max int
)
returns table (current_count int, limited boolean)
language plpgsql
as $$
declare
  v_count int;
  v_limited boolean := false;
begin
  insert into walkperro.rate_limits (key, count, window_started_at, expires_at)
  values (
    p_key,
    1,
    now(),
    now() + make_interval(secs => p_window_seconds)
  )
  on conflict (key) do update
    set count = case
                  when walkperro.rate_limits.expires_at < now() then 1
                  else walkperro.rate_limits.count + 1
                end,
        window_started_at = case
                              when walkperro.rate_limits.expires_at < now() then now()
                              else walkperro.rate_limits.window_started_at
                            end,
        expires_at = case
                       when walkperro.rate_limits.expires_at < now() then now() + make_interval(secs => p_window_seconds)
                       else walkperro.rate_limits.expires_at
                     end
  returning walkperro.rate_limits.count into v_count;

  v_limited := v_count > p_max;
  return query select v_count, v_limited;
end;
$$;

-- ============================================================================
-- RLS — enable on every new table; admin tables have NO public policy.
-- ============================================================================
alter table walkperro.subscribers enable row level security;
alter table walkperro.posts enable row level security;
alter table walkperro.drafts enable row level security;
alter table walkperro.now_strip enable row level security;
alter table walkperro.tools enable row level security;
alter table walkperro.tool_downloads enable row level security;
alter table walkperro.admin_users enable row level security;
alter table walkperro.admin_sessions enable row level security;
alter table walkperro.admin_audit_log enable row level security;
alter table walkperro.password_resets enable row level security;
alter table walkperro.rate_limits enable row level security;

-- Public read for published posts
drop policy if exists "public can read published posts" on walkperro.posts;
create policy "public can read published posts"
  on walkperro.posts for select
  using (status = 'published');

-- Public read for active NOW strip
drop policy if exists "public can read active now strip" on walkperro.now_strip;
create policy "public can read active now strip"
  on walkperro.now_strip for select
  using (is_active = true);

-- Public read for tools that aren't DRAFT
drop policy if exists "public can read non-draft tools" on walkperro.tools;
create policy "public can read non-draft tools"
  on walkperro.tools for select
  using (status != 'DRAFT');

-- All other admin tables: no policies => default deny for non-service-role.
-- (Service role key bypasses RLS entirely.)
