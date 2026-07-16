import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";

// List intake submissions for the operator ops board.
export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;

  const url = new URL(req.url);
  const status = url.searchParams.get("status")?.trim() || "";

  let query = admin()
    .from("intake_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, rows: data || [] });
}
