// Send a markdown/plain text file to Telegram in <4096-char chunks.
// Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from .env.local.
// If TELEGRAM_CHAT_ID is missing, attempts to auto-resolve from the most
// recent message sent to the bot via getUpdates().
//
// Usage:
//   node scripts/send-telegram.mjs <path-to-file>   [--code]
//   node scripts/send-telegram.mjs --text "plain message"
//
// --code wraps the message in a ```code``` block (MarkdownV2). Default is plain text.
//
// SECURITY: this script never prints the bot token. Only the HTTP status code.

import { readFileSync } from "node:fs";
import path from "node:path";

// Load .env.local
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
let chatId = process.env.TELEGRAM_CHAT_ID;

if (!token) {
  console.error("Missing bot token in .env.local.");
  console.error("Add either of these lines (walkperro_studio_bot preferred):");
  console.error('  walkperro_studio_bot="your_bot_token_from_botfather"');
  console.error('  TELEGRAM_BOT_TOKEN="your_bot_token_from_botfather"');
  process.exit(1);
}

// Resolve chat_id from getUpdates if missing
async function resolveChatId() {
  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const body = await res.json();
  if (!body.ok || !body.result?.length) {
    console.error("Cannot auto-resolve TELEGRAM_CHAT_ID.");
    console.error("Send any message to your bot first (open Telegram → walkperro_studio_bot → /start), then retry.");
    process.exit(2);
  }
  // Most recent update's chat id
  const latest = body.result[body.result.length - 1];
  const id = latest.message?.chat?.id || latest.channel_post?.chat?.id;
  if (!id) {
    console.error("getUpdates returned no chat id.");
    process.exit(2);
  }
  console.log(`Auto-resolved chat id from latest update.`);
  console.log(`  → Add this line to .env.local to skip this step next time:`);
  console.log(`     TELEGRAM_CHAT_ID="${id}"`);
  return id;
}

if (!chatId) chatId = await resolveChatId();

// Parse args
const args = process.argv.slice(2);
let textMode = false;
let codeMode = false;
let payload = "";

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--text") {
    textMode = true;
    payload = args[i + 1] || "";
    i++;
  } else if (a === "--code") {
    codeMode = true;
  } else if (!textMode && !payload) {
    payload = readFileSync(a, "utf8");
  }
}

if (!payload) {
  console.error("No content. Usage: send-telegram.mjs <file> | --text 'msg' [--code]");
  process.exit(1);
}

// Chunk to <= 3800 chars (under Telegram's 4096 limit with room for headers/escapes).
const MAX = 3800;
function chunkText(s) {
  const chunks = [];
  let i = 0;
  while (i < s.length) {
    let end = Math.min(i + MAX, s.length);
    if (end < s.length) {
      // Prefer to break on a double-newline near the end
      const back = s.lastIndexOf("\n\n", end);
      if (back > i + MAX / 2) end = back;
      else {
        const back2 = s.lastIndexOf("\n", end);
        if (back2 > i + MAX / 2) end = back2;
      }
    }
    chunks.push(s.slice(i, end).trim());
    i = end;
  }
  return chunks;
}

// MarkdownV2 escape for `code` block payloads
function escapeMdV2Code(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
}

async function sendChunk(text, index, total) {
  const headerSuffix = total > 1 ? `\n\n— part ${index + 1}/${total}` : "";
  const body = codeMode
    ? "```\n" + escapeMdV2Code(text) + "\n```" + headerSuffix
    : text + headerSuffix;

  const params = new URLSearchParams();
  params.set("chat_id", String(chatId));
  params.set("text", body);
  params.set("disable_web_page_preview", "true");
  if (codeMode) params.set("parse_mode", "MarkdownV2");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error(`Telegram send failed (chunk ${index + 1}/${total}): ${res.status}`, errBody.description || "");
    process.exit(3);
  }
}

const chunks = chunkText(payload);
console.log(`Sending ${chunks.length} chunk${chunks.length > 1 ? "s" : ""} to Telegram…`);
for (let i = 0; i < chunks.length; i++) {
  await sendChunk(chunks[i], i, chunks.length);
  // Be polite to the Bot API rate limits (30 msg/sec hard cap; we're way under)
  if (i < chunks.length - 1) await new Promise((r) => setTimeout(r, 350));
}
console.log("Done.");
