import Link from "next/link";
import AdminErrorState from "@/components/admin/AdminErrorState";
import { fetchCategories } from "@/lib/leadops";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LeadOpsCategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : "";
  let categories: Awaited<ReturnType<typeof fetchCategories>> = [];
  let loadError = "";
  try {
    categories = await fetchCategories({ activeOnly: false, kinds: [] });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Failed to load categories.";
  }

  return (
    <main className="pageWrap adminWrap leadopsPage">
      <div className="adminHeader">
        <div>
          <p className="adminEyebrow">WalkPerro Admin</p>
          <h1 className="pageTitle">Lead Categories</h1>
          <p className="pageMuted">Manage industry, lead type, source-channel, and custom categories used in the LeadOps hub.</p>
        </div>
        <div className="wpHeroActions">
          <Link href="/admin/leadops" className="wpBtnSecondary">Back to LeadOps</Link>
        </div>
      </div>

      {saved ? <p className="adminNotice adminNoticeOk">Category saved.</p> : null}
      {error ? <p className="adminNotice adminNoticeErr">Error: {error}</p> : null}
      {loadError ? <p className="adminNotice adminNoticeErr">{loadError}</p> : null}
      {loadError ? <AdminErrorState title="Categories could not load" message={loadError} /> : null}

      {!loadError ? <section className="card">
        <div className="card-inner leadopsPanel">
          <p className="leadopsPanelTitle">Add Category</p>
          <form method="post" action="/admin/api/leadops/categories" className="leadopsCategoryGrid">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="return_to" value="/admin/leadops/categories" />
            <label><span>Kind</span><input name="kind" className="wpInput" placeholder="industry / lead_type / custom" defaultValue="custom" /></label>
            <label><span>Label</span><input name="label" className="wpInput" required /></label>
            <label><span>Slug (optional)</span><input name="slug" className="wpInput" /></label>
            <label><span>Color (optional)</span><input name="color" className="wpInput" placeholder="#4f8cff" /></label>
            <label className="leadopsSpan2"><span>Description</span><input name="description" className="wpInput" /></label>
            <button className="wpBtnPrimary" type="submit">Create Category</button>
          </form>
        </div>
      </section> : null}

      {!loadError ? <section className="leadopsCategoryList">
        {categories.map((cat) => (
          <article key={cat.id} className="card">
            <div className="card-inner leadopsPanel">
              <form method="post" action="/admin/api/leadops/categories" className="leadopsCategoryGrid">
                <input type="hidden" name="mode" value="update" />
                <input type="hidden" name="id" value={cat.id} />
                <input type="hidden" name="return_to" value="/admin/leadops/categories" />
                <label><span>Kind</span><input name="kind" className="wpInput" defaultValue={cat.kind} /></label>
                <label><span>Label</span><input name="label" className="wpInput" defaultValue={cat.label} /></label>
                <label><span>Slug</span><input name="slug" className="wpInput" defaultValue={cat.slug} /></label>
                <label><span>Color</span><input name="color" className="wpInput" defaultValue={cat.color || ""} /></label>
                <label><span>Sort Order</span><input name="sort_order" type="number" className="wpInput" defaultValue={cat.sort_order} /></label>
                <label><span>Active</span><select name="active" defaultValue={String(cat.active)}><option value="true">true</option><option value="false">false</option></select></label>
                <label className="leadopsSpan2"><span>Description</span><input name="description" className="wpInput" defaultValue={cat.description || ""} /></label>
                <button className="wpBtnPrimary" type="submit">Save</button>
              </form>
            </div>
          </article>
        ))}
      </section> : null}
    </main>
  );
}
