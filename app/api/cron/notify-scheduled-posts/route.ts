// Morning Telegram nudge — lists posts scheduled to go out in the next 24 hours
// so Walk can eyeball them before the publish-scheduled cron flips the switch.
//
// Triggered daily at 13:00 UTC (≈9am ET) by Vercel Cron (see vercel.json).
// Authenticated via `Authorization: Bearer ${CRON_SECRET}` header.
//
// Companion to /api/cron/publish-scheduled: this one only *notifies*, the other
// one actually publishes. Running both is intentional — nudge gives Walk a
// chance to make manual edits before the hourly publish cron lands the post.

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { timingSafeEqual } from "@/lib/encryption";
import { sendMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.walkperro.com";

function formatEt(iso: string): string {
  // 2026-05-20T15:00:00+00:00 → "Wed May 20, 11:00 AM ET" (approx — uses Intl.DateTimeFormat).
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso)) + " ET";
  } catch {
    return iso;
  }
}

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

  const now = new Date();
  const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const supa = admin();
  const { data: upcoming, error } = await supa
    .from("posts")
    .select("id, slug, title, scheduled_for")
    .eq("status", "scheduled")
    .gte("scheduled_for", now.toISOString())
    .lte("scheduled_for", horizon.toISOString())
    .order("scheduled_for", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  if (!upcoming || upcoming.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (chatId) {
    const lines: string[] = [
      `// nudge — ${upcoming.length} post${upcoming.length === 1 ? "" : "s"} scheduled in the next 24h:`,
      "",
    ];
    for (const p of upcoming) {
      lines.push(`• ${p.title}`);
      lines.push(`  ${formatEt(p.scheduled_for!)}`);
      lines.push(`  ${SITE_URL}/admin/posts`);
      lines.push("");
    }
    try {
      await sendMessage({ chatId, text: lines.join("\n").trim() });
    } catch (e) {
      console.warn("telegram nudge failed", e);
    }
  }

  return NextResponse.json({
    ok: true,
    count: upcoming.length,
    slugs: upcoming.map((p) => p.slug),
  });
}

export const GET = handle;
export const POST = handle;
