import { NextRequest, NextResponse } from "next/server";
import { ingestLeadToLeadOps, type LeadOpsIngestInput } from "@/lib/leadops";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const secret = process.env.LEADOPS_INGEST_KEY;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "LEADOPS_INGEST_KEY is not configured." }, { status: 503 });
  }

  const headerKey = req.headers.get("x-leadops-ingest-key") || req.headers.get("x-api-key");
  if (headerKey !== secret) return unauthorized();

  let body: LeadOpsIngestInput;
  try {
    body = (await req.json()) as LeadOpsIngestInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const lead = await ingestLeadToLeadOps(body, body.source_project || "ingest-api");
    return NextResponse.json({ ok: true, id: lead.id, score: lead.score, priority: lead.priority });
  } catch (error) {
    console.error("[leadops] ingest failed", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Ingest failed" }, { status: 500 });
  }
}
