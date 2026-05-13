import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const { id } = await params;

  // Only allow revoking your own session rows.
  const { data: session } = await admin()
    .from("admin_sessions")
    .select("id, admin_user_id")
    .eq("id", id)
    .maybeSingle();

  if (!session || session.admin_user_id !== ctx.user.id) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  await admin()
    .from("admin_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);

  await audit(ctx.user.id, "session_revoked", { sessionId: id }, { ip: ctx.ip, userAgent: ctx.userAgent });
  return NextResponse.json({ ok: true });
}
