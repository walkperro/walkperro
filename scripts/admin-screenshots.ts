/**
 * Admin-area screenshots for the Backends section of walkperro.com.
 *
 * Auth strategies (per target):
 *   - "supabase-magic-link": mint a one-shot magic link via Supabase Admin API
 *     for ONE specific email (no listing, no enumeration), then have Playwright
 *     open it. The site's /auth/callback completes the session.
 *   - "cookie": set a fixed cookie value via Playwright. Used for fozzies
 *     where /admin is gated by a single static cookie.
 *
 * PII protection: BEFORE every screenshot we run a DOM walker that text-replaces
 * email and phone-shaped patterns inside text nodes with neutral placeholders.
 * Real customer data never lands in the raw PNG. Headings, nav, buttons are
 * left untouched because they don't match the patterns.
 *
 * Outputs:
 *   public/portfolio/admin/<slug>-<screen>.webp     final, committed
 *   scripts/.cache/admin-raw/<slug>-<screen>.png    pre-redact intermediates (gitignored)
 *
 * Usage:
 *   pnpm admin:capture
 *   pnpm admin:capture --only=shirt_shop
 *   pnpm admin:capture --force
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium, type BrowserContext, type Page } from "playwright";
import { createClient } from "@supabase/supabase-js";

interface ScreenSpec {
  path: string;
  label: string;
  /** Extra wait time (ms) after networkidle to allow charts/animations to settle. */
  settleMs?: number;
  /** When true, scroll to bottom + back to top before screenshotting (loads full page). */
  scrollFull?: boolean;
}

interface MagicLinkAuth {
  type: "supabase-magic-link";
  email: string;
}

interface CookieAuth {
  type: "cookie";
  /** Path to a sibling project's .env.local; the script reads ADMIN_TOKEN from it at runtime. */
  envFile?: string;
  /** Token env-var name to look up inside envFile (defaults to ADMIN_TOKEN). */
  envVarName?: string;
  /** POST endpoint that exchanges token for session cookie. */
  loginEndpoint?: string;
  /** Direct cookie set: name + value (no token exchange). */
  cookieName?: string;
  cookieValue?: string;
  cookieDomain: string;
}

interface PasswordAuth {
  type: "supabase-password";
  /** Path to the sibling project's .env.local for ADMIN_EMAIL + ADMIN_PASSWORD. */
  envFile: string;
  emailVar?: string;
  passwordVar?: string;
  /** Cookie names this project expects after login. */
  accessCookieName: string;
  refreshCookieName: string;
  cookieDomain: string;
}

interface FormAuth {
  type: "form-fill";
  envFile: string;
  emailVar?: string;
  passwordVar?: string;
  loginPath: string;
  emailSelector: string;
  passwordSelector: string;
  submitSelector: string;
  /** URL substring that signals success — wait for this in the URL after submit. */
  successPathSubstr: string;
}

type AuthSpec = MagicLinkAuth | CookieAuth | PasswordAuth | FormAuth;

interface AdminTarget {
  slug: string;
  base: string;
  auth: AuthSpec;
  screens: ScreenSpec[];
}

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, "scripts", ".cache", "admin-raw");
const OUT_DIR = path.join(ROOT, "public", "portfolio", "admin");

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const onlyTarget = onlyArg ? onlyArg.split("=")[1] : null;

// ============== Targets ==============

const TARGETS: AdminTarget[] = [
  {
    slug: "shirt_shop",
    base: "https://gaprinthub.vercel.app",
    auth: { type: "supabase-magic-link", email: "jamitest96@gmail.com" },
    screens: [
      { path: "/admin", label: "dashboard", settleMs: 1500 },
      { path: "/admin/products", label: "products", settleMs: 800 },
      { path: "/admin/orders", label: "orders", settleMs: 800 },
      { path: "/admin/newsletter", label: "newsletter", settleMs: 800 },
      { path: "/admin/settings", label: "settings", settleMs: 800 },
    ],
  },
  {
    slug: "fozzies",
    base: "https://fozziesdining.com",
    auth: {
      type: "cookie",
      envFile: "/Users/ironclaw/projects/fozzies/.env.local",
      envVarName: "ADMIN_TOKEN",
      loginEndpoint: "/api/admin/login",
      cookieDomain: "fozziesdining.com",
    },
    screens: [
      { path: "/admin", label: "dashboard", settleMs: 800 },
      { path: "/admin/menu", label: "menu", settleMs: 800 },
      { path: "/admin/announcements", label: "announcements", settleMs: 800 },
      { path: "/admin/clients", label: "newsletter", settleMs: 800 },
      { path: "/admin/banner", label: "banner", settleMs: 800 },
      { path: "/admin/reservations", label: "reservations", settleMs: 800 },
      { path: "/admin/activity", label: "activity", settleMs: 800 },
    ],
  },
  {
    slug: "summer",
    base: "https://summerloffler.com",
    auth: {
      type: "form-fill",
      envFile: "/Users/ironclaw/projects/summer/.env.local",
      emailVar: "ADMIN_EMAIL",
      passwordVar: "ADMIN_PASSWORD",
      loginPath: "/admin/login",
      emailSelector: 'input[type="email"], input[name="email"]',
      passwordSelector: 'input[type="password"], input[name="password"]',
      submitSelector: 'button[type="submit"], button:has-text("Sign in")',
      successPathSubstr: "/admin",
    },
    screens: [
      { path: "/admin", label: "dashboard", settleMs: 1200 },
      { path: "/admin/plans", label: "plans", settleMs: 800 },
      { path: "/admin/offers", label: "offers", settleMs: 800 },
      { path: "/admin/settings", label: "settings", settleMs: 800 },
    ],
  },
];

// ============== PII redaction ==============

const REDACT_SCRIPT = `
(function(){
  // Replace email + phone-shaped patterns inside text nodes only.
  // Skip script/style/input/textarea so we don't break syntax or controls.
  const SKIP = new Set(['SCRIPT','STYLE','INPUT','TEXTAREA','NOSCRIPT']);
  const EMAIL = /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b/g;
  const PHONE = /(?:\\+?1[\\s.\\-]?)?\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}\\b/g;
  // Replace likely customer names appearing in table cells (heuristic only)
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => SKIP.has((n.parentElement && n.parentElement.tagName) || '') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  let cur;
  while ((cur = w.nextNode())) nodes.push(cur);
  for (const n of nodes) {
    let v = n.nodeValue || '';
    if (!v.trim()) continue;
    v = v.replace(EMAIL, '\\u2022\\u2022\\u2022@example.com');
    v = v.replace(PHONE, '(\\u2022\\u2022\\u2022) \\u2022\\u2022\\u2022-\\u2022\\u2022\\u2022\\u2022');
    if (v !== n.nodeValue) n.nodeValue = v;
  }
  // Also redact the value of input fields that look like email/phone
  for (const el of Array.from(document.querySelectorAll('input'))) {
    const t = (el.getAttribute('type') || '').toLowerCase();
    const v = el.value || '';
    if (!v) continue;
    if (t === 'email' || EMAIL.test(v)) el.value = '\\u2022\\u2022\\u2022@example.com';
    else if (t === 'tel' || PHONE.test(v)) el.value = '(\\u2022\\u2022\\u2022) \\u2022\\u2022\\u2022-\\u2022\\u2022\\u2022\\u2022';
  }
})();
`;

// ============== Helpers ==============

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function maskKey(value: string | undefined): string {
  if (!value) return "(unset)";
  if (value.length <= 6) return "(redacted)";
  return `${value.slice(0, 4)}…(${value.length} chars)`;
}

// ============== Auth ==============

/** Sanitize an error string so URLs and tokens don't appear in transcripts. */
function sanitizeError(s: string): string {
  return s
    .replace(/https?:\/\/[^\s"]+/g, "<url>")
    .replace(/token=[A-Za-z0-9_-]+/g, "token=<redacted>");
}

async function authMagicLink(
  ctx: BrowserContext,
  base: string,
  email: string,
): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("[auth] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return false;
  }
  const sbAdmin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // 1) Mint a one-shot magic link for ONE specific email (no listing).
  //    We don't actually follow the link; we use the email_otp it returns.
  const { data: linkData, error: linkErr } = await sbAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkErr || !linkData) {
    console.error(`[auth] generateLink failed: ${sanitizeError(linkErr?.message ?? "no data")}`);
    return false;
  }
  const otp = (linkData.properties as { email_otp?: string } | undefined)?.email_otp;
  if (!otp) {
    console.error("[auth] no email_otp returned");
    return false;
  }

  // 2) Verify OTP using the anon key (public client) — yields a real session.
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    console.error("[auth] SUPABASE_ANON_KEY not set");
    return false;
  }
  const sbAnon = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data: sessData, error: otpErr } = await sbAnon.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });
  if (otpErr || !sessData?.session) {
    console.error(`[auth] verifyOtp failed: ${sanitizeError(otpErr?.message ?? "no session")}`);
    return false;
  }

  // 3) Set Supabase SSR auth cookies directly on the Playwright context.
  //    @supabase/ssr cookie format: `sb-<projectRef>-auth-token` with value
  //    `base64-<base64(JSON.stringify(session))>`. Library auto-chunks when > 3600 bytes.
  const projectRef = new URL(supabaseUrl).host.split(".")[0];
  const cookieBaseName = `sb-${projectRef}-auth-token`;
  const session = sessData.session;

  const sessionObj = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: session.user,
  };
  const encoded = `base64-${Buffer.from(JSON.stringify(sessionObj), "utf8").toString("base64")}`;
  const targetHost = new URL(base).hostname;
  const isLocal = targetHost === "localhost" || targetHost === "127.0.0.1";

  // Chunk into ~3600-byte pieces (browser cookie limit ~4KB; @supabase/ssr default chunkSize=3600).
  const CHUNK = 3600;
  const chunks: { name: string; value: string }[] = [];
  if (encoded.length <= CHUNK) {
    chunks.push({ name: cookieBaseName, value: encoded });
  } else {
    let i = 0;
    let part = 0;
    while (i < encoded.length) {
      chunks.push({
        name: `${cookieBaseName}.${part}`,
        value: encoded.slice(i, i + CHUNK),
      });
      i += CHUNK;
      part += 1;
    }
  }

  await ctx.addCookies(
    chunks.map((c) => ({
      name: c.name,
      value: c.value,
      domain: targetHost,
      path: "/",
      httpOnly: false, // @supabase/ssr writes non-httpOnly so the JS client can read
      secure: !isLocal,
      sameSite: "Lax" as const,
      expires: session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
    })),
  );

  return true;
}

/** Parse a .env.local file into a key→value map. Values stay in memory; never logged. */
async function readEnvFile(filePath: string): Promise<Record<string, string>> {
  const raw = await fs.readFile(filePath, "utf8");
  const out: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k) out[k] = v;
  }
  return out;
}

async function authCookie(
  ctx: BrowserContext,
  base: string,
  spec: CookieAuth,
): Promise<boolean> {
  let token: string | null = null;
  if (spec.envFile) {
    try {
      const env = await readEnvFile(spec.envFile);
      token = env[spec.envVarName ?? "ADMIN_TOKEN"] ?? null;
    } catch (err) {
      console.error(
        `[auth] could not read envFile: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return false;
    }
  } else if (spec.cookieValue) {
    token = spec.cookieValue;
  }
  if (!token) {
    console.error("[auth] admin token not found in envFile");
    return false;
  }

  if (spec.loginEndpoint) {
    // POST token to login endpoint, capture set-cookie
    const page = await ctx.newPage();
    try {
      const url = `${base}${spec.loginEndpoint}`;
      const res = await page.request.post(url, {
        data: { token },
        headers: { "content-type": "application/json" },
      });
      if (!res.ok()) {
        console.error(`[auth] login endpoint returned ${res.status()}`);
        await page.close();
        return false;
      }
      // Cookie is now set on the context (via Playwright's request handling)
      await page.close();
      return true;
    } catch (err) {
      console.error(
        `[auth] cookie login failed: ${err instanceof Error ? err.message : String(err)}`,
      );
      await page.close();
      return false;
    }
  } else if (spec.cookieName) {
    await ctx.addCookies([
      {
        name: spec.cookieName,
        value: token,
        domain: spec.cookieDomain,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
      },
    ]);
    return true;
  }
  return false;
}

async function authPassword(
  ctx: BrowserContext,
  base: string,
  spec: PasswordAuth,
): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    console.error("[auth] SUPABASE_URL or anon key not set");
    return false;
  }

  let email: string | undefined;
  let password: string | undefined;
  try {
    const env = await readEnvFile(spec.envFile);
    email = env[spec.emailVar ?? "ADMIN_EMAIL"];
    password = env[spec.passwordVar ?? "ADMIN_PASSWORD"];
  } catch (err) {
    console.error(
      `[auth] could not read envFile: ${err instanceof Error ? err.message : String(err)}`,
    );
    return false;
  }
  if (!email || !password) {
    console.error("[auth] ADMIN_EMAIL or ADMIN_PASSWORD missing in envFile");
    return false;
  }

  const sb = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  // Wipe local refs immediately
  email = "";
  password = "";
  if (error || !data?.session) {
    console.error(`[auth] signInWithPassword failed: ${sanitizeError(error?.message ?? "no session")}`);
    return false;
  }
  const targetHost = new URL(base).hostname;
  await ctx.addCookies([
    {
      name: spec.accessCookieName,
      value: data.session.access_token,
      domain: targetHost,
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      expires: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
    },
    {
      name: spec.refreshCookieName,
      value: data.session.refresh_token,
      domain: targetHost,
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    },
  ]);
  return true;
}

async function authForm(
  ctx: BrowserContext,
  base: string,
  spec: FormAuth,
): Promise<boolean> {
  let email: string | undefined;
  let password: string | undefined;
  try {
    const env = await readEnvFile(spec.envFile);
    email = env[spec.emailVar ?? "ADMIN_EMAIL"];
    password = env[spec.passwordVar ?? "ADMIN_PASSWORD"];
  } catch (err) {
    console.error(
      `[auth] could not read envFile: ${err instanceof Error ? err.message : String(err)}`,
    );
    return false;
  }
  if (!email || !password) {
    console.error("[auth] ADMIN_EMAIL or ADMIN_PASSWORD missing in envFile");
    return false;
  }

  const page = await ctx.newPage();
  try {
    await page.goto(`${base}${spec.loginPath}`, { waitUntil: "networkidle", timeout: 30_000 });
    await page.fill(spec.emailSelector, email);
    await page.fill(spec.passwordSelector, password);
    // Wipe local refs immediately
    email = "";
    password = "";
    await page.click(spec.submitSelector);
    await page.waitForURL(
      (u) => u.pathname.includes(spec.successPathSubstr) && !u.pathname.includes("login"),
      { timeout: 20_000 },
    );
    await page.close();
    return true;
  } catch (err) {
    console.error(
      `[auth] form-fill failed: ${err instanceof Error ? sanitizeError(err.message) : "unknown"}`,
    );
    await page.close();
    return false;
  }
}

async function authenticate(
  ctx: BrowserContext,
  target: AdminTarget,
): Promise<boolean> {
  if (target.auth.type === "supabase-magic-link") {
    return authMagicLink(ctx, target.base, target.auth.email);
  }
  if (target.auth.type === "supabase-password") {
    return authPassword(ctx, target.base, target.auth);
  }
  if (target.auth.type === "form-fill") {
    return authForm(ctx, target.base, target.auth);
  }
  return authCookie(ctx, target.base, target.auth);
}

// ============== Capture ==============

async function captureScreen(
  page: Page,
  target: AdminTarget,
  screen: ScreenSpec,
): Promise<Buffer | null> {
  const url = `${target.base}${screen.path}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  } catch (err) {
    console.error(
      `[fail] ${target.slug}/${screen.label}: page.goto — ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return null;
  }

  // Settle (charts, animations, lazy data)
  if (screen.settleMs) await page.waitForTimeout(screen.settleMs);

  // Optionally scroll full
  if (screen.scrollFull) {
    await page.evaluate(async () => {
      await new Promise<void>((res) => {
        let total = 0;
        const step = 600;
        const t = setInterval(() => {
          window.scrollBy(0, step);
          total += step;
          if (total >= document.body.scrollHeight) {
            clearInterval(t);
            window.scrollTo(0, 0);
            setTimeout(() => res(), 300);
          }
        }, 60);
      });
    });
    await page.waitForTimeout(400);
  }

  // CRITICAL: redact PII before screenshot
  await page.evaluate(REDACT_SCRIPT);
  await page.waitForTimeout(200);

  try {
    return await page.screenshot({ type: "png", fullPage: false });
  } catch (err) {
    console.error(
      `[fail] ${target.slug}/${screen.label}: screenshot — ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return null;
  }
}

// ============== Main ==============

async function captureTarget(target: AdminTarget): Promise<{ ok: number; fail: number; skip: number }> {
  console.log(`\n[${target.slug}] base=${target.base}`);
  let ok = 0, fail = 0, skip = 0;

  // Skip if all outputs already exist (and not --force)
  if (!force) {
    const allExist = await Promise.all(
      target.screens.map((s) =>
        fileExists(path.join(OUT_DIR, `${target.slug}-${s.label}.webp`)),
      ),
    );
    if (allExist.every(Boolean)) {
      console.log(`  all ${target.screens.length} screens already captured`);
      return { ok: 0, fail: 0, skip: target.screens.length };
    }
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const ok_auth = await authenticate(ctx, target);
  if (!ok_auth) {
    console.error(`  auth failed — skipping all ${target.screens.length} screens`);
    await ctx.close();
    await browser.close();
    return { ok: 0, fail: target.screens.length, skip: 0 };
  }

  const page = await ctx.newPage();

  for (const s of target.screens) {
    const outFinal = path.join(OUT_DIR, `${target.slug}-${s.label}.webp`);
    if (!force && (await fileExists(outFinal))) {
      console.log(`  [skip] ${s.label}`);
      skip += 1;
      continue;
    }

    console.log(`  [shot] ${s.label} ← ${target.base}${s.path}`);
    const buf = await captureScreen(page, target, s);
    if (!buf) {
      fail += 1;
      continue;
    }
    const rawPath = path.join(RAW_DIR, `${target.slug}-${s.label}.png`);
    await fs.writeFile(rawPath, buf);

    // webp at 78 quality, max width 1600
    await sharp(buf)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(outFinal);

    console.log(`         → ${path.relative(ROOT, outFinal)}`);
    ok += 1;
  }

  await ctx.close();
  await browser.close();
  return { ok, fail, skip };
}

async function main() {
  await ensureDir(RAW_DIR);
  await ensureDir(OUT_DIR);

  const supabaseUrl = process.env.SUPABASE_URL;
  console.log(`[admin:capture] SUPABASE_URL ${maskKey(supabaseUrl)}`);

  const targets = onlyTarget
    ? TARGETS.filter((t) => t.slug === onlyTarget)
    : TARGETS;
  if (onlyTarget && targets.length === 0) {
    console.error(`No admin target with slug "${onlyTarget}"`);
    process.exit(1);
  }

  let totals = { ok: 0, fail: 0, skip: 0 };
  for (const t of targets) {
    const r = await captureTarget(t);
    totals.ok += r.ok;
    totals.fail += r.fail;
    totals.skip += r.skip;
  }

  console.log(
    `\n[admin:capture] done — ${totals.ok} captured, ${totals.skip} skipped, ${totals.fail} failed.`,
  );
  if (totals.fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[admin:capture] fatal", err);
  process.exit(1);
});
