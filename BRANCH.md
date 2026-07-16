# saas-full-build — parked full-SaaS branch

> This branch preserves the complete self-serve SaaS build. Main pivoted to a
> CONCIERGE MVP (manual fulfillment for the first 10–20 creators) until the
> concierge milestone validates that creators say yes and buyers pay. Resume
> here after that gate.

## Why parked (audit verdict, 2026-07)

A 5-dimension adversarial audit said: the product engine is real, but
(1) acquisition/distribution is the #1 unsolved problem, (2) the "gap nobody
owns" is likely false (Stan/Beacons ship AI product-gen from content — verify),
and (3) a 3–5 month full-SaaS build is premature before proving sales.
Full plan + audit findings: `~/.claude/plans/what-if-i-totally-flickering-dijkstra.md`.

## What's on this branch (working, verified)

- **Migration `supabase/migrations/0003_creator_platform.sql`** — 15 tables:
  creators (Supabase Auth), connected_accounts, pipeline_runs, source_videos,
  voice_profiles, product_opportunities, products, product_assets, storefronts,
  orders, ledger_entries, payouts, subscriptions, plan_limits, webhook_events.
  Owner-scoped RLS. NOT applied to any DB.
- **Platform adapters** `src/lib/platforms/` — TikTok/YouTube/Instagram behind
  one `PlatformAdapter` interface; `MOCK_APIFY=1` runs on `fixtures/apify/`.
  Unit test: `npx tsx scripts/test-adapters.ts` (green, 14 fixture videos).
- **Inngest pipeline** `src/lib/inngest/` + `app/api/inngest/route.ts` —
  client, typed event map, analyze-profile step skeleton writing
  pipeline_runs progress.
- **AI modules** `src/lib/ai/` — Anthropic SDK client (Haiku 4.5 extraction /
  Sonnet 5 synthesis / Opus 4.8 flagship), extract-video + voice-profile with
  zod schemas, quality-gate stub.
- **Supabase Auth** — `src/lib/supabase/{server,browser}.ts` (@supabase/ssr),
  `src/lib/creator/session.ts` (getCreatorSession/requireCreator/ensureCreator),
  `app/(auth)/login` (email OTP + Google), `app/auth/callback`, `app/auth/signout`,
  middleware `/app` session gate.
- **The magical flow** — `src/components/app/OnboardFlow.tsx` (input →
  analyzing wow-screen → demand-ranked opportunity picker; demo + prod modes),
  `app/demo` (public, fixture-backed), `app/app/new` (authed, real pipeline),
  `app/app` dashboard, `app/api/pipeline/{start,[runId]}`, `app/api/demo/analyze`,
  `src/lib/pipeline/demo.ts` (heuristic clustering).

## Parked product decisions (resume material)

- **Unlock ladder / gamification**: free tier ranks up on SALES (never activity)
  — sell $X → unlock 2nd product / AI covers / more platforms / remove
  watermark. Subscriptions reframed as the shortcut: $29 = everything now + 0%
  cut vs free grind at 10% (battle-pass model; >$290/mo sellers self-upgrade).
  Unlocks derive from lifetime `ledger_entries` sums — no new machinery.
- **Multi-format render layer**: interactive hosted product + PDF bonus +
  tool/quiz from one `product_assets.content` model; format bake-off with real
  buyers decides the winner.
- **Payments (full model)**: global Stripe Connect, deferred Express onboarding
  + held-balance ledger on free tier (platform-MoR for that slice only),
  destination charges 0% on paid. Creator = seller of record.
- **Pricing**: free (10% rev share) / $29 creator / $79 studio; plan_limits
  seeded in 0003.
- **Cost model**: ~$0.70–1.10/creator free tier (Sonnet + template covers),
  ~$1.50–2.50 paid (Opus + GPT Image 2 covers). Images are paid-only to
  protect the free tier. OpenAI for images + gpt-4o-mini-transcribe; Claude
  for all product text.

## Resume checklist

1. Concierge milestone passed? (creators said yes, buyers paid, format winner known)
2. Rebase/merge over main's concierge changes — note: main has its own lean
   `0003_concierge_mvp.sql` (intake_submissions + orders); renumber this
   branch's 0003_creator_platform → 0004+ and reconcile the orders table.
3. Re-read the audit's must-fix list before building the funnel (legal entity,
   ToS/privacy, claims controls, acquisition channel).
