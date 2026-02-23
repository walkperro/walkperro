import { NextRequest, NextResponse } from "next/server";
import { LEADOPS_PRIORITIES, LEADOPS_REVIEWS, LEADOPS_STAGES, LEADOPS_STATUSES, getAdminActor, isUuid, patchLead, replaceLeadCategoriesBySlugs } from "@/lib/leadops/admin-actions";
import { logLeadActivity } from "@/lib/leadops";

export const runtime = "nodejs";

function valid<T extends readonly string[]>(value: string, allowed: T) {
  return (allowed as readonly string[]).includes(value);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const id = String(form.get("id") || "").trim();
  const returnTo = String(form.get("return_to") || "/admin/leadops").trim();
  if (!isUuid(id)) {
    return NextResponse.redirect(new URL(`${returnTo}?error=invalid-id`, req.url));
  }

  const actor = getAdminActor(req.headers.get("authorization"));
  const patch: Record<string, unknown> = {};
  const activityDetail: Record<string, unknown> = {};

  const status = String(form.get("status") || "").trim();
  if (status) {
    if (!valid(status, LEADOPS_STATUSES)) {
      return NextResponse.redirect(new URL(`${returnTo}?error=invalid-status`, req.url));
    }
    patch.status = status;
    activityDetail.status = status;
    if (status === "contacted") patch.first_contacted_at = new Date().toISOString();
  }

  const stage = String(form.get("stage") || "").trim();
  if (stage) {
    if (!valid(stage, LEADOPS_STAGES)) {
      return NextResponse.redirect(new URL(`${returnTo}?error=invalid-stage`, req.url));
    }
    patch.stage = stage;
    activityDetail.stage = stage;
  }

  const priority = String(form.get("priority") || "").trim();
  if (priority) {
    if (!valid(priority, LEADOPS_PRIORITIES)) {
      return NextResponse.redirect(new URL(`${returnTo}?error=invalid-priority`, req.url));
    }
    patch.priority = priority;
    activityDetail.priority = priority;
  }

  const owner = String(form.get("owner") || "").trim();
  if (form.has("owner")) {
    patch.owner = owner || null;
    activityDetail.owner = owner || null;
  }

  const assignee = String(form.get("assignee") || "").trim();
  if (form.has("assignee")) {
    patch.assignee = assignee || null;
    activityDetail.assignee = assignee || null;
  }

  const followUp = String(form.get("follow_up_at") || "").trim();
  if (form.has("follow_up_at")) {
    patch.follow_up_at = followUp ? new Date(followUp).toISOString() : null;
    activityDetail.follow_up_at = patch.follow_up_at;
  }

  const review = String(form.get("classification_review") || "").trim();
  const reviewNotes = String(form.get("classification_review_notes") || "").trim();
  if (review) {
    if (!valid(review, LEADOPS_REVIEWS)) {
      return NextResponse.redirect(new URL(`${returnTo}?error=invalid-review`, req.url));
    }
    patch.classification_review = review;
    patch.classification_review_notes = reviewNotes || null;
    patch.classification_reviewer = actor;
    patch.classification_reviewed_at = new Date().toISOString();
    patch.stage = patch.stage || "reviewed";
    activityDetail.classification_review = review;
  }

  const internalNotes = String(form.get("internal_notes") || "").trim();
  if (form.has("internal_notes")) {
    patch.internal_notes = internalNotes || null;
    activityDetail.internal_notes = internalNotes ? "updated" : "cleared";
  }

  const enrichmentStatus = String(form.get("enrichment_status") || "").trim();
  if (enrichmentStatus) {
    patch.enrichment_status = enrichmentStatus;
    activityDetail.enrichment_status = enrichmentStatus;
  }
  const enrichmentNotes = String(form.get("enrichment_notes") || "").trim();
  if (form.has("enrichment_notes")) {
    patch.enrichment_notes = enrichmentNotes || null;
    activityDetail.enrichment_notes = enrichmentNotes ? "updated" : "cleared";
  }

  const categoriesCsv = String(form.get("category_slugs") || "").trim();

  try {
    if (Object.keys(patch).length) {
      await patchLead(id, patch);
      await logLeadActivity(id, "lead.updated", actor, activityDetail);
    }
    if (categoriesCsv) {
      const slugs = categoriesCsv.split(",").map((x) => x.trim()).filter(Boolean);
      await replaceLeadCategoriesBySlugs(id, slugs, actor);
      await logLeadActivity(id, "lead.categories.replaced", actor, { category_slugs: slugs });
    }
  } catch (error) {
    console.error("[leadops] update failed", error);
    return NextResponse.redirect(new URL(`${returnTo}?error=save-failed`, req.url));
  }

  return NextResponse.redirect(new URL(`${returnTo}?saved=1`, req.url));
}
