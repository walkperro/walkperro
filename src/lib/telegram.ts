// Thin Telegram Bot API wrapper. Server-only — uses TELEGRAM_BOT_TOKEN.

const API = "https://api.telegram.org";

function token(): string {
  // Project convention uses `walkperro_studio_bot`; fall back to TELEGRAM_BOT_TOKEN for portability.
  const t = process.env.walkperro_studio_bot || process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("Missing bot token (walkperro_studio_bot / TELEGRAM_BOT_TOKEN)");
  return t;
}

export type SendMessageOpts = {
  chatId: number | string;
  text: string;
  replyToMessageId?: number;
  parseMode?: "MarkdownV2" | "HTML";
};

/** Send a single message. Telegram caps at 4096 chars — caller should chunk. */
export async function sendMessage(opts: SendMessageOpts): Promise<void> {
  const params = new URLSearchParams();
  params.set("chat_id", String(opts.chatId));
  params.set("text", opts.text);
  params.set("disable_web_page_preview", "true");
  if (opts.replyToMessageId) params.set("reply_to_message_id", String(opts.replyToMessageId));
  if (opts.parseMode) params.set("parse_mode", opts.parseMode);

  const res = await fetch(`${API}/bot${token()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.warn("Telegram sendMessage failed:", res.status, body.description || "");
  }
}

/** Chunk and send a long message. */
export async function sendLongMessage(chatId: number | string, text: string): Promise<void> {
  const MAX = 3800;
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + MAX, text.length);
    if (end < text.length) {
      const back = text.lastIndexOf("\n\n", end);
      if (back > i + MAX / 2) end = back;
      else {
        const back2 = text.lastIndexOf("\n", end);
        if (back2 > i + MAX / 2) end = back2;
      }
    }
    chunks.push(text.slice(i, end).trim());
    i = end;
  }
  for (let k = 0; k < chunks.length; k++) {
    const suffix = chunks.length > 1 ? `\n\n— part ${k + 1}/${chunks.length}` : "";
    await sendMessage({ chatId, text: chunks[k] + suffix });
    if (k < chunks.length - 1) await new Promise((r) => setTimeout(r, 300));
  }
}

/** Send "typing" action while we wait for Claude. */
export async function sendChatAction(chatId: number | string, action = "typing"): Promise<void> {
  const params = new URLSearchParams();
  params.set("chat_id", String(chatId));
  params.set("action", action);
  try {
    await fetch(`${API}/bot${token()}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
  } catch {}
}

/** Set the webhook URL. Returns the Telegram response payload. */
export async function setWebhook(url: string, secretToken?: string) {
  const params = new URLSearchParams();
  params.set("url", url);
  params.set("drop_pending_updates", "true");
  params.set("allowed_updates", JSON.stringify(["message"]));
  if (secretToken) params.set("secret_token", secretToken);
  const res = await fetch(`${API}/bot${token()}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  return res.json();
}

/** Get current webhook info — useful for verifying setup. */
export async function getWebhookInfo() {
  const res = await fetch(`${API}/bot${token()}/getWebhookInfo`);
  return res.json();
}
