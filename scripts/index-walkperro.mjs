// Submit walkperro.com URLs to Google Indexing API + push sitemap to Search Console.
// Uses GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON (same credentials as closehound's site-launch flow).
//
// Pre-reqs (one-time, in Google Search Console):
//   - walkperro.com verified as a property (✓ user confirmed already done)
//   - Service account email added as an OWNER of the walkperro.com property
//
// Usage:
//   node scripts/index-walkperro.mjs              # index everything in DB + sitemap
//   node scripts/index-walkperro.mjs <url> ...    # submit specific URL(s) only

import { SignJWT, importPKCS8 } from "jose";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// ── env loading ───────────────────────────────────────────────────────────
function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      if (!line || line.startsWith("#")) continue;
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = val;
    }
  } catch {}
}
loadEnvLocal();

const SITE_URL = process.env.APP_URL || "https://www.walkperro.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const GSC_PROPERTY = SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`;

// ── service account → OAuth token ─────────────────────────────────────────
function parseServiceAccount() {
  const raw = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    console.error("Missing GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON in .env.local.");
    console.error("Copy it from closehound/.env.local with:");
    console.error("  grep '^GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON=' \\");
    console.error("    /Users/ironclaw/projects/closehound/.env.local >> .env.local");
    process.exit(1);
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.client_email || !parsed.private_key) {
      console.error("Service account JSON missing client_email or private_key.");
      process.exit(1);
    }
    return parsed;
  } catch (e) {
    console.error("Service account JSON failed to parse:", e.message);
    process.exit(1);
  }
}

async function getAccessToken(scope) {
  const sa = parseServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope,
    aud: sa.token_uri ?? "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const privateKeyPem = sa.private_key.replace(/\\n/g, "\n");
  const privateKey = await importPKCS8(privateKeyPem, "RS256");
  const jwt = await new SignJWT(claim)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privateKey);
  const res = await fetch(sa.token_uri ?? "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange ${res.status}: ${text.slice(0, 240)}`);
  }
  const body = await res.json();
  return body.access_token;
}

// ── API calls ─────────────────────────────────────────────────────────────
async function submitUrl(token, url) {
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, body: text.slice(0, 240) };
  return { ok: true, body: text.slice(0, 240) };
}

async function submitSitemap(token) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_PROPERTY)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`,
    { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, status: res.status, body: text.slice(0, 240) };
  }
  return { ok: true };
}

// ── URL discovery from Supabase ──────────────────────────────────────────
async function discoverUrls() {
  const cliUrls = process.argv.slice(2).filter(Boolean);
  if (cliUrls.length > 0) return cliUrls;

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supaUrl || !supaKey) {
    console.warn("Supabase env missing — falling back to static URL list.");
    return [
      `${SITE_URL}/`,
      `${SITE_URL}/log`,
    ];
  }

  const supabase = createClient(supaUrl, supaKey, {
    auth: { persistSession: false },
    db: { schema: "walkperro" },
  });

  const urls = [`${SITE_URL}/`, `${SITE_URL}/log`];

  const { data: posts } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");
  for (const p of posts || []) urls.push(`${SITE_URL}/log/${p.slug}`);

  const { data: tools } = await supabase
    .from("tools")
    .select("slug")
    .neq("status", "DRAFT");
  for (const t of tools || []) urls.push(`${SITE_URL}/tools/${t.slug}`);

  return urls;
}

// ── main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("Resolving access tokens…");
  const [indexingToken, webmastersToken] = await Promise.all([
    getAccessToken("https://www.googleapis.com/auth/indexing"),
    getAccessToken("https://www.googleapis.com/auth/webmasters"),
  ]);
  console.log("  ✓ tokens acquired\n");

  const urls = await discoverUrls();
  console.log(`Submitting ${urls.length} URL(s) to Indexing API:`);
  let okCount = 0;
  let failCount = 0;
  for (const url of urls) {
    const r = await submitUrl(indexingToken, url);
    if (r.ok) {
      console.log(`  ✓ ${url}`);
      okCount++;
    } else {
      console.log(`  ✗ ${url}   (${r.status}: ${r.body})`);
      failCount++;
    }
    // Indexing API quota = 200/day per project; pace gently
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nSubmitting sitemap: ${SITEMAP_URL}`);
  const sitemapResult = await submitSitemap(webmastersToken);
  if (sitemapResult.ok) {
    console.log("  ✓ sitemap submitted to Search Console");
  } else {
    console.log(`  ✗ sitemap submission failed (${sitemapResult.status}: ${sitemapResult.body})`);
    if (sitemapResult.status === 403) {
      console.log("    → Add the service account email as an OWNER of");
      console.log(`       ${GSC_PROPERTY}`);
      console.log("       in Google Search Console (Settings → Users and permissions).");
    }
  }

  console.log(`\nDone. URLs submitted: ${okCount}/${urls.length} ok, ${failCount} failed.`);
}

main().catch((e) => {
  console.error("Indexer failed:", e.message);
  process.exit(1);
});
