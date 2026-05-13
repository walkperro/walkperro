// One-shot: push env vars to Vercel. NEVER prints values.
// Three modes:
//   1. Pipe a named .env.local key to Vercel (key already present locally).
//   2. Generate a secret (openssl rand) and pipe to Vercel.
//   3. Add a literal known-value.
//
// All values reach the Vercel CLI via child stdin, never via argv or console.

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const ENV_PATH = path.join(process.cwd(), ".env.local");
const TARGET = process.argv[2] || "production"; // production / preview / development

function loadEnvLocal() {
  const raw = readFileSync(ENV_PATH, "utf8");
  const map = {};
  for (const line of raw.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    map[m[1]] = val;
  }
  return map;
}

async function addEnv(name, value, target) {
  return new Promise((resolve) => {
    const child = spawn("vercel", ["env", "add", name, target], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => {
      const text = stdout + stderr;
      let status = "?";
      if (/already exists/.test(text)) status = "exists";
      else if (/Added Environment Variable/.test(text)) status = "added";
      else if (code !== 0) status = `failed (${code})`;
      resolve({ status, snippet: text.split("\n").find((l) => /Added|exists|error/i.test(l)) || "" });
    });
    child.stdin.write(value);
    child.stdin.end();
  });
}

const env = loadEnvLocal();

// 1. Existing .env.local keys → Vercel (same name on both sides)
const passthroughKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "NOTIFY_SIGNUPS_TO",
  "walkperro_studio_bot",
];

console.log(`Target environment: ${TARGET}`);
console.log("Passthrough keys from .env.local:");
for (const k of passthroughKeys) {
  if (!env[k]) {
    console.log(`  ${k}: (not in .env.local, skipped)`);
    continue;
  }
  const r = await addEnv(k, env[k], TARGET);
  console.log(`  ${k}: ${r.status}`);
}

// 2. Generated secrets (random, never on disk)
console.log("\nGenerated secrets:");
for (const [name, generator] of [
  ["CRON_SECRET",            () => crypto.randomBytes(32).toString("hex")],
  ["ENCRYPTION_KEY",         () => crypto.randomBytes(32).toString("base64")],
  ["TELEGRAM_WEBHOOK_SECRET", () => crypto.randomBytes(24).toString("hex")],
]) {
  const val = generator();
  const r = await addEnv(name, val, TARGET);
  console.log(`  ${name}: ${r.status}`);
}

// 3. Known-value
console.log("\nKnown values:");
const known = [
  ["APP_URL", "https://www.walkperro.com"],
];
for (const [k, v] of known) {
  const r = await addEnv(k, v, TARGET);
  console.log(`  ${k}: ${r.status}`);
}

console.log("\nDone.");
console.log("\nStill needed (user must add manually via dashboard or CLI):");
console.log("  - ANTHROPIC_API_KEY            (console.anthropic.com)");
console.log("  - STRIPE_SECRET_KEY            (Stripe dashboard)");
console.log("  - STRIPE_WEBHOOK_SECRET        (after Stripe webhook is registered)");
console.log("  - TELEGRAM_ALLOWED_USER_IDS    (resolved via `node scripts/telegram-setup.mjs whoami` after you /start the bot)");
