import { NextRequest, NextResponse } from "next/server";
import { addActivityForLeads, getAdminActor, parseIdsCsv, patchLeads } from "@/lib/leadops/admin-actions";
import { assignCategoriesBySlugs } from "@/lib/leadops";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const ids = parseIdsCsv(String(form.get("ids") || ""));
  const action = String(form.get("action") || "").trim();
  const value = String(form.get("value") || "").trim();
  const returnTo = String(form.get("return_to") || "/admin/leadops").trim();
  const actor = getAdminActor(req.headers.get("authorization"));

  if (!ids.length) {
    return NextResponse.redirect(new URL(`${returnTo}?error=no-selection`, req.url));
  }

  try {
    if (action === "set-status") {
      await patchLeads(ids, { status: value });
      await addActivityForLeads(ids, actor, "lead.bulk.status", { status: value });
    } else if (action === "set-stage") {
      await patchLeads(ids, { stage: value });
      await addActivityForLeads(ids, actor, "lead.bulk.stage", { stage: value });
    } else if (action === "assign-owner") {
      await patchLeads(ids, { owner: value || null });
      await addActivityForLeads(ids, actor, "lead.bulk.owner", { owner: value || null });
    } else if (action === "assign-assignee") {
      await patchLeads(ids, { assignee: value || null });
      await addActivityForLeads(ids, actor, "lead.bulk.assignee", { assignee: value || null });
    } else if (action === "set-followup") {
      await patchLeads(ids, { follow_up_at: value ? new Date(value).toISOString() : null });
      await addActivityForLeads(ids, actor, "lead.bulk.followup", { follow_up_at: value || null });
    } else if (action === "add-category") {
      for (const id of ids) {
        await assignCategoriesBySlugs(id, [value], actor);
      }
      await addActivityForLeads(ids, actor, "lead.bulk.category.add", { category_slug: value });
    } else {
      return NextResponse.redirect(new URL(`${returnTo}?error=invalid-bulk-action`, req.url));
    }
  } catch (error) {
    console.error("[leadops] bulk action failed", error);
    return NextResponse.redirect(new URL(`${returnTo}?error=bulk-failed`, req.url));
  }

  return NextResponse.redirect(new URL(`${returnTo}?saved=1`, req.url));
}
