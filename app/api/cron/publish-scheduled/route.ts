import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { timingSafeEqual } from "@/lib/encryption";
import { audit } from "@/lib/auth/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

  const { data: due } = await supa
    .from("posts")
    .select("id, slug")
    .eq("status", "scheduled")
    .lte("scheduled_for", now);

  if (!due || due.length === 0) {
    return NextResponse.json({ ok: true, flipped: 0 });
  }

  const ids = due.map((d) => d.id);
  const { error } = await supa
    .from("posts")
    .update({ status: "published", published_at: now })
    .in("id", ids);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  for (const d of due) {
    await audit(null, "post_published", { id: d.id, slug: d.slug, via: "cron" });
  }

  return NextResponse.json({ ok: true, flipped: ids.length, slugs: due.map((d) => d.slug) });
}

// POST allowed too, in case Vercel sends POST.
export const POST = GET;
