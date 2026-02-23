import Link from "next/link";
import { fetchSources } from "@/lib/leadops";
import { supabaseRestRequest } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

type SourceRow = Awaited<ReturnType<typeof fetchSources>>[number] & {
  active?: boolean;
  source_kind?: string;
  health_notes?: string | null;
  updated_at?: string;
  created_at?: string;
};

async function fetchSourceRows(): Promise<SourceRow[]> {
  return supabaseRestRequest<SourceRow[]>({
    schema: "leadops",
    path: "sources?select=id,created_at,updated_at,source_project,source_channel,source_key,display_name,scoring_profile,source_kind,active,last_seen_at,health_status,health_notes&order=source_project.asc,source_channel.asc",
  });
}

export default async function LeadOpsSourcesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : "";
  const sources = await fetchSourceRows();

  return (
    <main className="pageWrap adminWrap leadopsPage">
      <div className="adminHeader">
        <div>
          <p className="adminEyebrow">WalkPerro Admin</p>
          <h1 className="pageTitle">Lead Sources</h1>
          <p className="pageMuted">Register and manage source definitions, scoring profiles, and health statuses for all projects.</p>
        </div>
        <div className="wpHeroActions">
          <Link href="/admin/leadops" className="wpBtnSecondary">Back to LeadOps</Link>
        </div>
      </div>

      {saved ? <p className="adminNotice adminNoticeOk">Source saved.</p> : null}
      {error ? <p className="adminNotice adminNoticeErr">Error: {error}</p> : null}

      <section className="card">
        <div className="card-inner leadopsPanel">
          <p className="leadopsPanelTitle">Add Source</p>
          <form method="post" action="/admin/api/leadops/sources" className="leadopsCategoryGrid">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="return_to" value="/admin/leadops/sources" />
            <label><span>Project</span><input name="source_project" className="wpInput" placeholder="walkperro / fozzies" required /></label>
            <label><span>Channel</span><input name="source_channel" className="wpInput" placeholder="website-form / referral / instagram" required /></label>
            <label><span>Display Name</span><input name="display_name" className="wpInput" placeholder="Fozzies Homepage Form" required /></label>
            <label><span>Scoring Profile</span><input name="scoring_profile" className="wpInput" defaultValue="generic-v1" /></label>
            <label><span>Source Kind</span><input name="source_kind" className="wpInput" defaultValue="website-form" /></label>
            <label><span>Active</span><select name="active" defaultValue="true"><option value="true">true</option><option value="false">false</option></select></label>
            <button className="wpBtnPrimary" type="submit">Create Source</button>
          </form>
        </div>
      </section>

      <section className="leadopsCategoryList">
        {sources.map((source) => (
          <article key={source.id} className="card">
            <div className="card-inner leadopsPanel">
              <div className="leadopsSourceEditHead">
                <div>
                  <strong>{source.display_name}</strong>
                  <p className="muted2">{source.source_project} / {source.source_channel}</p>
                </div>
                <span className="adminBadge">Last seen {source.last_seen_at ? new Date(source.last_seen_at).toLocaleString() : "never"}</span>
              </div>
              <form method="post" action="/admin/api/leadops/sources" className="leadopsCategoryGrid">
                <input type="hidden" name="mode" value="update" />
                <input type="hidden" name="id" value={source.id} />
                <input type="hidden" name="return_to" value="/admin/leadops/sources" />
                <label><span>Project</span><input name="source_project" className="wpInput" defaultValue={source.source_project} /></label>
                <label><span>Channel</span><input name="source_channel" className="wpInput" defaultValue={source.source_channel} /></label>
                <label><span>Display Name</span><input name="display_name" className="wpInput" defaultValue={source.display_name} /></label>
                <label><span>Scoring Profile</span><input name="scoring_profile" className="wpInput" defaultValue={source.scoring_profile} /></label>
                <label><span>Health Status</span><select name="health_status" defaultValue={source.health_status}><option value="healthy">healthy</option><option value="warning">warning</option><option value="stale">stale</option><option value="unknown">unknown</option></select></label>
                <label><span>Active</span><select name="active" defaultValue={String(source.active ?? true)}><option value="true">true</option><option value="false">false</option></select></label>
                <label><span>Source Kind</span><input name="source_kind" className="wpInput" defaultValue={source.source_kind || "website-form"} /></label>
                <label className="leadopsSpan2"><span>Health Notes</span><input name="health_notes" className="wpInput" defaultValue={source.health_notes || ""} /></label>
                <button className="wpBtnPrimary" type="submit">Save Source</button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
