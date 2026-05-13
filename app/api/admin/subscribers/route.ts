import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";

export async function GET(req: NextRequest) {
  const ctx = await withAdmin(req, { requireCsrf: false });
  if (!isContext(ctx)) return ctx;

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const source = url.searchParams.get("source")?.trim() || "";
  const limit = Math.min(Number(url.searchParams.get("limit")) || 100, 500);

  let query = admin()
    .from("subscribers")
    .select("id, email, source, status, tags, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (q) query = query.ilike("email", `%${q}%`);
  if (source) query = query.eq("source", source);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Aggregate stats
  const { count: total } = await admin()
    .from("subscribers")
    .select("id", { count: "exact", head: true });

  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const { count: thisWeek } = await admin()
    .from("subscribers")
    .select("id", { count: "exact", head: true })
    .gte("created_at", weekAgo);

  return NextResponse.json({
    ok: true,
    rows: data || [],
    rowsCount: count ?? data?.length ?? 0,
    total: total ?? 0,
    thisWeek: thisWeek ?? 0,
  });
}
