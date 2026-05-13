import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;
  const { data } = await admin()
    .from("now_strip")
    .select("id, building, reading, listening, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  return NextResponse.json({ ok: true, rows: data || [] });
}

export async function POST(req: NextRequest) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const body = await req.json().catch(() => ({}));
  const building = typeof body.building === "string" ? body.building : null;
  const reading = typeof body.reading === "string" ? body.reading : null;
  const listening = typeof body.listening === "string" ? body.listening : null;

  const supa = admin();
  // Deactivate any active rows
  await supa.from("now_strip").update({ is_active: false }).eq("is_active", true);
  // Insert new active row
  const { data, error } = await supa
    .from("now_strip")
    .insert({ building, reading, listening, is_active: true })
    .select("id")
    .single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await audit(ctx.user.id, "now_updated", { id: data.id }, { ip: ctx.ip, userAgent: ctx.userAgent });
  return NextResponse.json({ ok: true, id: data.id });
}
