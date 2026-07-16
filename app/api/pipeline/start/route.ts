import { NextResponse } from "next/server";
import { requireCreator } from "@/lib/creator/session";
import { admin } from "@/lib/supabase/admin";
import { resolveProfileUrl } from "@/lib/platforms";
import { inngest, EVENTS, type AnalyzeRequested } from "@/lib/inngest/client";

// Kick off a real analyze pipeline for the logged-in creator. Creates the
// connected account + pipeline run, then fires the Inngest event. The UI polls
// GET /api/pipeline/[runId] for progress.
export const runtime = "nodejs";

export async function POST(req: Request) {
  let session;
  try {
    session = await requireCreator();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const creator = session.creator;
  if (!creator)
    return NextResponse.json({ error: "no_creator" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { url?: string };
  const resolved = resolveProfileUrl(String(body.url ?? ""));
  if (!resolved)
    return NextResponse.json(
      { error: "unrecognized_url" },
      { status: 400 }
    );

  const db = admin();
  const { data: account, error: accErr } = await db
    .from("connected_accounts")
    .upsert(
      {
        creator_id: creator.id,
        platform: resolved.adapter.platform,
        handle: resolved.handle,
        profile_url: String(body.url),
      },
      { onConflict: "creator_id,platform,handle" }
    )
    .select("*")
    .single();
  if (accErr)
    return NextResponse.json({ error: accErr.message }, { status: 500 });

  const { data: run, error: runErr } = await db
    .from("pipeline_runs")
    .insert({
      creator_id: creator.id,
      connected_account_id: account.id,
      kind: "analyze",
      status: "queued",
      stage: "queued",
      pct: 0,
    })
    .select("*")
    .single();
  if (runErr)
    return NextResponse.json({ error: runErr.message }, { status: 500 });

  await inngest.send({
    name: EVENTS.analyzeRequested,
    data: {
      creatorId: creator.id,
      connectedAccountId: account.id,
      pipelineRunId: run.id,
      platform: resolved.adapter.platform,
      handle: resolved.handle,
    } satisfies AnalyzeRequested,
  });

  return NextResponse.json({ runId: run.id });
}
