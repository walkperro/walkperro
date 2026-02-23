import { NextRequest, NextResponse } from "next/server";
import { actorFromBasicAuth, logLeadActivity } from "@/lib/leadops";
import { supabaseRestRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const mode = String(form.get("mode") || "create").trim();
  const returnTo = String(form.get("return_to") || "/admin/leadops/categories").trim();
  const actor = actorFromBasicAuth(req.headers.get("authorization"));

  try {
    if (mode === "create") {
      const kind = String(form.get("kind") || "custom").trim();
      const label = String(form.get("label") || "").trim();
      const slug = slugify(String(form.get("slug") || label));
      const color = String(form.get("color") || "").trim() || null;
      const description = String(form.get("description") || "").trim() || null;
      if (!label || !slug) throw new Error("Missing label/slug");
      await supabaseRestRequest({
        schema: "leadops",
        method: "POST",
        path: "categories",
        body: { kind, label, slug, color, description },
        prefer: "return=minimal",
      });
      await logLeadActivity(null, "category.created", actor, { kind, label, slug });
    } else if (mode === "update") {
      const id = String(form.get("id") || "").trim();
      if (!id) throw new Error("Missing category id");
      const patch = {
        kind: String(form.get("kind") || "custom").trim(),
        label: String(form.get("label") || "").trim(),
        slug: slugify(String(form.get("slug") || "").trim()),
        color: String(form.get("color") || "").trim() || null,
        description: String(form.get("description") || "").trim() || null,
        active: String(form.get("active") || "true").trim() === "true",
        sort_order: Number(form.get("sort_order") || 0) || 0,
        updated_at: new Date().toISOString(),
      };
      await supabaseRestRequest({
        schema: "leadops",
        method: "PATCH",
        path: `categories?id=eq.${encodeURIComponent(id)}`,
        body: patch,
        prefer: "return=minimal",
      });
      await logLeadActivity(null, "category.updated", actor, { id, ...patch });
    } else {
      throw new Error("Invalid mode");
    }
  } catch (error) {
    console.error("[leadops] category save failed", error);
    return NextResponse.redirect(new URL(`${returnTo}?error=save-failed`, req.url));
  }

  return NextResponse.redirect(new URL(`${returnTo}?saved=1`, req.url));
}
