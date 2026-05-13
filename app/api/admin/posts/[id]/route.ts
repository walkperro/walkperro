import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;
  const { id } = await params;
  const { data, error } = await admin()
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, row: data });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const patch: Record<string, unknown> = {};
  for (const key of ["slug", "title", "category", "excerpt", "body_md", "status", "scheduled_for"]) {
    if (key in body) patch[key] = body[key];
  }

  // If transitioning to 'published' and published_at is null, set it.
  if (patch.status === "published") {
    patch.published_at = new Date().toISOString();
  }

  const { error } = await admin().from("posts").update(patch).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await audit(
    ctx.user.id,
    patch.status === "published" ? "post_published" : "post_updated",
    { id, fields: Object.keys(patch) },
    { ip: ctx.ip, userAgent: ctx.userAgent }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const { id } = await params;
  const { error } = await admin().from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  await audit(ctx.user.id, "post_deleted", { id }, { ip: ctx.ip, userAgent: ctx.userAgent });
  return NextResponse.json({ ok: true });
}
