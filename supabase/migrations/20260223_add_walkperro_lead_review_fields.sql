alter table if exists walkperro.leads
  add column if not exists classification_reviewed_at timestamptz,
  add column if not exists classification_review text,
  add column if not exists classification_reviewer text,
  add column if not exists classification_review_notes text;

create index if not exists leads_classification_reviewed_at_idx
  on walkperro.leads (classification_reviewed_at desc);
