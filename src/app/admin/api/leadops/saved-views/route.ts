import { NextRequest, NextResponse } from "next/server";
import { actorFromBasicAuth, logLeadActivity } from "@/lib/leadops";
import { supabaseRestRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const returnTo = String(form.get("return_to") || "/admin/leadops").trim();
  const actor = actorFromBasicAuth(req.headers.get("authorization"));
  const mode = String(form.get("mode") || "create").trim();

  try {
    if (mode === "create") {
      const name = String(form.get("name") || "").trim();
      const slug = slugify(String(form.get("slug") || name));
      const filtersRaw = String(form.get("filters_json") || "{}");
      const pinned = String(form.get("pinned") || "false") === "true";
      const filters = JSON.parse(filtersRaw) as Record<string, unknown>;
      await supabaseRestRequest({
        schema: "leadops",
        method: "POST",
        path: "saved_views",
        body: { name, slug, owner: actor, filters, pinned },
        prefer: "return=minimal",
      });
      await logLeadActivity(null, "saved_view.created", actor, { name, slug, filters });
    } else if (mode === "delete") {
      const id = String(form.get("id") || "").trim();
      await supabaseRestRequest({
        schema: "leadops",
        method: "DELETE",
        path: `saved_views?id=eq.${encodeURIComponent(id)}`,
        prefer: "return=minimal",
      });
      await logLeadActivity(null, "saved_view.deleted", actor, { id });
    } else {
      throw new Error("Invalid mode");
    }
  } catch (error) {
    console.error("[leadops] saved view action failed", error);
    return NextResponse.redirect(new URL(`${returnTo}?error=saved-view-failed`, req.url));
  }

  return NextResponse.redirect(new URL(`${returnTo}?saved=1`, req.url));
}
