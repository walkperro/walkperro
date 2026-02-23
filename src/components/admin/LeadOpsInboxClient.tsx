"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { LeadOpsCategory, LeadOpsLeadWithCategories, LeadOpsSavedView, LeadOpsSource } from "@/lib/leadops";

type FilterState = Record<string, string>;

type Metrics = { hot: number; total: number; unreviewed: number; overdueFollowups: number };

type SourceHealth = LeadOpsSource & { ageHours: number | null; computedHealth: string };

type Activity = { id: string; created_at: string; actor: string | null; action: string; detail: Record<string, unknown>; lead_id: string | null };

type DuplicateGroup = { key: string; leads: Array<Pick<LeadOpsLeadWithCategories, "id" | "contact_name" | "contact_email" | "company" | "score" | "priority" | "created_at">> };

function fmtDate(iso?: string | null) {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function fmtAge(createdAt: string) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const hrs = Math.floor(diffMs / 36e5);
  if (hrs < 1) return "<1h";
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function withQuery(base: string, filters: FilterState) {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) p.set(k, v);
  });
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

export default function LeadOpsInboxClient({
  leads,
  categories,
  sources,
  savedViews,
  metrics,
  sourceHealth,
  activities,
  duplicateGroups,
  filters,
  basePath,
}: {
  leads: LeadOpsLeadWithCategories[];
  categories: LeadOpsCategory[];
  sources: LeadOpsSource[];
  savedViews: LeadOpsSavedView[];
  metrics: Metrics;
  sourceHealth: SourceHealth[];
  activities: Activity[];
  duplicateGroups: DuplicateGroup[];
  filters: FilterState;
  basePath: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showOpsPanels, setShowOpsPanels] = useState(true);
  const [nowTs] = useState(() => Date.now());

  const categoryOptions = useMemo(() => categories.filter((c) => c.active), [categories]);
  const industryOptions = useMemo(() => categories.filter((c) => c.kind === "industry" && c.active), [categories]);
  const leadTypeOptions = useMemo(() => categories.filter((c) => c.kind === "lead_type" && c.active), [categories]);
  const sourceProjects = useMemo(
    () => Array.from(new Set(sources.map((s) => s.source_project))).sort(),
    [sources],
  );
  const sourceChannels = useMemo(
    () => Array.from(new Set(sources.map((s) => s.source_channel))).sort(),
    [sources],
  );

  const selectedCsv = selectedIds.join(",");

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAll() {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(leads.map((l) => l.id));
  }

  function selectedLabel() {
    if (!selectedIds.length) return "No leads selected";
    return `${selectedIds.length} selected`;
  }

  return (
    <div className="leadopsShell">
      <div className="leadopsTopBar">
        <div className="leadopsMetricRow">
          <MetricCard label="Total Leads" value={String(metrics.total)} hint="All active leads" />
          <MetricCard label="Hot" value={String(metrics.hot)} hint="High priority queue" tone="hot" />
          <MetricCard label="Needs Review" value={String(metrics.unreviewed)} hint="Classification pending" tone="warn" />
          <MetricCard label="Overdue Follow-ups" value={String(metrics.overdueFollowups)} hint="SLA attention" tone="warn" />
        </div>

        <div className="leadopsTopActions">
          <a className="wpBtnSecondary" href={withQuery("/admin/api/leadops/export", filters)}>
            Download CSV
          </a>
          <a className="wpBtnSecondary" href="/admin/leadops/categories">
            Manage Categories
          </a>
          <a className="wpBtnSecondary" href="/admin/leadops/sources">
            Manage Sources
          </a>
          <button type="button" className="wpBtnGhost" onClick={() => setShowOpsPanels((v) => !v)}>
            {showOpsPanels ? "Hide Ops Panels" : "Show Ops Panels"}
          </button>
        </div>
      </div>

      <div className="leadopsLayout">
        <motion.aside layout className="leadopsSidebar">
          <section className="card">
            <div className="card-inner leadopsPanel">
              <p className="leadopsPanelTitle">Filters</p>
              <form method="get" action={basePath} className="leadopsFilterForm">
                <label>
                  <span>Search</span>
                  <input name="q" defaultValue={filters.q || ""} className="wpInput" placeholder="name, email, company..." />
                </label>
                <div className="leadopsFilterGrid2">
                  <label>
                    <span>Source project</span>
                    <select name="source_project" defaultValue={filters.source_project || ""}>
                      <option value="">All</option>
                      {sourceProjects.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Channel</span>
                    <select name="source_channel" defaultValue={filters.source_channel || ""}>
                      <option value="">All</option>
                      {sourceChannels.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                </div>
                <div className="leadopsFilterGrid2">
                  <label>
                    <span>Industry</span>
                    <select name="industry" defaultValue={filters.industry || ""}>
                      <option value="">All</option>
                      {industryOptions.map((c) => <option key={c.id} value={c.slug}>{c.label}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Lead type</span>
                    <select name="lead_type" defaultValue={filters.lead_type || ""}>
                      <option value="">All</option>
                      {leadTypeOptions.map((c) => <option key={c.id} value={c.slug}>{c.label}</option>)}
                    </select>
                  </label>
                </div>
                <div className="leadopsFilterGrid2">
                  <label>
                    <span>Priority</span>
                    <select name="priority" defaultValue={filters.priority || ""}>
                      <option value="">All</option>
                      <option value="high">high</option>
                      <option value="medium">medium</option>
                      <option value="low">low</option>
                    </select>
                  </label>
                  <label>
                    <span>Status</span>
                    <select name="status" defaultValue={filters.status || ""}>
                      <option value="">All</option>
                      {[
                        "new","contacted","won","lost","archived"
                      ].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                </div>
                <div className="leadopsFilterGrid2">
                  <label>
                    <span>Stage</span>
                    <select name="stage" defaultValue={filters.stage || ""}>
                      <option value="">All</option>
                      {[
                        "new","reviewed","contacted","qualified","proposal","won","lost","nurture","merged"
                      ].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Reviewed</span>
                    <select name="reviewed" defaultValue={filters.reviewed || ""}>
                      <option value="">All</option>
                      <option value="yes">yes</option>
                      <option value="no">no</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>Category</span>
                  <select name="category_slug" defaultValue={filters.category_slug || ""}>
                    <option value="">All</option>
                    {categoryOptions.map((c) => <option key={c.id} value={c.slug}>{c.kind}: {c.label}</option>)}
                  </select>
                </label>
                <div className="leadopsFilterGrid2">
                  <label>
                    <span>Owner</span>
                    <input name="owner" defaultValue={filters.owner || ""} className="wpInput" />
                  </label>
                  <label>
                    <span>Assignee</span>
                    <input name="assignee" defaultValue={filters.assignee || ""} className="wpInput" />
                  </label>
                </div>
                <div className="leadopsFilterChecks">
                  <label><input type="checkbox" name="hot_today" value="1" defaultChecked={filters.hot_today === "1"} /> Hot today</label>
                  <label><input type="checkbox" name="overdue_followups" value="1" defaultChecked={filters.overdue_followups === "1"} /> Overdue follow-ups</label>
                </div>
                <div className="leadopsPanelActions">
                  <button className="wpBtnPrimary" type="submit">Apply Filters</button>
                  <a className="wpBtnGhost" href={basePath}>Reset</a>
                </div>
              </form>
            </div>
          </section>

          <section className="card">
            <div className="card-inner leadopsPanel">
              <p className="leadopsPanelTitle">Saved Views</p>
              <div className="leadopsSavedList">
                {savedViews.length === 0 ? <p className="muted2">No saved views yet.</p> : null}
                {savedViews.map((view) => (
                  <div key={view.id} className="leadopsSavedItem">
                    <a href={withQuery(basePath, Object.fromEntries(Object.entries(view.filters || {}).map(([k, v]) => [k, String(v ?? "")])))}>
                      {view.name}
                    </a>
                    <form method="post" action="/admin/api/leadops/saved-views">
                      <input type="hidden" name="mode" value="delete" />
                      <input type="hidden" name="id" value={view.id} />
                      <input type="hidden" name="return_to" value={basePath} />
                      <button type="submit" className="leadopsInlineBtn">Delete</button>
                    </form>
                  </div>
                ))}
              </div>
              <details className="leadopsDetails">
                <summary>Save current filters</summary>
                <form method="post" action="/admin/api/leadops/saved-views" className="leadopsMiniForm">
                  <input type="hidden" name="mode" value="create" />
                  <input type="hidden" name="return_to" value={basePath} />
                  <input type="hidden" name="filters_json" value={JSON.stringify(filters)} />
                  <label><span>Name</span><input name="name" className="wpInput" required /></label>
                  <label><span>Slug (optional)</span><input name="slug" className="wpInput" /></label>
                  <label><span>Pinned</span><select name="pinned"><option value="false">No</option><option value="true">Yes</option></select></label>
                  <button className="wpBtnPrimary" type="submit">Save View</button>
                </form>
              </details>
            </div>
          </section>

          <section className="card">
            <div className="card-inner leadopsPanel">
              <p className="leadopsPanelTitle">Bulk Actions</p>
              <p className="leadopsMetaLine">{selectedLabel()}</p>
              <div className="leadopsPanelActions">
                <button className="wpBtnGhost" type="button" onClick={toggleAll}>{selectedIds.length === leads.length ? "Clear All" : "Select All"}</button>
              </div>
              <form method="post" action="/admin/api/leadops/leads/bulk" className="leadopsMiniForm">
                <input type="hidden" name="ids" value={selectedCsv} />
                <input type="hidden" name="return_to" value={withQuery(basePath, filters)} />
                <label><span>Action</span>
                  <select name="action" defaultValue="set-status">
                    <option value="set-status">Set status</option>
                    <option value="set-stage">Set stage</option>
                    <option value="assign-owner">Assign owner</option>
                    <option value="assign-assignee">Assign assignee</option>
                    <option value="set-followup">Set follow-up</option>
                    <option value="add-category">Add category</option>
                  </select>
                </label>
                <label><span>Value</span><input name="value" className="wpInput" placeholder="e.g. contacted / medspa / Jane" /></label>
                <button type="submit" className="wpBtnPrimary" disabled={!selectedIds.length}>Run Bulk Action</button>
              </form>
            </div>
          </section>
        </motion.aside>

        <section className="leadopsMain">
          <AnimatePresence mode="popLayout">
            <motion.div layout className="leadopsCards" key={`${filters.q || ''}-${leads.length}`}>
              {leads.length === 0 ? (
                <div className="card"><div className="card-inner adminEmpty">No leads match these filters.</div></div>
              ) : null}

              {leads.map((lead, index) => {
                const cats = (lead.lead_category_links || []).map((l) => l.category).filter(Boolean) as LeadOpsCategory[];
                const slaAged = lead.status === "new" && (nowTs - new Date(lead.created_at).getTime()) > 24 * 36e5;
                const overdue = !!lead.follow_up_at && new Date(lead.follow_up_at).getTime() < nowTs && !["won", "lost", "archived"].includes(lead.status);
                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16, delay: Math.min(index * 0.012, 0.12) }}
                    key={lead.id}
                    className="card leadopsLeadCard"
                  >
                    <div className="card-inner leadopsLeadInner">
                      <div className="leadopsLeadHead">
                        <label className="leadopsCheckbox">
                          <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelect(lead.id)} />
                        </label>
                        <div className="leadopsLeadTitleWrap">
                          <div className="adminLeadTitleRow">
                            <h2 className="adminLeadTitle">{lead.contact_name || lead.company || "Unknown lead"}</h2>
                            <span className={`adminBadge ${lead.priority === "high" ? "adminBadgeHigh" : lead.priority === "medium" ? "adminBadgeMedium" : "adminBadgeLow"}`}>{lead.priority}</span>
                            <span className="adminBadge adminBadgeScore">Score {lead.score}</span>
                            <span className="adminBadge">{lead.status}</span>
                            <span className="adminBadge">{lead.stage}</span>
                            {slaAged ? <span className="adminBadge leadopsBadgeDanger">SLA {fmtAge(lead.created_at)}</span> : <span className="adminBadge">Age {fmtAge(lead.created_at)}</span>}
                            {overdue ? <span className="adminBadge leadopsBadgeDanger">Follow-up overdue</span> : null}
                            {lead.spam_confidence !== "low" ? <span className="adminBadge leadopsBadgeWarn">Spam {lead.spam_confidence}</span> : null}
                          </div>
                          <p className="adminLeadMeta">
                            {lead.source_project} / {lead.source_channel}
                            {lead.company ? ` · ${lead.company}` : ""}
                            {lead.contact_email ? ` · ${lead.contact_email}` : ""}
                            {lead.contact_phone ? ` · ${lead.contact_phone}` : ""}
                            {lead.location ? ` · ${lead.location}` : ""}
                          </p>
                        </div>
                        <div className="leadopsLeadDates">
                          <p>{fmtDate(lead.created_at)}</p>
                          <p className="muted2">Updated {fmtDate(lead.updated_at)}</p>
                        </div>
                      </div>

                      <div className="leadopsMetaGrid">
                        <div className="pill adminPill">
                          <p><strong>Industry:</strong> {lead.industry || "-"}</p>
                          <p><strong>Lead type:</strong> {lead.lead_type || "-"}</p>
                          <p><strong>Owner:</strong> {lead.owner || "-"}</p>
                          <p><strong>Assignee:</strong> {lead.assignee || "-"}</p>
                          <p><strong>Follow-up:</strong> {fmtDate(lead.follow_up_at)}</p>
                          <p><strong>Review:</strong> {lead.classification_review || (lead.classification_reviewed_at ? "reviewed" : "pending")}</p>
                          <p><strong>Enrichment:</strong> {lead.enrichment_status}</p>
                        </div>
                        <div className="pill adminPill">
                          <p><strong>Website:</strong> {lead.website_url || "-"}</p>
                          <p><strong>UTM:</strong> {[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ") || "-"}</p>
                          <p><strong>Referrer:</strong> {lead.referrer || "-"}</p>
                          <p><strong>Spam score:</strong> {lead.spam_score} ({lead.spam_confidence})</p>
                          <p><strong>Source lead ID:</strong> {lead.source_lead_id || "-"}</p>
                          <p><strong>Duplicate key:</strong> {lead.duplicate_group_key || "-"}</p>
                        </div>
                      </div>

                      {cats.length ? (
                        <div className="leadopsTagWrap">
                          {cats.map((cat) => (
                            <span key={cat.id} className="wpChipMuted">{cat.kind}: {cat.label}</span>
                          ))}
                        </div>
                      ) : null}
                      {lead.tags?.length ? (
                        <div className="leadopsTagWrap">
                          {lead.tags.map((tag) => <span key={tag} className="wpChipMuted">{tag}</span>)}
                        </div>
                      ) : null}

                      {lead.message ? (
                        <div className="adminMessage">
                          <p className="adminBlockLabel">Message</p>
                          <p>{lead.message}</p>
                        </div>
                      ) : null}

                      <details className="leadopsDetails">
                        <summary>Review / update lead</summary>
                        <form method="post" action="/admin/api/leadops/leads/update" className="leadopsUpdateForm">
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="return_to" value={withQuery(basePath, filters)} />
                          <label><span>Status</span><select name="status" defaultValue={lead.status}>{["new","contacted","won","lost","archived"].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
                          <label><span>Stage</span><select name="stage" defaultValue={lead.stage}>{["new","reviewed","contacted","qualified","proposal","won","lost","nurture","merged"].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
                          <label><span>Priority</span><select name="priority" defaultValue={lead.priority}>{["high","medium","low"].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
                          <label><span>Owner</span><input name="owner" className="wpInput" defaultValue={lead.owner || ""} /></label>
                          <label><span>Assignee</span><input name="assignee" className="wpInput" defaultValue={lead.assignee || ""} /></label>
                          <label><span>Follow-up</span><input name="follow_up_at" type="datetime-local" className="wpInput" defaultValue={lead.follow_up_at ? new Date(new Date(lead.follow_up_at).getTime() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,16) : ""} /></label>
                          <label><span>Classification review</span><select name="classification_review" defaultValue={lead.classification_review || "nurture"}>{["qualified","nurture","follow-up","disqualify"].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
                          <label><span>Category slugs (comma-separated)</span><input name="category_slugs" className="wpInput" defaultValue={cats.map((c) => c.slug).join(", ")} /></label>
                          <label className="leadopsSpan2"><span>Review notes</span><textarea name="classification_review_notes" rows={2} defaultValue={lead.classification_review_notes || ""} /></label>
                          <label className="leadopsSpan2"><span>Internal notes</span><textarea name="internal_notes" rows={2} defaultValue={lead.internal_notes || ""} /></label>
                          <label><span>Enrichment status</span><select name="enrichment_status" defaultValue={lead.enrichment_status}>{["not-started","queued","in-progress","done","skipped"].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
                          <label className="leadopsSpan2"><span>Enrichment notes</span><textarea name="enrichment_notes" rows={2} defaultValue={lead.enrichment_notes || ""} /></label>
                          <button className="wpBtnPrimary" type="submit">Save Lead</button>
                        </form>
                      </details>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {showOpsPanels ? (
        <div className="leadopsBottomGrid">
          <section className="card"><div className="card-inner leadopsPanel"><p className="leadopsPanelTitle">Source Health Alerts</p>
            <div className="leadopsSourceHealthList">
              {sourceHealth.map((s) => (
                <div key={s.id} className="leadopsSourceHealthItem">
                  <div>
                    <strong>{s.display_name}</strong>
                    <p className="muted2">{s.source_project} / {s.source_channel}</p>
                  </div>
                  <div className="leadopsSourceHealthMeta">
                    <span className={`adminBadge ${s.computedHealth === "healthy" ? "" : s.computedHealth === "warning" ? "leadopsBadgeWarn" : "leadopsBadgeDanger"}`}>{s.computedHealth}</span>
                    <small>{s.ageHours == null ? "No traffic yet" : `${Math.round(s.ageHours)}h since last lead`}</small>
                  </div>
                </div>
              ))}
            </div>
          </div></section>

          <section className="card"><div className="card-inner leadopsPanel"><p className="leadopsPanelTitle">Hot Today Queue</p>
            <div className="leadopsMiniList">
              {leads.filter((l) => l.priority === "high").slice(0, 6).map((lead) => (
                <a key={lead.id} href={withQuery(basePath, { ...filters, hot_today: "1" })} className="leadopsMiniRow">
                  <span>{lead.contact_name || lead.company || lead.id.slice(0, 8)}</span>
                  <span>Score {lead.score}</span>
                </a>
              ))}
              {!leads.some((l) => l.priority === "high") ? <p className="muted2">No hot leads in current result set.</p> : null}
            </div>
          </div></section>

          <section className="card"><div className="card-inner leadopsPanel"><p className="leadopsPanelTitle">Possible Duplicates</p>
            <div className="leadopsDupes">
              {duplicateGroups.length === 0 ? <p className="muted2">No duplicate groups detected.</p> : null}
              {duplicateGroups.map((group) => {
                const primary = group.leads[0];
                return (
                  <div key={group.key} className="leadopsDupeGroup">
                    <p className="leadopsMetaLine">Key: {group.key}</p>
                    {group.leads.map((lead, idx) => (
                      <div key={lead.id} className="leadopsDupeRow">
                        <div>
                          <strong>{lead.contact_name || lead.company || lead.id.slice(0, 8)}</strong>
                          <p className="muted2">{lead.contact_email || "no email"} · score {lead.score}</p>
                        </div>
                        {idx > 0 ? (
                          <form method="post" action="/admin/api/leadops/leads/merge">
                            <input type="hidden" name="primary_id" value={primary.id} />
                            <input type="hidden" name="merge_id" value={lead.id} />
                            <input type="hidden" name="return_to" value={withQuery(basePath, filters)} />
                            <button className="leadopsInlineBtn" type="submit">Merge into top</button>
                          </form>
                        ) : <span className="adminBadge">Primary</span>}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div></section>

          <section className="card"><div className="card-inner leadopsPanel"><p className="leadopsPanelTitle">Recent Activity</p>
            <div className="leadopsActivityList">
              {activities.map((a) => (
                <div key={a.id} className="leadopsActivityRow">
                  <div>
                    <strong>{a.action}</strong>
                    <p className="muted2">{a.actor || "system"} · {fmtDate(a.created_at)}</p>
                  </div>
                  {a.lead_id ? <code className="leadopsCode">{a.lead_id.slice(0, 8)}</code> : null}
                </div>
              ))}
              {activities.length === 0 ? <p className="muted2">No activity yet.</p> : null}
            </div>
          </div></section>
        </div>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value, hint, tone }: { label: string; value: string; hint: string; tone?: "hot" | "warn" }) {
  return (
    <motion.div layout className={`leadopsMetricCard${tone ? ` leadopsMetricCard-${tone}` : ""}`}>
      <p className="leadopsMetricLabel">{label}</p>
      <p className="leadopsMetricValue">{value}</p>
      <p className="leadopsMetricHint">{hint}</p>
    </motion.div>
  );
}
