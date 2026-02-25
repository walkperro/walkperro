import Link from "next/link";
import AdminErrorState from "@/components/admin/AdminErrorState";
import LeadOpsInboxClient from "@/components/admin/LeadOpsInboxClient";
import {
  fetchCategories,
  fetchDuplicateCandidates,
  fetchLeadOpsLeads,
  fetchLeadOpsMetrics,
  fetchRecentLeadOpsActivities,
  fetchSavedViews,
  fetchSourceHealthSummary,
  fetchSources,
  parseStringParam,
  type LeadOpsFilter,
} from "@/lib/leadops";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function pickFilters(params: Record<string, string | string[] | undefined>): LeadOpsFilter {
  const filter: LeadOpsFilter = {
    q: parseStringParam(params.q),
    source_project: parseStringParam(params.source_project),
    source_channel: parseStringParam(params.source_channel),
    industry: parseStringParam(params.industry),
    lead_type: parseStringParam(params.lead_type),
    priority: parseStringParam(params.priority),
    status: parseStringParam(params.status),
    stage: parseStringParam(params.stage),
    owner: parseStringParam(params.owner),
    assignee: parseStringParam(params.assignee),
    category_slug: parseStringParam(params.category_slug),
  };
  const reviewed = parseStringParam(params.reviewed);
  if (reviewed === "yes" || reviewed === "no") filter.reviewed = reviewed;
  if (parseStringParam(params.hot_today) === "1") filter.hot_today = "1";
  if (parseStringParam(params.overdue_followups) === "1") filter.overdue_followups = "1";
  return filter;
}

function cleanFilterObject(filter: LeadOpsFilter) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(filter)) {
    if (typeof v === "string" && v) out[k] = v;
  }
  return out;
}

export default async function LeadOpsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const incoming = pickFilters(params);
  const savedViewSlug = parseStringParam(params.saved_view);
  const saved = params.saved === "1";
  const error = parseStringParam(params.error);

  let categories: Awaited<ReturnType<typeof fetchCategories>>;
  let sources: Awaited<ReturnType<typeof fetchSources>>;
  let savedViews: Awaited<ReturnType<typeof fetchSavedViews>>;
  try {
    [categories, sources, savedViews] = await Promise.all([
      fetchCategories({ activeOnly: false, kinds: [] }),
      fetchSources(),
      fetchSavedViews(),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load admin data.";
    return (
      <main className="pageWrap adminWrap leadopsPage">
        <div className="adminHeader">
          <div>
            <p className="adminEyebrow">WalkPerro Admin</p>
            <h1 className="pageTitle">LeadOps Hub</h1>
            <p className="pageMuted">Unified lead inbox for all projects.</p>
          </div>
        </div>
        <AdminErrorState title="LeadOps could not load" message={message} />
      </main>
    );
  }

  let filter = incoming;
  if (savedViewSlug) {
    const view = savedViews.find((v) => v.slug === savedViewSlug);
    if (view && view.filters && typeof view.filters === "object") {
      filter = { ...((view.filters as Record<string, string>) || {}), ...incoming } as LeadOpsFilter;
    }
  }

  let rawLeads: Awaited<ReturnType<typeof fetchLeadOpsLeads>>;
  let metrics: Awaited<ReturnType<typeof fetchLeadOpsMetrics>>;
  let sourceHealth: Awaited<ReturnType<typeof fetchSourceHealthSummary>>;
  let activities: Awaited<ReturnType<typeof fetchRecentLeadOpsActivities>>;
  let duplicateGroups: Awaited<ReturnType<typeof fetchDuplicateCandidates>>;
  try {
    [rawLeads, metrics, sourceHealth, activities, duplicateGroups] = await Promise.all([
      fetchLeadOpsLeads(filter, 200),
      fetchLeadOpsMetrics(),
      fetchSourceHealthSummary(),
      fetchRecentLeadOpsActivities(30),
      fetchDuplicateCandidates(12),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load admin data.";
    return (
      <main className="pageWrap adminWrap leadopsPage">
        <div className="adminHeader">
          <div>
            <p className="adminEyebrow">WalkPerro Admin</p>
            <h1 className="pageTitle">LeadOps Hub</h1>
            <p className="pageMuted">Unified lead inbox for all projects.</p>
          </div>
        </div>
        <AdminErrorState title="LeadOps data fetch failed" message={message} />
      </main>
    );
  }

  const leads = filter.category_slug
    ? rawLeads.filter((lead) => (lead.lead_category_links || []).some((link) => link.category?.slug === filter.category_slug))
    : rawLeads;

  const filterState = cleanFilterObject(filter);

  return (
    <main className="pageWrap adminWrap leadopsPage">
      <div className="adminHeader">
        <div>
          <p className="adminEyebrow">WalkPerro Admin</p>
          <h1 className="pageTitle">LeadOps Hub</h1>
          <p className="pageMuted">
            Unified lead inbox for all projects with scoring, review workflow, categories, exports, and dedupe tools.
          </p>
        </div>
        <div className="wpHeroActions">
          <Link href="/admin/leads" className="wpBtnSecondary">WalkPerro-only Inbox</Link>
          <Link href="/" className="wpBtnSecondary">Back to site</Link>
        </div>
      </div>

      {saved ? <p className="adminNotice adminNoticeOk">Saved successfully.</p> : null}
      {error ? <p className="adminNotice adminNoticeErr">Error: {error}</p> : null}

      <LeadOpsInboxClient
        leads={leads}
        categories={categories}
        sources={sources}
        savedViews={savedViews}
        metrics={metrics}
        sourceHealth={sourceHealth}
        activities={activities}
        duplicateGroups={duplicateGroups}
        filters={filterState}
        basePath="/admin/leadops"
      />
    </main>
  );
}
