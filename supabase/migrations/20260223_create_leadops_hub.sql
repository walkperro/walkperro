create extension if not exists pgcrypto with schema extensions;

create schema if not exists leadops;

create table if not exists leadops.sources (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source_project text not null,
  source_channel text not null,
  source_key text not null unique,
  display_name text not null,
  scoring_profile text not null default 'generic-v1',
  source_kind text not null default 'website-form',
  active boolean not null default true,
  last_seen_at timestamptz,
  health_status text not null default 'unknown',
  health_notes text,
  constraint leadops_sources_health_status_check check (health_status in ('healthy','warning','stale','unknown'))
);

create table if not exists leadops.categories (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null,
  slug text not null unique,
  label text not null,
  color text,
  description text,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists leadops.leads (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  source_id uuid references leadops.sources(id) on delete set null,
  source_project text not null,
  source_channel text not null,
  source_name text,
  source_lead_id text,
  source_event_key text,
  ingest_key text,
  idempotency_key text,

  contact_name text,
  contact_email text,
  contact_phone text,
  company text,
  website_url text,
  location text,
  message text,

  lead_type text,
  industry text,
  subindustry text,
  tags text[] not null default '{}',

  normalized_payload jsonb not null default '{}'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,

  score int not null default 0,
  score_version text not null default 'generic-v1',
  score_breakdown jsonb not null default '{}'::jsonb,
  priority text not null default 'low',

  status text not null default 'new',
  stage text not null default 'new',
  owner text,
  assignee text,
  follow_up_at timestamptz,
  first_contacted_at timestamptz,
  last_contacted_at timestamptz,

  classification_reviewed_at timestamptz,
  classification_review text,
  classification_reviewer text,
  classification_review_notes text,

  spam_score int not null default 0,
  spam_confidence text not null default 'low',
  spam_reasons text[] not null default '{}',

  merged_into_lead_id uuid references leadops.leads(id) on delete set null,
  duplicate_group_key text,
  dedupe_hints text[] not null default '{}',

  enrichment_status text not null default 'not-started',
  enrichment_notes text,
  timezone text,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,

  internal_notes text,

  constraint leadops_leads_priority_check check (priority in ('low','medium','high')),
  constraint leadops_leads_status_check check (status in ('new','contacted','won','lost','archived')),
  constraint leadops_leads_stage_check check (stage in ('new','reviewed','contacted','qualified','proposal','won','lost','nurture','merged')),
  constraint leadops_leads_spam_confidence_check check (spam_confidence in ('low','medium','high')),
  constraint leadops_leads_enrichment_status_check check (enrichment_status in ('not-started','queued','in-progress','done','skipped')),
  constraint leadops_leads_score_range check (score between 0 and 100)
);

create unique index if not exists leadops_leads_idempotency_key_uidx on leadops.leads (idempotency_key) where idempotency_key is not null;
create index if not exists leadops_leads_created_at_idx on leadops.leads (created_at desc);
create index if not exists leadops_leads_updated_at_idx on leadops.leads (updated_at desc);
create index if not exists leadops_leads_source_project_idx on leadops.leads (source_project);
create index if not exists leadops_leads_source_channel_idx on leadops.leads (source_channel);
create index if not exists leadops_leads_priority_idx on leadops.leads (priority);
create index if not exists leadops_leads_score_idx on leadops.leads (score desc);
create index if not exists leadops_leads_status_stage_idx on leadops.leads (status, stage);
create index if not exists leadops_leads_reviewed_idx on leadops.leads (classification_reviewed_at desc);
create index if not exists leadops_leads_follow_up_idx on leadops.leads (follow_up_at);
create index if not exists leadops_leads_owner_idx on leadops.leads (owner);
create index if not exists leadops_leads_assignee_idx on leadops.leads (assignee);
create index if not exists leadops_leads_industry_idx on leadops.leads (industry);
create index if not exists leadops_leads_lead_type_idx on leadops.leads (lead_type);
create index if not exists leadops_leads_contact_email_idx on leadops.leads (lower(contact_email));
create index if not exists leadops_leads_company_idx on leadops.leads (company);
create index if not exists leadops_leads_merged_idx on leadops.leads (merged_into_lead_id);
create index if not exists leadops_leads_duplicate_group_idx on leadops.leads (duplicate_group_key);
create index if not exists leadops_leads_tags_gin_idx on leadops.leads using gin (tags);

create table if not exists leadops.lead_category_links (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references leadops.leads(id) on delete cascade,
  category_id uuid not null references leadops.categories(id) on delete cascade,
  assigned_by text,
  unique (lead_id, category_id)
);
create index if not exists leadops_lcl_lead_idx on leadops.lead_category_links (lead_id);
create index if not exists leadops_lcl_category_idx on leadops.lead_category_links (category_id);

create table if not exists leadops.lead_activities (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references leadops.leads(id) on delete cascade,
  actor text,
  action text not null,
  detail jsonb not null default '{}'::jsonb
);
create index if not exists leadops_activities_lead_idx on leadops.lead_activities (lead_id, created_at desc);
create index if not exists leadops_activities_action_idx on leadops.lead_activities (action, created_at desc);

create table if not exists leadops.saved_views (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  owner text,
  filters jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  pinned boolean not null default false,
  active boolean not null default true
);

create table if not exists leadops.exports (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor text,
  export_kind text not null default 'csv',
  filters jsonb not null default '{}'::jsonb,
  row_count int not null default 0,
  file_name text
);

alter table leadops.sources enable row level security;
alter table leadops.categories enable row level security;
alter table leadops.leads enable row level security;
alter table leadops.lead_category_links enable row level security;
alter table leadops.lead_activities enable row level security;
alter table leadops.saved_views enable row level security;
alter table leadops.exports enable row level security;

revoke all on schema leadops from public;
revoke all on all tables in schema leadops from public;

grant usage on schema leadops to service_role;
grant select, insert, update, delete on all tables in schema leadops to service_role;

insert into leadops.categories (kind, slug, label, sort_order)
values
  ('industry', 'restaurant', 'Restaurant', 10),
  ('industry', 'medspa', 'MedSpa', 20),
  ('industry', 'tech', 'Tech', 30),
  ('industry', 'home-services', 'Home Services', 40),
  ('lead_type', 'website-build', 'Website Build', 10),
  ('lead_type', 'seo', 'SEO', 20),
  ('lead_type', 'ads', 'Ads', 30),
  ('lead_type', 'dashboard-portal', 'Dashboard / Portal', 40),
  ('source_channel', 'website-form', 'Website Form', 10),
  ('source_channel', 'referral', 'Referral', 20),
  ('source_channel', 'instagram', 'Instagram', 30)
on conflict (slug) do nothing;
