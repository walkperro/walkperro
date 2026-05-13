// One-time + diagnostic helpers for the Telegram bot.
// Reads token from .env.local. Never prints the token.
//
// Subcommands:
//   info                    Show getMe + current webhook info
//   set-webhook <url>       Register webhook URL. Uses TELEGRAM_WEBHOOK_SECRET as the secret token.
//   delete-webhook          Remove webhook (use this if switching to polling for local dev).
//   whoami                  Print sender id/username of the most recent message — use to populate
//                           TELEGRAM_ALLOWED_USER_IDS.
//
// Example:
//   node scripts/telegram-setup.mjs info
//   node scripts/telegram-setup.mjs whoami
//   node scripts/telegram-setup.mjs set-webhook https://www.walkperro.com/api/telegram/webhook

import { readFileSync } from "node:fs";
import path from "node:path";

function loadEnv() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = val;
    }
  } catch {}
}
loadEnv();

// Accept either env name; user's setup uses `walkperro_studio_bot`.
const token = process.env.walkperro_studio_bot || process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Missing bot token (walkperro_studio_bot or TELEGRAM_BOT_TOKEN) in .env.local.");
  process.exit(1);
}

const cmd = process.argv[2];
const arg1 = process.argv[3];

async function api(method, params = {}) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) search.set(k, String(v));
  const url = `https://api.telegram.org/bot${token}/${method}${search.toString() ? "?" + search : ""}`;
  const res = await fetch(url);
  return res.json();
}

async function postApi(method, params = {}) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) body.set(k, String(v));
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return res.json();
}

if (cmd === "info") {
  const me = await api("getMe");
  console.log("Bot identity:");
  console.log(`  username:        @${me.result?.username}`);
  console.log(`  id:              ${me.result?.id}`);
  console.log(`  can_read_all:    ${me.result?.can_read_all_group_messages}`);
  console.log();
  const wh = await api("getWebhookInfo");
  console.log("Webhook:");
  if (wh.result?.url) {
    console.log(`  url:             ${wh.result.url}`);
    console.log(`  pending_updates: ${wh.result.pending_update_count}`);
    console.log(`  has_secret:      ${wh.result.has_custom_certificate || !!wh.result.allowed_updates}`);
    if (wh.result.last_error_message) console.log(`  last_error:      ${wh.result.last_error_message}`);
  } else {
    console.log("  (none registered)");
  }
} else if (cmd === "set-webhook") {
  if (!arg1) {
    console.error("Usage: set-webhook <full-https-url>");
    process.exit(1);
  }
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing TELEGRAM_WEBHOOK_SECRET in .env.local. Generate: openssl rand -hex 24");
    process.exit(2);
  }
  const r = await postApi("setWebhook", {
    url: arg1,
    drop_pending_updates: "true",
    allowed_updates: JSON.stringify(["message"]),
    secret_token: secret,
  });
  console.log(JSON.stringify(r, null, 2));
} else if (cmd === "delete-webhook") {
  const r = await postApi("deleteWebhook", { drop_pending_updates: "true" });
  console.log(JSON.stringify(r, null, 2));
} else if (cmd === "whoami") {
  const r = await api("getUpdates");
  if (!r.result?.length) {
    console.error("No recent updates. Send any message to the bot first, then retry.");
    process.exit(2);
  }
  const latest = r.result[r.result.length - 1];
  const m = latest.message || {};
  const from = m.from || {};
  console.log("Most recent sender:");
  console.log(`  user_id:    ${from.id}`);
  console.log(`  username:   @${from.username || "(none)"}`);
  console.log(`  first_name: ${from.first_name || ""}`);
  console.log(`  chat_id:    ${m.chat?.id}`);
  console.log();
  console.log("To authorize this user, add to .env.local + Vercel env:");
  console.log(`  TELEGRAM_ALLOWED_USER_IDS="${from.id}"`);
} else {
  console.error("Usage:");
  console.error("  info");
  console.error("  set-webhook <https-url>");
  console.error("  delete-webhook");
  console.error("  whoami");
  process.exit(1);
}
