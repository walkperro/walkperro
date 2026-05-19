// Auto-publish cron — flips status=scheduled → published for any post whose
// scheduled_for has passed, and pings Telegram so Walk sees the post went live.
//
// Triggered hourly by Vercel Cron (see vercel.json). Authenticated via
// `Authorization: Bearer ${CRON_SECRET}` header — anything else 401s.
//
// Idempotent: publishing an already-published post is a no-op (the query only
// matches status='scheduled'). Manual publishes via /admin/posts still work
// because they use a different audit action (post_published, not
// post_auto_published).
//
// Telegram payloads stay terse on purpose — voice/voice.md, lowercase + punch.

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { timingSafeEqual } from "@/lib/encryption";
import { audit } from "@/lib/auth/audit";
import { sendMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.walkperro.com";

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "cron_not_configured" }, { status: 503 });
  }
  const header = req.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (!timingSafeEqual(header, expected)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const supa = admin();

  const { data: due, error: dueErr } = await supa
    .from("posts")
    .select("id, slug, title")
    .eq("status", "scheduled")
    .lte("scheduled_for", now);

  if (dueErr) {
    return NextResponse.json({ ok: false, error: dueErr.message }, { status: 500 });
  }
  if (!due || due.length === 0) {
    return NextResponse.json({ ok: true, flipped: 0 });
  }

  const ids = due.map((d) => d.id);
  const { error: updErr } = await supa
    .from("posts")
    .update({ status: "published", published_at: now })
    .in("id", ids);

  if (updErr) {
    return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  }

  // Audit each publish event individually so we have a per-post record.
  for (const d of due) {
    await audit(null, "post_auto_published", { id: d.id, slug: d.slug, via: "cron" });
  }

  // Ping Telegram if configured. Best-effort — never fail the cron because of it.
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (chatId) {
    for (const d of due) {
      try {
        await sendMessage({
          chatId,
          text: `// published ✓ — ${d.title} is now live at ${SITE_URL}/log/${d.slug}`,
        });
      } catch (e) {
        console.warn("telegram notify failed for", d.slug, e);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    flipped: ids.length,
    slugs: due.map((d) => d.slug),
  });
}

export const GET = handle;
// POST allowed too — Vercel Cron historically sends GET, but external triggers may use POST.
export const POST = handle;
