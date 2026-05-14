import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { sendMessage, sendLongMessage, sendChatAction } from "@/lib/telegram";
import { claudeReply, type ClaudeMessage } from "@/lib/claude";
import { audit } from "@/lib/auth/audit";

export const dynamic = "force-dynamic";

const MAX_HISTORY = 20; // last N messages we keep + send back to Claude

const SYSTEM_PROMPT = `You are the WalkPerro studio assistant — a private channel for Walk (walkperro), who builds tools, sites, and field notes with AI from the ground up.

Style:
- First person. Specific over clever. No hype words ("game-changer", "unlock", "10x", "leverage"). No emojis.
- Direct. If you don't know something, say so. If a question has a single correct answer, just give it.
- Default to short messages — Telegram is small-screen. Long answers are fine when they earn it.
- When asked for code, give clean, copy-pasteable code without preamble.
- Voice match: brutalist, lowercase mono labels, "// LIKE THIS" callouts when summarizing.

Context:
- Walk runs walkperro.com — a Next.js 16 site on Vercel with Supabase + Resend + Stripe.
- His brand: bone (#F5F1E8), charcoal (#0E0E0E), signal yellow (#EBFF00). Used exactly once per viewport.
- Tagline: "For the ones who do."
- He has /admin (password + TOTP 2FA), /tools (Stripe + email-gated downloads), /log (markdown posts).
- He is currently solo. Treat him as the builder, not the customer.

You can help him: think through tradeoffs, draft copy, debug things, plan content, suggest commands. You cannot directly execute tools in his repo from this channel — when he asks you to "do" something, give the exact command or steps for him to run.

Keep replies under 3500 characters unless he asks for more.`;

type ThreadRow = {
  chat_id: number;
  user_id: number | null;
  username: string | null;
  messages: ClaudeMessage[];
  message_count: number;
};

async function loadThread(chatId: number): Promise<ThreadRow | null> {
  const { data } = await admin()
    .from("telegram_threads")
    .select("chat_id, user_id, username, messages, message_count")
    .eq("chat_id", chatId)
    .maybeSingle();
  return (data as unknown as ThreadRow) || null;
}

async function upsertThread(
  chatId: number,
  userId: number | null,
  username: string | null,
  messages: ClaudeMessage[]
): Promise<void> {
  const trimmed = messages.slice(-MAX_HISTORY);
  await admin().from("telegram_threads").upsert(
    {
      chat_id: chatId,
      user_id: userId,
      username,
      messages: trimmed,
      message_count: trimmed.length,
      last_message_at: new Date().toISOString(),
    },
    { onConflict: "chat_id" }
  );
}

function isAllowed(userId: number | null): boolean {
  const allow = (process.env.TELEGRAM_ALLOWED_USER_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allow.length === 0) return false; // fail closed
  return !!userId && allow.includes(String(userId));
}

export async function POST(req: NextRequest) {
  try {
    // Secret-token verification (set on the Telegram setWebhook call)
    const sentSecret = req.headers.get("x-telegram-bot-api-secret-token") || "";
    const expectSecret = process.env.TELEGRAM_WEBHOOK_SECRET || "";
    if (!expectSecret || sentSecret !== expectSecret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const update = await req.json().catch(() => ({}));
    const msg = update?.message;
    if (!msg || !msg.text) {
      return NextResponse.json({ ok: true, ignored: "no_text" });
    }

    const chatId = msg.chat?.id as number;
    const userId = msg.from?.id as number | undefined;
    const username = msg.from?.username || msg.from?.first_name || null;
    const text = String(msg.text);

    if (!chatId) return NextResponse.json({ ok: true, ignored: "no_chat" });

    if (!isAllowed(userId || null)) {
      await sendMessage({
        chatId,
        text: "// not authorized. this bot is private.",
      });
      await audit(null, "subscribe", {
        event: "telegram_unauthorized",
        userId,
        username,
      });
      return NextResponse.json({ ok: true, ignored: "unauthorized" });
    }

    // Slash commands
    const trimmed = text.trim();
    if (trimmed === "/start" || trimmed === "/help") {
      await sendMessage({
        chatId,
        text:
          "// walkperro studio — claude bridge\n\n" +
          "send me anything. I'll think and reply.\n\n" +
          "commands:\n" +
          "/reset  — wipe this thread's history\n" +
          "/stats  — show usage info",
      });
      return NextResponse.json({ ok: true });
    }
    if (trimmed === "/reset") {
      await admin().from("telegram_threads").update({ messages: [], message_count: 0 }).eq("chat_id", chatId);
      await sendMessage({ chatId, text: "// thread reset. clean slate." });
      return NextResponse.json({ ok: true });
    }
    if (trimmed === "/stats") {
      const thread = await loadThread(chatId);
      await sendMessage({
        chatId,
        text:
          `// stats\n` +
          `messages in thread: ${thread?.message_count || 0}\n` +
          `model: ${process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5"}\n` +
          `whitelist size: ${(process.env.TELEGRAM_ALLOWED_USER_IDS || "").split(",").filter(Boolean).length}`,
      });
      return NextResponse.json({ ok: true });
    }

    // Load conversation
    const thread = await loadThread(chatId);
    const history = thread?.messages || [];

    const newMessages: ClaudeMessage[] = [
      ...history,
      { role: "user", content: text },
    ];

    // Typing indicator
    sendChatAction(chatId).catch(() => {});

    // Call Claude
    let reply;
    try {
      reply = await claudeReply({
        system: SYSTEM_PROMPT,
        messages: newMessages,
      });
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error("CLAUDE_ERROR", errMsg);
      await sendMessage({
        chatId,
        text: `// claude api error.\n${errMsg.slice(0, 300)}`,
      });
      return NextResponse.json({ ok: false, error: "claude_failed" });
    }

    // Persist and reply
    const updated: ClaudeMessage[] = [
      ...newMessages,
      { role: "assistant", content: reply.text },
    ];
    await upsertThread(chatId, userId || null, username, updated);
    await sendLongMessage(chatId, reply.text);

    return NextResponse.json({ ok: true, tokens: { in: reply.inputTokens, out: reply.outputTokens } });
  } catch (e) {
    console.error("TELEGRAM_WEBHOOK_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

// Telegram requires a 200 response in <60s. We're well under that.
// GET is used for health/diagnostic only.
export async function GET() {
  return NextResponse.json({
    ok: true,
    info: "WalkPerro Telegram webhook. POST endpoint only — verified by x-telegram-bot-api-secret-token header.",
  });
}
