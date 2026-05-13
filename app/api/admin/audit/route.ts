import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";

export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit")) || 50, 200);
  const { data, error } = await admin()
    .from("admin_audit_log")
    .select("id, admin_user_id, action, details, ip_address, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rows: data || [] });
}
