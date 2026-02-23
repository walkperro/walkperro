import { NextRequest, NextResponse } from "next/server";
import { getAdminActor, isUuid, patchLead } from "@/lib/leadops/admin-actions";
import { logLeadActivity } from "@/lib/leadops";
import { supabaseRestRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const primaryId = String(form.get("primary_id") || "").trim();
  const mergeId = String(form.get("merge_id") || "").trim();
  const returnTo = String(form.get("return_to") || "/admin/leadops").trim();
  if (!isUuid(primaryId) || !isUuid(mergeId) || primaryId === mergeId) {
    return NextResponse.redirect(new URL(`${returnTo}?error=invalid-merge`, req.url));
  }
  const actor = getAdminActor(req.headers.get("authorization"));

  try {
    const rows = await supabaseRestRequest<Array<Record<string, unknown>>>({
      schema: "leadops",
      path: `leads?select=*&id=in.(\"${primaryId}\",\"${mergeId}\")&limit=2`,
    });
    const primary = rows.find((r) => r.id === primaryId);
    const dup = rows.find((r) => r.id === mergeId);
    if (!primary || !dup) throw new Error("Lead not found");

    const patch: Record<string, unknown> = {};
    const copyFields = ["contact_name","contact_email","contact_phone","company","website_url","location","message","industry","lead_type","owner","assignee","follow_up_at","internal_notes"];
    for (const field of copyFields) {
      if (!primary[field] && dup[field]) patch[field] = dup[field];
    }
    if ((Number(dup.score) || 0) > (Number(primary.score) || 0)) {
      patch.score = dup.score;
      patch.priority = dup.priority;
      patch.score_version = dup.score_version;
      patch.score_breakdown = dup.score_breakdown;
    }
    const mergedTags = Array.from(new Set([...(Array.isArray(primary.tags) ? (primary.tags as string[]) : []), ...(Array.isArray(dup.tags) ? (dup.tags as string[]) : [])]));
    patch.tags = mergedTags;

    if (Object.keys(patch).length) {
      await patchLead(primaryId, patch);
    }
    await patchLead(mergeId, {
      merged_into_lead_id: primaryId,
      stage: "merged",
      status: "archived",
    });

    await logLeadActivity(primaryId, "lead.merged.in", actor, { merged_from: mergeId });
    await logLeadActivity(mergeId, "lead.merged.out", actor, { merged_into: primaryId });
  } catch (error) {
    console.error("[leadops] merge failed", error);
    return NextResponse.redirect(new URL(`${returnTo}?error=merge-failed`, req.url));
  }

  return NextResponse.redirect(new URL(`${returnTo}?saved=1`, req.url));
}
