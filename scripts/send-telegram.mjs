// Send text or photos to the Telegram bot.
// Reads bot token from .env.local (walkperro_studio_bot or TELEGRAM_BOT_TOKEN).
// Auto-resolves TELEGRAM_CHAT_ID from getUpdates if not set.
//
// Usage:
//   node scripts/send-telegram.mjs <file.md|txt>            # text from file, chunked
//   node scripts/send-telegram.mjs --text "msg"             # inline text
//   node scripts/send-telegram.mjs --code <file>            # text as code block
//   node scripts/send-telegram.mjs --photo a.png            # one photo
//   node scripts/send-telegram.mjs --photos a.png b.png ... # media group (2-10 per group; auto-batch)
//   node scripts/send-telegram.mjs --photos-dir /path       # all *.png|.jpg in dir as media group
//   --caption "..."                                          # caption for photos
//
// SECURITY: never prints the bot token. Only HTTP status codes / Telegram error descriptions.

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

// --- env loading
function loadEnv() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
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
loadEnv();

const token = process.env.walkperro_studio_bot || process.env.TELEGRAM_BOT_TOKEN;
let chatId = process.env.TELEGRAM_CHAT_ID;
if (!token) {
  console.error("Missing bot token (walkperro_studio_bot or TELEGRAM_BOT_TOKEN) in .env.local.");
  process.exit(1);
}

async function resolveChatId() {
  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const body = await res.json();
  if (!body.ok || !body.result?.length) {
    console.error("Cannot auto-resolve TELEGRAM_CHAT_ID. Send /start to the bot first.");
    process.exit(2);
  }
  const latest = body.result[body.result.length - 1];
  const id = latest.message?.chat?.id || latest.channel_post?.chat?.id;
  if (!id) { console.error("getUpdates returned no chat id."); process.exit(2); }
  console.log(`Auto-resolved chat id (add to .env.local: TELEGRAM_CHAT_ID="${id}")`);
  return id;
}
if (!chatId) chatId = await resolveChatId();

// --- args
const argv = process.argv.slice(2);
let mode = "text";              // text | code | photo | photos | photos-dir
let payloadArgs = [];
let caption = "";
let codeMode = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--text") { mode = "inline-text"; payloadArgs.push(argv[++i] || ""); }
  else if (a === "--code") { codeMode = true; }
  else if (a === "--photo") { mode = "photo"; payloadArgs.push(argv[++i]); }
  else if (a === "--photos") {
    mode = "photos";
    while (i + 1 < argv.length && !argv[i + 1].startsWith("--")) payloadArgs.push(argv[++i]);
  }
  else if (a === "--photos-dir") { mode = "photos-dir"; payloadArgs.push(argv[++i]); }
  else if (a === "--caption") { caption = argv[++i] || ""; }
  else if (!a.startsWith("--")) { payloadArgs.push(a); }
}

const API = `https://api.telegram.org/bot${token}`;

// --- helpers
async function postJson(method, params) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) body.set(k, String(v));
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

async function postMultipart(method, fields) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (v && typeof v === "object" && v.filename && v.data) {
      fd.append(k, new Blob([v.data]), v.filename);
    } else {
      fd.append(k, String(v));
    }
  }
  const res = await fetch(`${API}/${method}`, { method: "POST", body: fd });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

// --- text chunking
const MAX_TEXT = 3800;
function chunkText(s) {
  const chunks = [];
  let i = 0;
  while (i < s.length) {
    let end = Math.min(i + MAX_TEXT, s.length);
    if (end < s.length) {
      const back = s.lastIndexOf("\n\n", end);
      if (back > i + MAX_TEXT / 2) end = back;
      else {
        const back2 = s.lastIndexOf("\n", end);
        if (back2 > i + MAX_TEXT / 2) end = back2;
      }
    }
    chunks.push(s.slice(i, end).trim());
    i = end;
  }
  return chunks;
}
const escapeMdV2Code = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`");

// --- senders
async function sendText(text) {
  const chunks = chunkText(text);
  console.log(`Sending ${chunks.length} text chunk(s)…`);
  for (let i = 0; i < chunks.length; i++) {
    const headerSuffix = chunks.length > 1 ? `\n\n— part ${i + 1}/${chunks.length}` : "";
    const body = codeMode ? "```\n" + escapeMdV2Code(chunks[i]) + "\n```" + headerSuffix : chunks[i] + headerSuffix;
    const params = { chat_id: chatId, text: body, disable_web_page_preview: "true" };
    if (codeMode) params.parse_mode = "MarkdownV2";
    const r = await postJson("sendMessage", params);
    if (!r.ok) { console.error(`sendMessage failed (${i + 1}/${chunks.length}):`, r.body.description || r.status); process.exit(3); }
    if (i < chunks.length - 1) await new Promise((r) => setTimeout(r, 300));
  }
  console.log("Done.");
}

async function sendPhoto(filePath, cap) {
  const data = readFileSync(filePath);
  const r = await postMultipart("sendPhoto", {
    chat_id: chatId,
    photo: { filename: path.basename(filePath), data },
    ...(cap ? { caption: cap } : {}),
  });
  if (!r.ok) { console.error(`sendPhoto failed:`, r.body.description || r.status); process.exit(3); }
  console.log(`Sent: ${path.basename(filePath)}`);
}

// Media group: 2-10 photos per call. Split larger batches into multiple groups.
async function sendMediaGroup(files, cap) {
  for (let i = 0; i < files.length; i += 10) {
    const batch = files.slice(i, i + 10);
    if (batch.length === 1) { await sendPhoto(batch[0], i === 0 ? cap : ""); continue; }

    const fd = new FormData();
    fd.append("chat_id", String(chatId));
    const mediaArr = [];
    for (let j = 0; j < batch.length; j++) {
      const file = batch[j];
      const key = `media${j}`;
      const data = readFileSync(file);
      fd.append(key, new Blob([data]), path.basename(file));
      const item = { type: "photo", media: `attach://${key}` };
      if (j === 0 && i === 0 && cap) item.caption = cap;
      mediaArr.push(item);
    }
    fd.append("media", JSON.stringify(mediaArr));

    const res = await fetch(`${API}/sendMediaGroup`, { method: "POST", body: fd });
    const ok = res.ok;
    const body = await res.json().catch(() => ({}));
    if (!ok) { console.error(`sendMediaGroup failed:`, body.description || res.status); process.exit(3); }
    console.log(`Sent media group (${batch.length} photo${batch.length > 1 ? "s" : ""}).`);
    if (i + 10 < files.length) await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("Done.");
}

function listPhotosInDir(dir) {
  const entries = readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => path.join(dir, f));
  entries.sort();
  return entries;
}

// --- dispatch
if (mode === "inline-text") {
  await sendText(payloadArgs[0] || "");
} else if (mode === "text") {
  if (!payloadArgs[0]) { console.error("No file given."); process.exit(1); }
  const buf = readFileSync(payloadArgs[0], "utf8");
  await sendText(buf);
} else if (mode === "photo") {
  await sendPhoto(payloadArgs[0], caption);
} else if (mode === "photos") {
  await sendMediaGroup(payloadArgs, caption);
} else if (mode === "photos-dir") {
  const files = listPhotosInDir(payloadArgs[0]);
  if (files.length === 0) { console.error("No images in directory."); process.exit(1); }
  console.log(`Found ${files.length} image(s) in ${payloadArgs[0]}`);
  await sendMediaGroup(files, caption);
}
