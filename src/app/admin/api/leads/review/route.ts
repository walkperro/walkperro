import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerConfig } from "@/lib/supabase-rest";

export const runtime = "nodejs";

type ReviewDecision = "qualified" | "nurture" | "disqualify" | "follow-up";
type LeadStatus = "new" | "contacted" | "won" | "lost";
type LeadPriority = "low" | "medium" | "high";

const REVIEW_DECISIONS = new Set<ReviewDecision>(["qualified", "nurture", "disqualify", "follow-up"]);
const LEAD_STATUSES = new Set<LeadStatus>(["new", "contacted", "won", "lost"]);
const LEAD_PRIORITIES = new Set<LeadPriority>(["low", "medium", "high"]);

function getReviewer(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return "admin";
  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const [user] = decoded.split(":");
    return user || "admin";
  } catch {
    return "admin";
  }
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const id = String(form.get("id") || "").trim();
  const classificationReview = String(form.get("classification_review") || "").trim() as ReviewDecision;
  const classificationNotes = String(form.get("classification_review_notes") || "").trim();
  const statusRaw = String(form.get("status") || "").trim();
  const priorityRaw = String(form.get("priority") || "").trim();
  const returnView = String(form.get("return_view") || "hot").trim();

  if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
    return NextResponse.redirect(new URL(`/admin/leads?view=${encodeURIComponent(returnView)}&error=invalid-id`, req.url));
  }

  if (!REVIEW_DECISIONS.has(classificationReview)) {
    return NextResponse.redirect(
      new URL(`/admin/leads?view=${encodeURIComponent(returnView)}&error=invalid-review`, req.url),
    );
  }

  const updateBody: Record<string, unknown> = {
    classification_reviewed_at: new Date().toISOString(),
    classification_review: classificationReview,
    classification_review_notes: classificationNotes || null,
    classification_reviewer: getReviewer(req),
  };

  if (statusRaw) {
    if (!LEAD_STATUSES.has(statusRaw as LeadStatus)) {
      return NextResponse.redirect(
        new URL(`/admin/leads?view=${encodeURIComponent(returnView)}&error=invalid-status`, req.url),
      );
    }
    updateBody.status = statusRaw;
  }

  if (priorityRaw && priorityRaw !== "keep") {
    if (!LEAD_PRIORITIES.has(priorityRaw as LeadPriority)) {
      return NextResponse.redirect(
        new URL(`/admin/leads?view=${encodeURIComponent(returnView)}&error=invalid-priority`, req.url),
      );
    }
    updateBody.priority = priorityRaw;
  }

  try {
    const { supabaseUrl, serviceRoleKey } = getSupabaseServerConfig();
    const res = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Accept-Profile": "walkperro",
        "Content-Profile": "walkperro",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(updateBody),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[walkperro] admin review update failed", text);
      return NextResponse.redirect(
        new URL(`/admin/leads?view=${encodeURIComponent(returnView)}&error=save-failed`, req.url),
      );
    }
  } catch (error) {
    console.error("[walkperro] admin review error", error);
    return NextResponse.redirect(
      new URL(`/admin/leads?view=${encodeURIComponent(returnView)}&error=server-failed`, req.url),
    );
  }

  return NextResponse.redirect(new URL(`/admin/leads?view=${encodeURIComponent(returnView)}&saved=1`, req.url));
}
