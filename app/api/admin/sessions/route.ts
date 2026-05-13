import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";

export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;

  const { data } = await admin()
    .from("admin_sessions")
    .select("id, ip_address, user_agent, created_at, expires_at, revoked_at")
    .eq("admin_user_id", ctx.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ ok: true, sessions: data || [] });
}
