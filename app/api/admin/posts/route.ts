import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;
  const { data, error } = await admin()
    .from("posts")
    .select("id, slug, title, category, excerpt, status, scheduled_for, published_at, updated_at, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rows: data || [] });
}

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ ok: false, error: "missing_title" }, { status: 400 });

  const slug = body.slug ? slugify(String(body.slug)) : slugify(title);
  const row = {
    slug,
    title,
    category: typeof body.category === "string" ? body.category : "BUILD LOG",
    excerpt: typeof body.excerpt === "string" ? body.excerpt : null,
    body_md: typeof body.body_md === "string" ? body.body_md : "",
    status: typeof body.status === "string" ? body.status : "draft",
    scheduled_for: typeof body.scheduled_for === "string" ? body.scheduled_for : null,
  };

  const { data, error } = await admin().from("posts").insert(row).select("id, slug").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await audit(ctx.user.id, "post_created", { id: data.id, slug: data.slug }, { ip: ctx.ip, userAgent: ctx.userAgent });
  return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
}
