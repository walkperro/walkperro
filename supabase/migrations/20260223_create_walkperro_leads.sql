-- WalkPerro lead capture table (schema-isolated)
-- Inserts are intended to happen server-side using the Supabase service role key only.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists walkperro;

create table if not exists walkperro.leads (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  phone text,
  company text,
  website_url text,
  location text,
  message text not null,

  intent text not null,
  timeline text not null,
  scope text not null,
  growth_flags text[] not null default '{}',

  project_budget_range text not null,
  monthly_marketing_spend_range text not null,
  open_to_ads_if_roi_clear boolean not null default false,
  monthly_revenue_range text,

  decision_maker boolean not null default false,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,

  score int not null default 0,
  priority text not null default 'low',
  tags text[] not null default '{}',

  status text not null default 'new', -- new/contacted/won/lost
  notes text,

  constraint walkperro_leads_score_range check (score between 0 and 100),
  constraint walkperro_leads_priority_check check (priority in ('low', 'medium', 'high')),
  constraint walkperro_leads_status_check check (status in ('new', 'contacted', 'won', 'lost'))
);

create index if not exists leads_created_at_idx on walkperro.leads (created_at desc);
create index if not exists leads_score_idx on walkperro.leads (score desc);
create index if not exists leads_priority_idx on walkperro.leads (priority);
create index if not exists leads_status_idx on walkperro.leads (status);

alter table walkperro.leads enable row level security;

-- No anon/auth policies are created because writes are performed server-side with the service role key.
revoke all on schema walkperro from public;
revoke all on table walkperro.leads from public;

grant usage on schema walkperro to service_role;
grant select, insert, update on walkperro.leads to service_role;
