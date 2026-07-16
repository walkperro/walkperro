import { NextResponse } from "next/server";
import { tiktokAdapter } from "@/lib/platforms/tiktok";
import { buildDemoAnalysis } from "@/lib/pipeline/demo";
import fixture from "../../../../fixtures/apify/tiktok.json";

// Public, credential-free demo of the analyze flow. Normalizes a bundled
// fixture and derives product opportunities heuristically (no keys, no DB).
export const runtime = "nodejs";

export async function GET() {
  const scrape = tiktokAdapter.normalize(fixture as unknown[]);
  const analysis = buildDemoAnalysis(scrape);
  return NextResponse.json({ sample: true, ...analysis });
}
