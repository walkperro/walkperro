import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const baseUrl = (process.env.AUDIT_URL || "http://localhost:3000").replace(/\/+$/, "");
const reportDir = path.join(cwd, "reports");
const rawDir = path.join(reportDir, "raw");
const reportPath = path.join(reportDir, "revenue-leak-report.md");

const pageTargets = ["/", "/services", "/pricing", "/contact", "/faq", "/policy"];
const seoPages = ["/", "/services", "/contact", "/faq", "/policy"];
const crawlAssets = ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest"];

const fileHints = {
  homepage: ["src/app/page.tsx", "src/app/globals.css"],
  services: ["src/app/services/page.tsx", "src/app/globals.css"],
  layout: ["src/app/layout.tsx"],
  nav: ["src/components/NavMenu.tsx"],
  policy: ["src/app/policy/page.tsx"],
  faq: ["src/app/faq/page.tsx"],
  contact: ["src/app/contact/page.tsx"],
  indexing: ["src/app/robots.ts", "src/app/sitemap.ts", "src/app/manifest.ts"],
  metadata: [
    "src/app/layout.tsx",
    "src/app/services/layout.tsx",
    "src/app/faq/layout.tsx",
    "src/app/policy/layout.tsx",
    "src/app/contact/page.tsx",
  ],
};

function bytes(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function exists(p) {
  return fs.existsSync(path.join(cwd, p));
}

function sizeOf(p) {
  try {
    return fs.statSync(path.join(cwd, p)).size;
  } catch {
    return null;
  }
}

function readText(p) {
  try {
    return fs.readFileSync(path.join(cwd, p), "utf8");
  } catch {
    return "";
  }
}

async function ensureDirs() {
  await fsp.mkdir(rawDir, { recursive: true });
}

async function fetchPage(pathname) {
  const url = `${baseUrl}${pathname}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    return { ok: true, status: res.status, text, url };
  } catch (error) {
    return { ok: false, status: 0, text: "", url, error: String(error) };
  }
}

function pageFileName(pathname) {
  if (pathname === "/") return "home.html";
  return `${pathname.replace(/^\//, "").replace(/\//g, "_")}.html`;
}

function matchOne(text, re) {
  return text.match(re)?.[1]?.trim() ?? null;
}

function countMatches(text, re) {
  return (text.match(re) || []).length;
}

function summarizeHtml(html) {
  return {
    title: matchOne(html, /<title>([^<]+)<\/title>/i),
    description: matchOne(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
    canonical: matchOne(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i),
    ogCount: countMatches(html, /property="og:[^"]+"/gi),
    twitterCount: countMatches(html, /name="twitter:[^"]+"/gi),
    noindexCount: countMatches(html, /noindex/gi),
    h1Count: countMatches(html, /<h1\b/gi),
    jsonLdCount: countMatches(html, /application\/ld\+json/gi),
    analyticsCount: countMatches(html, /(googletagmanager|gtag\(|G-[A-Z0-9]+|fbq\(|meta pixel)/gi),
    footerTrustLinks:
      countMatches(html, /href="\/policy"/gi) > 0 &&
      countMatches(html, /href="\/faq"/gi) > 0 &&
      countMatches(html, /href="\/contact"/gi) > 0,
  };
}

function scanSourceFiles() {
  const files = [
    "src/app/page.tsx",
    "src/app/services/page.tsx",
    "src/app/layout.tsx",
    "src/components/NavMenu.tsx",
    "src/app/policy/page.tsx",
    "src/app/faq/page.tsx",
    "src/app/globals.css",
  ];

  const content = Object.fromEntries(files.map((f) => [f, readText(f)]));
  const home = content["src/app/page.tsx"] || "";
  const services = content["src/app/services/page.tsx"] || "";
  const css = content["src/app/globals.css"] || "";

  return {
    content,
    homeHasInquiryAnchor: /id="inquiry"/.test(home),
    homeHasValidation: /Enter a valid email address/.test(home) || /required/.test(home),
    homeHasMailtoFlow: /mailto:hello@walkperro\.com/.test(home),
    homeHasProofSlots: /tourProof/.test(home),
    servicesHasValidation: /Enter a valid email address/.test(services) || /required/.test(services),
    servicesHasMailtoFlow: /mailto:hello@walkperro\.com/.test(services),
    servicesHasDuplicateNav: /<NavMenu/.test(services),
    policyIsPlaceholder: /Add your terms, privacy, and service policy here/i.test(
      content["src/app/policy/page.tsx"] || "",
    ),
    faqIsPlaceholder: /Add the common questions here/i.test(content["src/app/faq/page.tsx"] || ""),
    analyticsTagsInSource: /(googletagmanager|gtag\(|G-[A-Z0-9]+|fbq\()/i.test(
      Object.values(content).join("\n"),
    ),
    globalsCssBytes: Buffer.byteLength(css, "utf8"),
    duplicateNavItemSelectors: countMatches(css, /\.navItem\s*\{/g),
  };
}

function listBuiltAssets() {
  const cssDir = path.join(cwd, ".next/static/css");
  const appChunksDir = path.join(cwd, ".next/static/chunks/app");
  const out = {
    builtCss: [],
    appChunks: [],
  };

  try {
    for (const name of fs.readdirSync(cssDir)) {
      const full = path.join(cssDir, name);
      const st = fs.statSync(full);
      if (st.isFile() && name.endsWith(".css")) {
        out.builtCss.push({ file: `.next/static/css/${name}`, size: st.size });
      }
    }
  } catch {}

  const walk = (dir, relBase = ".next/static/chunks/app") => {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full, path.posix.join(relBase, e.name));
      } else if (e.isFile() && e.name.endsWith(".js")) {
        const st = fs.statSync(full);
        out.appChunks.push({ file: path.posix.join(relBase, e.name), size: st.size });
      }
    }
  };

  walk(appChunksDir);
  out.builtCss.sort((a, b) => b.size - a.size);
  out.appChunks.sort((a, b) => b.size - a.size);
  return out;
}

function severityRank(s) {
  return { P0: 0, P1: 1, P2: 2, P3: 3 }[s] ?? 9;
}

function makeFinding({
  severity,
  impact,
  effort,
  title,
  evidence,
  fix,
  files,
}) {
  return { severity, impact, effort, title, evidence, fix, files };
}

function buildReport({
  stack,
  packageJson,
  routeResults,
  assetResults,
  pageSummaries,
  sourceScan,
  builtAssets,
  findings,
  lighthouseNote,
}) {
  const routeLines = [...pageTargets, ...crawlAssets]
    .map((p) => `- \`${p}\` -> \`${routeResults[p]?.status ?? "ERR"}\``)
    .join("\n");

  const seoCoverage = seoPages
    .filter((p) => routeResults[p]?.status === 200 && pageSummaries[p])
    .map((p) => {
      const s = pageSummaries[p];
      return `- \`${p}\`: title=${s.title ? "yes" : "no"}, desc=${s.description ? "yes" : "no"}, canonical=${s.canonical ? "yes" : "no"}, og=${s.ogCount}, twitter=${s.twitterCount}, h1=${s.h1Count}, noindex=${s.noindexCount}, json-ld=${s.jsonLdCount}`;
    })
    .join("\n");

  const builtCssLine =
    builtAssets.builtCss[0] != null
      ? `- Built global CSS (largest in \`.next/static/css\`): \`${builtAssets.builtCss[0].file}\` = **${bytes(
          builtAssets.builtCss[0].size,
        )} bytes**`
      : "- Built CSS metrics unavailable (run a production build first)";

  const appChunkLines =
    builtAssets.appChunks.length > 0
      ? builtAssets.appChunks.slice(0, 5).map((c) => `  - \`${c.file}\` = ${bytes(c.size)} bytes`).join("\n")
      : "  - App chunk metrics unavailable (run a production build first)";

  const top5 = findings
    .slice()
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
    .slice(0, 5);

  const top5Lines = top5.map((f, i) => `${i + 1}. **${f.severity} - ${f.title}**`).join("\n");

  const leakList = findings
    .slice()
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
    .map((f) => {
      const files = f.files.length ? f.files.map((x) => `  - \`${x}\``).join("\n") : "  - (none)";
      return [
        `### ${f.severity} - ${f.title}`,
        `- **Impact ($$$)**: ${f.impact}`,
        `- **Effort**: ${f.effort}`,
        `- **Evidence**: ${f.evidence}`,
        `- **Fix**: ${f.fix}`,
        `- **Exact file paths**:`,
        files,
      ].join("\n");
    })
    .join("\n\n");

  const patchSummary = [
    "- This script audits and writes the report only; it does not apply code changes.",
    "- If you want automated fixes, run the audit manually and patch targeted P0/P1 leaks in code.",
  ].join("\n");

  return `# Revenue Leak Report - WalkPerro.com

## 1) Executive Summary (top 5 leaks)

${top5Lines || "No major leaks detected by the scripted checks."}

## 2) Metrics snapshot (Lighthouse-like)

### Runtime / stack
- **Framework (detected)**: ${stack}
- **Build script**: \`${packageJson.scripts?.build ?? "missing"}\`
- **Start script**: \`${packageJson.scripts?.start ?? "missing"}\`
- **Audit base URL**: \`${baseUrl}\`

### Route health
${routeLines}

### SEO coverage
${seoCoverage || "- No page HTML fetched (is the app running?)"}

### Performance / CWV proxy signals
- **Lighthouse**: ${lighthouseNote}
- **Source global CSS**: \`src/app/globals.css\` = **${bytes(sourceScan.globalsCssBytes)} bytes**
${builtCssLine}
- **Top app route chunks**:
${appChunkLines}
- **CWV risk proxies**:
  - INP risk: ${sourceScan.homeHasMailtoFlow || sourceScan.servicesHasMailtoFlow ? "interactive client forms/handlers present" : "low signals detected"}
  - LCP risk: ${builtAssets.builtCss.length ? "global CSS + framework JS baseline present" : "build artifacts unavailable, run build for stronger proxy metrics"}
  - CLS risk: ${Object.values(pageSummaries).some((s) => s.h1Count > 1) ? "elevated (multiple H1 on some pages)" : "low-moderate based on single H1 and stable icon/image dimensions"}

## 3) Leak list (Impact / Effort / Evidence / Fix)

${leakList || "No leaks detected by scripted rules."}

## 4) Fix Plan (48 hours / 7 days / 30 days)

### 48 hours
- Resolve all P0 items from the leak list.
- Fix any 404s on high-intent pages (\`/contact\`, \`/pricing\`).
- Ensure homepage + services inquiry flows submit successfully with validation (without collecting HIPAA/PHI).

### 7 days
- Add/verify privacy-conscious analytics (GA4 only if needed, no invasive tracking).
- Add stronger proof blocks (testimonials/logos/results) and improve CTA clarity above the fold.
- Run a production Lighthouse/PageSpeed audit and address LCP/INP bottlenecks.

### 30 days
- Consolidate CSS overrides and remove duplicate rules in \`src/app/globals.css\`.
- Add route-level social previews and richer structured data where valid.
- Track inquiry funnel conversion events end-to-end.

## 5) Patch diff summary

${patchSummary}

## Audit limitations

- The script performs **lightweight checks** (HTTP, HTML/meta parsing, route health, proxy performance metrics).
- Lighthouse/browser-based scoring is not run by default to keep the tool lightweight and environment-safe.
`;
}

async function main() {
  await ensureDirs();

  const packageJsonPath = path.join(cwd, "package.json");
  const packageJson = JSON.parse(await fsp.readFile(packageJsonPath, "utf8"));
  const stack = packageJson.dependencies?.next ? `Next.js ${packageJson.dependencies.next}` : "Unknown";

  const routeResults = {};
  const pageSummaries = {};
  const rawErrors = [];

  for (const pathname of pageTargets) {
    const res = await fetchPage(pathname);
    routeResults[pathname] = { status: res.status, ok: res.ok, error: res.error ?? null };
    if (res.ok) {
      const fileName = pageFileName(pathname);
      await fsp.writeFile(path.join(rawDir, fileName), res.text, "utf8");
      if (seoPages.includes(pathname)) {
        pageSummaries[pathname] = summarizeHtml(res.text);
      }
    } else {
      rawErrors.push(`${pathname}: ${res.error}`);
    }
  }

  const assetResults = {};
  for (const pathname of crawlAssets) {
    const res = await fetchPage(pathname);
    assetResults[pathname] = { status: res.status, ok: res.ok, error: res.error ?? null };
    routeResults[pathname] = { status: res.status, ok: res.ok, error: res.error ?? null };
    if (res.ok) {
      const fileName = pageFileName(pathname);
      await fsp.writeFile(path.join(rawDir, fileName), res.text, "utf8");
    }
  }

  const sourceScan = scanSourceFiles();
  const builtAssets = listBuiltAssets();
  const findings = [];

  if (!routeResults["/robots.txt"]?.status || routeResults["/robots.txt"].status !== 200 ||
      routeResults["/sitemap.xml"]?.status !== 200 || routeResults["/manifest.webmanifest"]?.status !== 200) {
    findings.push(
      makeFinding({
        severity: "P0",
        impact: "High SEO + trust leakage from missing crawl/index assets",
        effort: "S",
        title: "Crawl/indexing assets missing or failing",
        evidence: `Route statuses - /robots.txt: ${routeResults["/robots.txt"]?.status ?? "ERR"}, /sitemap.xml: ${routeResults["/sitemap.xml"]?.status ?? "ERR"}, /manifest.webmanifest: ${routeResults["/manifest.webmanifest"]?.status ?? "ERR"}`,
        fix: "Add Next metadata routes for robots, sitemap, and manifest and verify 200 responses.",
        files: fileHints.indexing.filter((f) => exists(f)),
      }),
    );
  }

  const seoGaps = Object.entries(pageSummaries)
    .filter(([, s]) => !s.title || !s.description || !s.canonical || s.h1Count !== 1 || s.noindexCount > 0)
    .map(([p, s]) => `${p}: title=${!!s.title}, desc=${!!s.description}, canonical=${!!s.canonical}, h1=${s.h1Count}, noindex=${s.noindexCount}`);

  if (seoGaps.length > 0) {
    findings.push(
      makeFinding({
        severity: "P0",
        impact: "High SEO + CTR leakage",
        effort: "S",
        title: "Metadata / canonical / heading hygiene gaps",
        evidence: seoGaps.join(" | "),
        fix: "Add route-level metadata (title, description, canonical) and keep exactly one H1 per page.",
        files: fileHints.metadata.filter((f) => exists(f)),
      }),
    );
  }

  if ((pageSummaries["/"]?.jsonLdCount ?? 0) === 0) {
    findings.push(
      makeFinding({
        severity: "P1",
        impact: "Medium SEO trust leakage",
        effort: "S",
        title: "Homepage structured data missing",
        evidence: "No `application/ld+json` found on `/`",
        fix: "Add `Organization` and `WebSite` JSON-LD on the homepage or root layout.",
        files: fileHints.homepage.filter((f) => exists(f)),
      }),
    );
  }

  if (routeResults["/contact"]?.status === 404) {
    findings.push(
      makeFinding({
        severity: "P1",
        impact: "Medium conversion leakage on high-intent traffic",
        effort: "S",
        title: "/contact route returns 404",
        evidence: `GET /contact -> ${routeResults["/contact"]?.status}`,
        fix: "Add a lightweight contact page or redirect `/contact` to the primary inquiry flow.",
        files: [exists("src/app/contact/page.tsx") ? "src/app/contact/page.tsx" : "src/app/page.tsx"],
      }),
    );
  }

  if (routeResults["/pricing"]?.status === 404) {
    findings.push(
      makeFinding({
        severity: "P3",
        impact: "Low-medium depending on acquisition intent",
        effort: "S",
        title: "/pricing route missing",
        evidence: `GET /pricing -> ${routeResults["/pricing"]?.status}`,
        fix: "Create a pricing page or add a redirect from `/pricing` to `/services`.",
        files: ["next.config.ts"],
      }),
    );
  }

  if (!sourceScan.homeHasInquiryAnchor || !sourceScan.homeHasValidation || !sourceScan.homeHasMailtoFlow) {
    findings.push(
      makeFinding({
        severity: "P0",
        impact: "High homepage inquiry conversion leakage",
        effort: "M",
        title: "Homepage inquiry flow friction / non-functional submit",
        evidence: `anchor=${sourceScan.homeHasInquiryAnchor}, validation=${sourceScan.homeHasValidation}, submitFlow=${sourceScan.homeHasMailtoFlow}`,
        fix: "Add a clear `#inquiry` anchor, client-side validation, and a working submission path (email/API) without collecting HIPAA/PHI.",
        files: fileHints.homepage.filter((f) => exists(f)),
      }),
    );
  }

  if (!sourceScan.homeHasProofSlots) {
    findings.push(
      makeFinding({
        severity: "P1",
        impact: "Medium CRO leakage from weak trust/proof above the fold",
        effort: "S",
        title: "Homepage proof slots missing",
        evidence: "No obvious proof/testimonial/results block markers detected in homepage source",
        fix: "Add lightweight proof blocks (testimonials, logos, outcomes, guarantees) near the primary CTA.",
        files: fileHints.homepage.filter((f) => exists(f)),
      }),
    );
  }

  if (!sourceScan.servicesHasValidation || !sourceScan.servicesHasMailtoFlow) {
    findings.push(
      makeFinding({
        severity: "P0",
        impact: "High services-page conversion leakage",
        effort: "M",
        title: "Services inquiry form lacks validation or working submit flow",
        evidence: `validation=${sourceScan.servicesHasValidation}, submitFlow=${sourceScan.servicesHasMailtoFlow}`,
        fix: "Add client-side validation and a working submit path (email/API) for the services inquiry form.",
        files: fileHints.services.filter((f) => exists(f)),
      }),
    );
  }

  if (sourceScan.servicesHasDuplicateNav) {
    findings.push(
      makeFinding({
        severity: "P2",
        impact: "Low-medium UX trust/performance leakage",
        effort: "S",
        title: "Duplicate navigation render on services page",
        evidence: "Detected `<NavMenu` usage inside `src/app/services/page.tsx` while root layout also renders nav",
        fix: "Render the nav only once from the root layout.",
        files: ["src/app/services/page.tsx", "src/app/layout.tsx"].filter((f) => exists(f)),
      }),
    );
  }

  if (sourceScan.policyIsPlaceholder || sourceScan.faqIsPlaceholder) {
    findings.push(
      makeFinding({
        severity: "P1",
        impact: "Medium trust leakage",
        effort: "S",
        title: "Policy/FAQ pages are placeholders",
        evidence: `policyPlaceholder=${sourceScan.policyIsPlaceholder}, faqPlaceholder=${sourceScan.faqIsPlaceholder}`,
        fix: "Replace placeholders with real privacy/terms summary, contact info, and pre-sale FAQ content.",
        files: [fileHints.policy[0], fileHints.faq[0]].filter((f) => exists(f)),
      }),
    );
  }

  const homepageFooterTrust = pageSummaries["/"]?.footerTrustLinks ?? false;
  if (!homepageFooterTrust) {
    findings.push(
      makeFinding({
        severity: "P1",
        impact: "Medium trust leakage",
        effort: "S",
        title: "Footer trust links incomplete",
        evidence: "Homepage HTML does not contain `/policy`, `/faq`, and `/contact` links together",
        fix: "Add a footer with privacy/terms, FAQ, and contact links.",
        files: [...fileHints.layout, ...fileHints.nav].filter((f) => exists(f)),
      }),
    );
  }

  if (!sourceScan.analyticsTagsInSource && Object.values(pageSummaries).every((p) => p.analyticsCount === 0)) {
    findings.push(
      makeFinding({
        severity: "P2",
        impact: "Medium attribution leakage (measurement blind spots)",
        effort: "M",
        title: "Analytics tag not detected (GA4 / Meta)",
        evidence: "No GA4/GTM/Meta Pixel signatures found in source or fetched HTML",
        fix: "Add privacy-conscious GA4 (consent-aware) if measurement is needed. Avoid invasive tracking and any PHI capture.",
        files: fileHints.layout.filter((f) => exists(f)),
      }),
    );
  }

  if (sourceScan.globalsCssBytes > 18000 || sourceScan.duplicateNavItemSelectors > 1) {
    findings.push(
      makeFinding({
        severity: "P2",
        impact: "Low-medium performance and maintainability leakage",
        effort: "M",
        title: "Global CSS duplication / override bloat",
        evidence: `src/app/globals.css=${bytes(sourceScan.globalsCssBytes)} bytes, .navItem selectors=${sourceScan.duplicateNavItemSelectors}`,
        fix: "Consolidate duplicate selectors and remove stale overrides to reduce CSS parsing/rendering overhead.",
        files: ["src/app/globals.css"],
      }),
    );
  }

  if (findings.length === 0 && rawErrors.length > 0) {
    findings.push(
      makeFinding({
        severity: "P1",
        impact: "Medium audit reliability risk",
        effort: "S",
        title: "Audit could not fetch one or more routes",
        evidence: rawErrors.join(" | "),
        fix: "Start the app locally and rerun `npm run audit:revenue` with `AUDIT_URL` set to the correct port.",
        files: [],
      }),
    );
  }

  const report = buildReport({
    stack,
    packageJson,
    routeResults,
    assetResults,
    pageSummaries,
    sourceScan,
    builtAssets,
    findings,
    lighthouseNote:
      "Lightweight mode (not run). Use PageSpeed/Lighthouse separately for browser-scored performance if Chrome is available.",
  });

  await fsp.writeFile(reportPath, report, "utf8");

  console.log(`Revenue audit complete.`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Report: ${path.relative(cwd, reportPath)}`);
  if (rawErrors.length) {
    console.log(`Fetch warnings:`);
    for (const err of rawErrors) console.log(`- ${err}`);
  }
}

main().catch((err) => {
  console.error("Revenue audit failed:", err);
  process.exit(1);
});
