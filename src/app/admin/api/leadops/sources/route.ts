import { NextRequest, NextResponse } from "next/server";
import { actorFromBasicAuth, logLeadActivity } from "@/lib/leadops";
import { supabaseRestRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

function sourceKey(project: string, channel: string) {
  return `${project}:${channel}`;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const mode = String(form.get("mode") || "create").trim();
  const returnTo = String(form.get("return_to") || "/admin/leadops/sources").trim();
  const actor = actorFromBasicAuth(req.headers.get("authorization"));

  try {
    if (mode === "create") {
      const source_project = String(form.get("source_project") || "").trim();
      const source_channel = String(form.get("source_channel") || "").trim();
      const display_name = String(form.get("display_name") || "").trim();
      const scoring_profile = String(form.get("scoring_profile") || "generic-v1").trim();
      const source_kind = String(form.get("source_kind") || "website-form").trim();
      const active = String(form.get("active") || "true") === "true";
      if (!source_project || !source_channel || !display_name) throw new Error("Missing source fields");
      const row = {
        source_project,
        source_channel,
        source_key: sourceKey(source_project, source_channel),
        display_name,
        scoring_profile,
        source_kind,
        active,
        health_status: "unknown",
      };
      await supabaseRestRequest({ schema: "leadops", method: "POST", path: "sources", body: row, prefer: "return=minimal" });
      await logLeadActivity(null, "source.created", actor, row);
    } else if (mode === "update") {
      const id = String(form.get("id") || "").trim();
      if (!id) throw new Error("Missing source id");
      const source_project = String(form.get("source_project") || "").trim();
      const source_channel = String(form.get("source_channel") || "").trim();
      const patch = {
        source_project,
        source_channel,
        source_key: sourceKey(source_project, source_channel),
        display_name: String(form.get("display_name") || "").trim(),
        scoring_profile: String(form.get("scoring_profile") || "generic-v1").trim(),
        source_kind: String(form.get("source_kind") || "website-form").trim(),
        active: String(form.get("active") || "true") === "true",
        health_status: String(form.get("health_status") || "unknown").trim(),
        health_notes: String(form.get("health_notes") || "").trim() || null,
        updated_at: new Date().toISOString(),
      };
      await supabaseRestRequest({
        schema: "leadops",
        method: "PATCH",
        path: `sources?id=eq.${encodeURIComponent(id)}`,
        body: patch,
        prefer: "return=minimal",
      });
      await logLeadActivity(null, "source.updated", actor, { id, ...patch });
    } else {
      throw new Error("Invalid mode");
    }
  } catch (error) {
    console.error("[leadops] source save failed", error);
    return NextResponse.redirect(new URL(`${returnTo}?error=save-failed`, req.url));
  }

  return NextResponse.redirect(new URL(`${returnTo}?saved=1`, req.url));
}
