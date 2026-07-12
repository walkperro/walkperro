-- CANONICAL PostgREST exposed-schemas list for the shared Supabase project
-- (kflzqkuioiiyfrvlvcvl). This GUC is ONE string on the authenticator role —
-- any "add" that doesn't restate the full list silently drops schemas and
-- takes production apps down (it has happened; see walkperro CLAUDE.md).
--
-- To add a schema: edit THIS file, run it via the Supabase SQL editor or MCP,
-- never hand-edit the role. Keep alphabetical-ish grouping: core, apps, demos.

ALTER ROLE authenticator SET pgrst.db_schemas TO
  'public, graphql_public, sunbiz, walkperro, re_study, fozzies, athome_family_services_llc, leadops, closehound, draftdispute, gaph, bayoubids, countime, tinta, cuban_study, lrhc, bondandfifth, insurex, taw, demo_fozzies, demo_gaph, demo_closehound';

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
