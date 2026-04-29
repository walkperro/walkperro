# WalkPerro

Studio site. Editorial type, bone-and-oxblood palette, AI-generated brand imagery, curated portfolio of selected work.

Stack: Next.js 16 (App Router) · React 19 + Compiler · TypeScript 5 · Tailwind v4 · pnpm · deployed on Vercel.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build & verify

```bash
pnpm typecheck    # tsc --noEmit
pnpm lint
pnpm build        # next build
pnpm start        # serve production locally
```

## Generate brand imagery (Nano Banana 2)

Requires `GOOGLE_API_KEY` in `.env.local`.

```bash
pnpm brand:generate                     # any missing assets
pnpm brand:generate --force             # regenerate all
pnpm brand:generate --only=logo-primary # one slug
```

Prompts and aspect ratios live in `scripts/brand-image-manifest.ts`. Outputs land in `public/brand/` and the favicon set in `public/`.

## Capture portfolio screenshots

```bash
pnpm portfolio:capture                  # any missing
pnpm portfolio:capture --force          # recapture
pnpm portfolio:capture --only=countime  # one slug
```

URL list lives in `scripts/portfolio-manifest.ts`. Outputs land in `public/portfolio/`. Per-entry LQIPs written to `src/data/portfolio-lqip.json`.

## Layout

```
src/
  app/             routes (page.tsx, layout.tsx, sitemap.ts, robots.ts)
  components/
    layout/        Nav, Footer
    marketing/     Hero, Offerings, PortfolioGrid, PortfolioCard, About, Contact
    primitives/    RevealOnScroll
  data/            copy, offerings, portfolio-manifest, portfolio-lqip.json
  styles/          tokens.css

scripts/
  brand-image-manifest.ts
  generate-brand-images.ts
  portfolio-manifest.ts
  portfolio-screenshot.ts
  qa-*.ts                # local visual QA helpers (cache only)
  .cache/                # gitignored — raw PNGs and QA outputs

public/
  brand/                 # AI-generated brand assets (committed)
  portfolio/             # site screenshots (committed)
  og.png  favicon.ico  icon-{192,512}.png  apple-touch-icon.png
```

## Conventions

- Bone-default surface, dark inverted footer. Oxblood appears in ≤ 3 places per page.
- Type stack: Instrument Serif (display) + Geist Sans (body) + Geist Mono (accent).
- All motion gated on `prefers-reduced-motion`.
- Server components by default — only `RevealOnScroll` is `"use client"`.
- No third-party scripts. No analytics in v1.
- Secrets stay in `.env.local` (gitignored). Never echo `GOOGLE_API_KEY` or any other key.
