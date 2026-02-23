# Revenue Leak Report - WalkPerro.com

## 1) Executive Summary (top 5 leaks)

1. **P2 - Global CSS duplication / override bloat**
2. **P3 - /pricing route missing**

## 2) Metrics snapshot (Lighthouse-like)

### Runtime / stack
- **Framework (detected)**: Next.js 16.1.4
- **Build script**: `next build`
- **Start script**: `next start`
- **Audit base URL**: `http://localhost:4100`

### Route health
- `/` -> `200`
- `/services` -> `200`
- `/pricing` -> `404`
- `/contact` -> `200`
- `/faq` -> `200`
- `/policy` -> `200`
- `/robots.txt` -> `200`
- `/sitemap.xml` -> `200`
- `/manifest.webmanifest` -> `200`

### SEO coverage
- `/`: title=yes, desc=yes, canonical=yes, og=9, twitter=4, h1=1, noindex=0, json-ld=1
- `/services`: title=yes, desc=yes, canonical=yes, og=9, twitter=4, h1=1, noindex=0, json-ld=0
- `/contact`: title=yes, desc=yes, canonical=yes, og=9, twitter=4, h1=1, noindex=0, json-ld=0
- `/faq`: title=yes, desc=yes, canonical=yes, og=9, twitter=4, h1=1, noindex=0, json-ld=0
- `/policy`: title=yes, desc=yes, canonical=yes, og=9, twitter=4, h1=1, noindex=0, json-ld=0

### Performance / CWV proxy signals
- **Lighthouse**: Lightweight mode (not run). Use PageSpeed/Lighthouse separately for browser-scored performance if Chrome is available.
- **Source global CSS**: `src/app/globals.css` = **20,727 bytes**
- Built global CSS (largest in `.next/static/css`): `.next/static/css/4394edff48c906bc.css` = **14,262 bytes**
- **Top app route chunks**:
  - `.next/static/chunks/app/page-614a0ec952645ff1.js` = 13,911 bytes
  - `.next/static/chunks/app/layout-d540ba8fa3f2ad7b.js` = 11,694 bytes
  - `.next/static/chunks/app/services/page-e6995895907ce017.js` = 6,359 bytes
  - `.next/static/chunks/app/_not-found/page-fd38b7dd40e53d41.js` = 2,667 bytes
  - `.next/static/chunks/app/_global-error/page-95590a15fbb4aaea.js` = 183 bytes
- **CWV risk proxies**:
  - INP risk: interactive client forms/handlers present
  - LCP risk: global CSS + framework JS baseline present
  - CLS risk: low-moderate based on single H1 and stable icon/image dimensions

## 3) Leak list (Impact / Effort / Evidence / Fix)

### P2 - Global CSS duplication / override bloat
- **Impact ($$$)**: Low-medium performance and maintainability leakage
- **Effort**: M
- **Evidence**: src/app/globals.css=20,727 bytes, .navItem selectors=3
- **Fix**: Consolidate duplicate selectors and remove stale overrides to reduce CSS parsing/rendering overhead.
- **Exact file paths**:
  - `src/app/globals.css`

### P3 - /pricing route missing
- **Impact ($$$)**: Low-medium depending on acquisition intent
- **Effort**: S
- **Evidence**: GET /pricing -> 404
- **Fix**: Create a pricing page or add a redirect from `/pricing` to `/services`.
- **Exact file paths**:
  - `next.config.ts`

## 4) Fix Plan (48 hours / 7 days / 30 days)

### 48 hours
- Resolve all P0 items from the leak list.
- Fix any 404s on high-intent pages (`/contact`, `/pricing`).
- Ensure homepage + services inquiry flows submit successfully with validation (without collecting HIPAA/PHI).

### 7 days
- Add/verify privacy-conscious analytics (GA4 only if needed, no invasive tracking).
- Add stronger proof blocks (testimonials/logos/results) and improve CTA clarity above the fold.
- Run a production Lighthouse/PageSpeed audit and address LCP/INP bottlenecks.

### 30 days
- Consolidate CSS overrides and remove duplicate rules in `src/app/globals.css`.
- Add route-level social previews and richer structured data where valid.
- Track inquiry funnel conversion events end-to-end.

## 5) Patch diff summary

- This script audits and writes the report only; it does not apply code changes.
- If you want automated fixes, run the audit manually and patch targeted P0/P1 leaks in code.

## Audit limitations

- The script performs **lightweight checks** (HTTP, HTML/meta parsing, route health, proxy performance metrics).
- Lighthouse/browser-based scoring is not run by default to keep the tool lightweight and environment-safe.
