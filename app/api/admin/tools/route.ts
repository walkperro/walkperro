import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;
  const { data, error } = await admin()
    .from("tools")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rows: data || [] });
}

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const body = await req.json().catch(() => ({}));
  const required = ["slug", "title", "description"] as const;
  for (const k of required) {
    if (!body[k] || typeof body[k] !== "string") {
      return NextResponse.json({ ok: false, error: `missing_${k}` }, { status: 400 });
    }
  }
  const row = {
    slug: body.slug,
    title: body.title,
    description: body.description,
    status: typeof body.status === "string" ? body.status : "DRAFT",
    url: typeof body.url === "string" ? body.url : null,
    file_path: typeof body.file_path === "string" ? body.file_path : null,
    price_cents: typeof body.price_cents === "number" ? body.price_cents : 0,
    stripe_price_id: typeof body.stripe_price_id === "string" ? body.stripe_price_id : null,
    requires_email: typeof body.requires_email === "boolean" ? body.requires_email : true,
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
  };
  const { data, error } = await admin().from("tools").insert(row).select("id, slug").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  await audit(ctx.user.id, "tool_created", { id: data.id, slug: data.slug }, { ip: ctx.ip, userAgent: ctx.userAgent });
  return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
}
