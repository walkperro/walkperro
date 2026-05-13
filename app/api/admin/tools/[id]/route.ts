import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  for (const k of [
    "slug", "title", "description", "status", "url", "file_path",
    "price_cents", "stripe_price_id", "requires_email", "sort_order",
  ]) {
    if (k in body) patch[k] = body[k];
  }
  const { error } = await admin().from("tools").update(patch).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  await audit(ctx.user.id, "tool_updated", { id, fields: Object.keys(patch) }, { ip: ctx.ip, userAgent: ctx.userAgent });
  return NextResponse.json({ ok: true });
}
