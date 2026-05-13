// Programmatic Google Search Console verification for walkperro.com via Site
// Verification API. The service account self-verifies — no UI step required.
//
// Two phases:
//
//   node scripts/gsc-verify.mjs token
//       → calls webResource.getToken(siteUrl, verificationMethod=META)
//       → prints the token + writes it to .env.local as
//         GOOGLE_SITE_VERIFICATION_TOKEN. Once you redeploy with the meta
//         tag wired into <head>, that token is visible at the homepage.
//
//   node scripts/gsc-verify.mjs verify
//       → calls webResource.insert(verificationMethod=META) to claim
//         ownership for the service account email. Once this passes, the
//         Indexing API will accept URL submissions for walkperro.com.
//
//   node scripts/gsc-verify.mjs status
//       → lists verified properties this service account currently owns.

import { SignJWT, importPKCS8 } from "jose";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.walkperro.com/";
const VERIFICATION_METHOD = "META";

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

function parseServiceAccount() {
  const raw = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    console.error("Missing GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON in .env.local.");
    process.exit(1);
  }
  const parsed = JSON.parse(raw);
  if (!parsed.client_email || !parsed.private_key) {
    console.error("Service account JSON missing client_email or private_key.");
    process.exit(1);
  }
  return parsed;
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
  if (!res.ok) throw new Error(`Token exchange ${res.status}: ${await res.text()}`);
  const body = await res.json();
  return body.access_token;
}

async function getVerificationToken(accessToken) {
  // POST to /v1/token with site spec + verificationMethod
  const res = await fetch(
    `https://www.googleapis.com/siteVerification/v1/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        site: { type: "SITE", identifier: SITE_URL },
        verificationMethod: VERIFICATION_METHOD,
      }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    console.error("getToken failed:", res.status, JSON.stringify(body));
    process.exit(2);
  }
  return body; // { token: "...", method: "META" }
}

async function insertVerification(accessToken) {
  // POST to /v1/webResource?verificationMethod=META
  // body identifies the site
  const res = await fetch(
    `https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=${VERIFICATION_METHOD}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        site: { type: "SITE", identifier: SITE_URL },
      }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    console.error("insert failed:", res.status, text);
    process.exit(2);
  }
  return JSON.parse(text);
}

async function listVerified(accessToken) {
  const res = await fetch(
    `https://www.googleapis.com/siteVerification/v1/webResource`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const body = await res.json();
  if (!res.ok) {
    console.error("list failed:", res.status, JSON.stringify(body));
    process.exit(2);
  }
  return body;
}

function patchEnvLocal(key, value) {
  const envPath = path.join(process.cwd(), ".env.local");
  let lines = [];
  try { lines = readFileSync(envPath, "utf8").split("\n"); } catch {}
  const filtered = lines.filter((l) => !l.startsWith(`${key}=`));
  filtered.push(`${key}="${value}"`);
  writeFileSync(envPath, filtered.filter((l) => l !== "" || filtered.indexOf(l) < filtered.length - 1).join("\n").trim() + "\n");
}

async function main() {
  const cmd = process.argv[2] || "help";

  if (cmd === "help" || cmd === "--help") {
    console.log("Usage:");
    console.log("  node scripts/gsc-verify.mjs token   # get token + save to env");
    console.log("  node scripts/gsc-verify.mjs verify  # claim ownership (after deploy)");
    console.log("  node scripts/gsc-verify.mjs status  # list verified properties");
    return;
  }

  console.log("Getting access token (scope: siteverification)…");
  const accessToken = await getAccessToken(
    "https://www.googleapis.com/auth/siteverification"
  );
  console.log("  ✓ token acquired\n");

  if (cmd === "token") {
    console.log(`Requesting verification token for: ${SITE_URL}`);
    const { token, method } = await getVerificationToken(accessToken);
    console.log(`  ✓ token issued (method=${method})`);
    console.log(`\nToken (this is the meta tag content value, not a secret):`);
    console.log(`  ${token}`);
    patchEnvLocal("GOOGLE_SITE_VERIFICATION_TOKEN", token);
    console.log("\n  ✓ written to .env.local as GOOGLE_SITE_VERIFICATION_TOKEN");
    console.log("\nNext steps:");
    console.log("  1. Push the token to Vercel production:");
    console.log(`     printf '%s' '${token}' | vercel env add GOOGLE_SITE_VERIFICATION_TOKEN production`);
    console.log("  2. Make sure app/layout.tsx exposes the meta tag (already wired).");
    console.log("  3. Deploy (vercel --prod) so the meta tag goes live at https://www.walkperro.com/.");
    console.log("  4. Then run: node scripts/gsc-verify.mjs verify");
  } else if (cmd === "verify") {
    console.log(`Claiming ownership of ${SITE_URL} (method=${VERIFICATION_METHOD})…`);
    const result = await insertVerification(accessToken);
    console.log("  ✓ verified");
    console.log(`     id:    ${result.id}`);
    console.log(`     site:  ${result.site?.identifier}`);
    console.log(`     owners: ${(result.owners || []).join(", ")}`);
    console.log("\nThe service account is now an Owner. Re-run the indexer:");
    console.log("  node scripts/index-walkperro.mjs");
  } else if (cmd === "status") {
    console.log("Verified properties for this service account:");
    const r = await listVerified(accessToken);
    if (!r.items || r.items.length === 0) {
      console.log("  (none yet)");
    } else {
      for (const item of r.items) {
        console.log(`  - ${item.site?.identifier}  (id=${item.id})`);
      }
    }
  } else {
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
  }
}

main().catch((e) => { console.error("Failed:", e.message); process.exit(1); });
