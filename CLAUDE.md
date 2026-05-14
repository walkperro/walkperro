# walkperro / CLAUDE.md

Project-level guidance for any Claude session working in this repo.

## Voice & Content

**Before writing any user-facing content — posts, captions, slides, newsletter emails, ad copy, tool descriptions, DMs, or any text that represents walkperro publicly — read `/voice.md` first.** It is the source of truth for the walkperro voice. Quote it, don't paraphrase it.

Quick reference:

- Lowercase by default. Title Case only for proper nouns + CMS titles.
- Open with the punch — never with setup.
- One opinion per piece, defended.
- Specific over clever. Real numbers, real tools, real moments.
- Profanity: `shxt`, `fxxk`, `b****` for big words (censored); `damn`, `hell` uncensored.
- Emojis: zero on website/slides/newsletter. Light use OK in personal contexts — only from approved palette (🤑😎😈🏆) plus 💅 for the "no bad weeks" signature.
- Banned phrases: `game-changer`, `unlock`, `10x`, `leverage`, `synergy`, `ecosystem`, `in today's fast-paced world`, `revolutionary`, `disruptive`, `dive into`, `circle back`, `thought leader`.
- The audience is "The Doers." Not engineers, not executives — entrepreneurs, creators, builders, hustlers without credentials.
- The brand signature: `for the ones who do.`

If unsure: write shorter. Write sharper. Remove a sentence. Then ship.

For the quick cheat sheet: `/docs/voice-quickref.md`.

## Brand visuals

See `/brand.md` for color tokens (bone, charcoal, signal yellow), type scale (Instrument Serif + JetBrains Mono), and the "signal yellow used exactly once per viewport" rule.

## Code structure

- Next.js 16 App Router, TypeScript, Tailwind
- Public site: `/`, `/log`, `/log/[slug]`, `/tools/[slug]`
- Admin: `/admin/*` (password + TOTP 2FA, gated via middleware)
- API: `/api/*` (subscribe, contact, admin/*, tools/*, stripe webhook, telegram webhook)
- Data: Supabase `walkperro` schema — `src/lib/supabase/admin.ts` for the service-role client
- Email: Resend, branded templates in `src/lib/email/`
- Markdown posts: source of truth is `content/log/*.md`; mirrored to `walkperro.posts` via `scripts/migrate-posts-to-db.mjs` (preserves status / published_at on existing rows)

## SEO

- Dynamic sitemap at `/sitemap.xml` (app/sitemap.ts)
- Dynamic robots at `/robots.txt` (app/robots.ts)
- RSS feed at `/log/rss.xml`
- JSON-LD: site-wide Organization + WebSite in `app/layout.tsx`, BlogPosting per `/log/[slug]`
- Google Indexing API + Site Verification flow in `scripts/gsc-verify.mjs` + `scripts/index-walkperro.mjs`

## Conventions

- Tailwind class lists OK on JSX; avoid extracted className strings unless reused 3+ times.
- Server components by default. Client only where state / event handlers require it.
- All admin writes go through `withAdmin()` (`src/lib/auth/require-admin-api.ts`): session check + CSRF + per-admin rate limit + audit log.
- Never commit `.env*` files. Secrets piped to Vercel via `vercel env add` with stdin, never echoed.
