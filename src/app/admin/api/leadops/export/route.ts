import { NextRequest, NextResponse } from "next/server";
import { fetchLeadOpsLeads, leadsToCsv, logLeadActivity, type LeadOpsFilter } from "@/lib/leadops";
import { actorFromBasicAuth } from "@/lib/leadops";
import { supabaseRestRequest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

function getFilter(req: NextRequest): LeadOpsFilter {
  const p = req.nextUrl.searchParams;
  return {
    q: p.get("q") || "",
    source_project: p.get("source_project") || "",
    source_channel: p.get("source_channel") || "",
    industry: p.get("industry") || "",
    lead_type: p.get("lead_type") || "",
    priority: p.get("priority") || "",
    status: p.get("status") || "",
    stage: p.get("stage") || "",
    reviewed: (p.get("reviewed") as "yes" | "no" | null) || undefined,
    owner: p.get("owner") || "",
    assignee: p.get("assignee") || "",
    hot_today: p.get("hot_today") === "1" ? "1" : undefined,
    overdue_followups: p.get("overdue_followups") === "1" ? "1" : undefined,
    category_slug: p.get("category_slug") || "",
  };
}

export async function GET(req: NextRequest) {
  const actor = actorFromBasicAuth(req.headers.get("authorization"));
  const filter = getFilter(req);
  try {
    const leads = await fetchLeadOpsLeads(filter, 1000);
    const categorySlug = filter.category_slug;
    const filtered = categorySlug
      ? leads.filter((lead) => (lead.lead_category_links || []).some((l) => l.category?.slug === categorySlug))
      : leads;
    const csv = leadsToCsv(filtered);
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `leadops-export-${ts}.csv`;

    await supabaseRestRequest({
      schema: "leadops",
      method: "POST",
      path: "exports",
      body: { actor, export_kind: "csv", filters: filter, row_count: filtered.length, file_name: fileName },
      prefer: "return=minimal",
    });
    await logLeadActivity(null, "export.csv", actor, { row_count: filtered.length, filters: filter, file_name: fileName });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=\"${fileName}\"`,
      },
    });
  } catch (error) {
    console.error("[leadops] export failed", error);
    return NextResponse.json({ ok: false, error: "Export failed" }, { status: 500 });
  }
}
