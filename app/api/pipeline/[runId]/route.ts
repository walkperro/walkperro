import { NextResponse } from "next/server";
import { requireCreator } from "@/lib/creator/session";
import { admin } from "@/lib/supabase/admin";

// Progress poll for the wow-screen. Returns the run's stage/pct/detail and,
// once succeeded, the clustered product opportunities.
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ runId: string }> }
) {
  let session;
  try {
    session = await requireCreator();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const creator = session.creator;
  if (!creator)
    return NextResponse.json({ error: "no_creator" }, { status: 400 });

  const { runId } = await ctx.params;
  const db = admin();
  const { data: run } = await db
    .from("pipeline_runs")
    .select("*")
    .eq("id", runId)
    .eq("creator_id", creator.id)
    .maybeSingle();
  if (!run) return NextResponse.json({ error: "not_found" }, { status: 404 });

  let opportunities: unknown[] = [];
  if (run.status === "succeeded") {
    const { data } = await db
      .from("product_opportunities")
      .select("*")
      .eq("pipeline_run_id", runId)
      .order("demand_score", { ascending: false });
    opportunities = data ?? [];
  }

  return NextResponse.json({
    status: run.status,
    stage: run.stage,
    pct: run.pct,
    detail: run.stage_detail,
    error: run.error,
    opportunities,
  });
}
