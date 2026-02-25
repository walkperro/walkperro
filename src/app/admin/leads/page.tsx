import Link from "next/link";
import AdminErrorState from "@/components/admin/AdminErrorState";
import { getSupabaseServerConfig } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ViewMode = "hot" | "queue" | "reviewed";

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website_url: string | null;
  location: string | null;
  message: string;
  intent: string;
  timeline: string;
  scope: string;
  growth_flags: string[];
  project_budget_range: string;
  monthly_marketing_spend_range: string;
  open_to_ads_if_roi_clear: boolean;
  monthly_revenue_range: string | null;
  decision_maker: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  score: number;
  priority: "low" | "medium" | "high";
  tags: string[];
  status: "new" | "contacted" | "won" | "lost";
  notes: string | null;
  classification_reviewed_at: string | null;
  classification_review: string | null;
  classification_reviewer: string | null;
  classification_review_notes: string | null;
};

const views: Array<{ id: ViewMode; label: string; hint: string }> = [
  { id: "hot", label: "High Priority", hint: "All score-qualified hot leads" },
  { id: "queue", label: "Review Queue", hint: "Medium/low leads awaiting classification review" },
  { id: "reviewed", label: "Reviewed", hint: "Medium/low leads after classification review" },
];

function getActiveView(value?: string): ViewMode {
  if (value === "queue" || value === "reviewed" || value === "hot") return value;
  return "hot";
}

function buildFilter(view: ViewMode) {
  if (view === "hot") return "priority=eq.high";
  if (view === "queue") {
    return [
      "or=(priority.eq.low,priority.eq.medium)",
      "classification_reviewed_at=is.null",
    ].join("&");
  }
  return [
    "or=(priority.eq.low,priority.eq.medium)",
    "classification_reviewed_at=not.is.null",
  ].join("&");
}

async function fetchLeads(view: ViewMode) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseServerConfig();
  const select = [
    "id",
    "created_at",
    "name",
    "email",
    "phone",
    "company",
    "website_url",
    "location",
    "message",
    "intent",
    "timeline",
    "scope",
    "growth_flags",
    "project_budget_range",
    "monthly_marketing_spend_range",
    "open_to_ads_if_roi_clear",
    "monthly_revenue_range",
    "decision_maker",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "referrer",
    "score",
    "priority",
    "tags",
    "status",
    "notes",
    "classification_reviewed_at",
    "classification_review",
    "classification_reviewer",
    "classification_review_notes",
  ].join(",");

  const query = `${supabaseUrl}/rest/v1/leads?select=${encodeURIComponent(select)}&${buildFilter(view)}&order=score.desc,created_at.desc&limit=100`;
  let res: Response;
  try {
    res = await fetch(query, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Accept-Profile": "walkperro",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Supabase leads request network error: ${detail}`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load leads (${res.status}): ${text}`);
  }

  return (await res.json()) as LeadRow[];
}

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function badgeClass(priority: LeadRow["priority"]) {
  if (priority === "high") return "adminBadge adminBadgeHigh";
  if (priority === "medium") return "adminBadge adminBadgeMedium";
  return "adminBadge adminBadgeLow";
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const view = getActiveView(typeof params.view === "string" ? params.view : undefined);
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : "";

  let leads: LeadRow[] = [];
  let loadError = "";

  try {
    leads = await fetchLeads(view);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load leads.";
  }

  return (
    <main className="pageWrap adminWrap">
      <div className="adminHeader">
        <div>
          <p className="adminEyebrow">WalkPerro Admin</p>
          <h1 className="pageTitle">Lead Inbox</h1>
          <p className="pageMuted">
            Hot leads are always visible. Medium/low leads appear in Reviewed after classification review.
          </p>
        </div>
        <Link href="/" className="wpBtnSecondary">
          Back to site
        </Link>
      </div>

      <div className="adminTabs" role="tablist" aria-label="Lead views">
        {views.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/leads?view=${tab.id}`}
            className={view === tab.id ? "adminTab adminTabActive" : "adminTab"}
          >
            <span>{tab.label}</span>
            <small>{tab.hint}</small>
          </Link>
        ))}
      </div>

      {saved ? <p className="adminNotice adminNoticeOk">Classification review saved.</p> : null}
      {error ? <p className="adminNotice adminNoticeErr">Action error: {error}</p> : null}
      {loadError ? <p className="adminNotice adminNoticeErr">{loadError}</p> : null}

      {loadError ? <AdminErrorState title="Leads inbox could not load" message={loadError} /> : null}

      <section className="adminLeadList">
        {!loadError && leads.length === 0 ? (
          <div className="card">
            <div className="card-inner adminEmpty">No leads in this view.</div>
          </div>
        ) : null}

        {!loadError &&
          leads.map((lead) => (
          <article key={lead.id} className="card adminLeadCard">
            <div className="card-inner adminLeadInner">
              <div className="adminLeadTop">
                <div>
                  <div className="adminLeadTitleRow">
                    <h2 className="adminLeadTitle">{lead.name}</h2>
                    <span className={badgeClass(lead.priority)}>{lead.priority}</span>
                    <span className="adminBadge adminBadgeScore">Score {lead.score}</span>
                    <span className="adminBadge">{lead.status}</span>
                  </div>
                  <p className="adminLeadMeta">
                    {lead.company || "No company"} · {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                    {lead.location ? ` · ${lead.location}` : ""}
                  </p>
                </div>
                <p className="adminLeadDate">{fmtDate(lead.created_at)}</p>
              </div>

              <div className="adminGrid">
                <div className="pill adminPill">
                  <p><strong>Intent:</strong> {lead.intent}</p>
                  <p><strong>Timeline:</strong> {lead.timeline}</p>
                  <p><strong>Scope:</strong> {lead.scope}</p>
                  <p><strong>Budget:</strong> {lead.project_budget_range}</p>
                  <p><strong>Marketing spend:</strong> {lead.monthly_marketing_spend_range}</p>
                  <p><strong>Revenue:</strong> {lead.monthly_revenue_range || "N/A"}</p>
                  <p><strong>Decision maker:</strong> {lead.decision_maker ? "Yes" : "No"}</p>
                  <p><strong>Open to ads:</strong> {lead.open_to_ads_if_roi_clear ? "Yes" : "No"}</p>
                </div>

                <div className="pill adminPill">
                  <p><strong>Website:</strong> {lead.website_url || "N/A"}</p>
                  <p><strong>Growth flags:</strong> {lead.growth_flags?.join(", ") || "None"}</p>
                  <p><strong>Tags:</strong> {lead.tags?.join(", ") || "None"}</p>
                  <p><strong>Referrer:</strong> {lead.referrer || "N/A"}</p>
                  <p>
                    <strong>UTM:</strong> {[lead.utm_source, lead.utm_medium, lead.utm_campaign]
                      .filter(Boolean)
                      .join(" / ") || "N/A"}
                  </p>
                </div>
              </div>

              <div className="adminMessage">
                <p className="adminBlockLabel">Message</p>
                <p>{lead.message}</p>
              </div>

              {lead.classification_reviewed_at ? (
                <div className="adminReviewBlock">
                  <p className="adminBlockLabel">Classification Review</p>
                  <p>
                    {lead.classification_review || "reviewed"} by {lead.classification_reviewer || "admin"} on{" "}
                    {fmtDate(lead.classification_reviewed_at)}
                  </p>
                  {lead.classification_review_notes ? <p>{lead.classification_review_notes}</p> : null}
                </div>
              ) : null}

              {view !== "reviewed" ? (
                <form className="adminReviewForm" method="post" action="/admin/api/leads/review">
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="return_view" value={view} />

                  <label>
                    <span>Classification review</span>
                    <select name="classification_review" defaultValue={lead.priority === "high" ? "qualified" : "nurture"}>
                      <option value="qualified">Qualified</option>
                      <option value="nurture">Nurture</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="disqualify">Disqualify</option>
                    </select>
                  </label>

                  <label>
                    <span>Status</span>
                    <select name="status" defaultValue={lead.status}>
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="won">won</option>
                      <option value="lost">lost</option>
                    </select>
                  </label>

                  <label>
                    <span>Priority override</span>
                    <select name="priority" defaultValue="keep">
                      <option value="keep">Keep current ({lead.priority})</option>
                      <option value="high">high</option>
                      <option value="medium">medium</option>
                      <option value="low">low</option>
                    </select>
                  </label>

                  <label className="adminReviewNotes">
                    <span>Review notes (optional)</span>
                    <textarea name="classification_review_notes" rows={3} placeholder="Why this classification?" />
                  </label>

                  <button className="wpBtnPrimary" type="submit">Save review</button>
                </form>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
