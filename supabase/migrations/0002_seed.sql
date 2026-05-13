-- WalkPerro — Seed Data (idempotent)
-- Seeds the active NOW strip row and the four homepage tools.

-- ============================================================================
-- NOW strip — seed if empty
-- ============================================================================
insert into walkperro.now_strip (building, reading, listening, is_active)
select 'closehound rebuild — wk 2', 'The Anthology of Balaji, vol. I', 'Four Tet — Three', true
where not exists (select 1 from walkperro.now_strip);

-- ============================================================================
-- Tools — seed if empty
-- ============================================================================
insert into walkperro.tools (slug, title, description, status, sort_order, requires_email, price_cents)
select * from (values
  ('stack-snippets',       'Stack snippets',       'Copy-paste blocks for Next, Supabase, Stripe wiring.', 'DRAFT',  1, true, 0),
  ('prompt-deck',          'Prompt deck',          'Operator prompts for Claude + Cursor — versioned.',    'DRAFT',  2, true, 0),
  ('brand-kit',            'Brand kit',            'Bone / charcoal / signal — the system on this site.',  'PUBLIC', 3, true, 0),
  ('field-notes-archive',  'Field notes archive',  'Long-form posts, cross-linked, no SEO bait.',          'LIVE',   4, false, 0),
  ('painmine',             'Painmine',             'Reddit pain-mining bot — finds business opportunities from real user complaints.', 'LIVE', 5, true, 0)
) as v(slug, title, description, status, sort_order, requires_email, price_cents)
where not exists (select 1 from walkperro.tools);
