import Link from "next/link";
import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { admin } from "@/lib/supabase/admin";
import type { Post } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_ORDER: Record<string, number> = { draft: 0, scheduled: 1, published: 2 };

type PostRow = Pick<Post, "id" | "slug" | "title" | "category" | "status" | "scheduled_for" | "published_at" | "updated_at">;

export default async function PostsListPage() {
  const user = await requireAdmin("/admin/posts");
  const { data } = await admin()
    .from("posts")
    .select("id, slug, title, category, status, scheduled_for, published_at, updated_at")
    .order("updated_at", { ascending: false });
  const rows = ((data || []) as unknown as PostRow[]).slice().sort((a, b) => {
    const sa = STATUS_ORDER[a.status] ?? 99;
    const sb = STATUS_ORDER[b.status] ?? 99;
    return sa - sb;
  });

  return (
    <PanelShell email={user.email} title="// 03 — POSTS">
      <div className="flex items-center justify-between mb-6 gap-3">
        <p className="label">{rows.length} ENTRIES</p>
        <Link
          href="/admin/posts/new"
          className="label px-3 py-2 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal whitespace-nowrap"
        >
          + NEW POST
        </Link>
      </div>

      <div className="border border-line">
        {/* Desktop column headers */}
        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] label py-3 px-4 bg-line/40">
          <span>TITLE</span><span>CATEGORY</span><span>STATUS</span><span>WHEN</span>
        </div>
        {rows.map((p) => (
          <Link
            key={p.id}
            href={`/admin/posts/${p.id}`}
            className="block border-t border-line hover:bg-line/40 first:border-t-0 md:first:border-t"
          >
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] py-3 px-4">
              <span className="font-mono text-sm">{p.title}</span>
              <span className="label">{p.category}</span>
              <span className="label">{p.status}</span>
              <span className="label text-smoke">{whenLabel(p)}</span>
            </div>
            {/* Mobile stacked card */}
            <div className="md:hidden p-4">
              <p className="font-mono text-sm break-words">{p.title}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <span className="label">{p.category}</span>
                <span className="label">{p.status}</span>
                <span className="label text-smoke">{whenLabel(p)}</span>
              </div>
            </div>
          </Link>
        ))}
        {rows.length === 0 && <p className="label p-6 text-smoke">// NO POSTS YET.</p>}
      </div>
    </PanelShell>
  );
}

function whenLabel(p: { status: string; scheduled_for: string | null; published_at: string | null }): string {
  if (p.status === "scheduled" && p.scheduled_for) return new Date(p.scheduled_for).toLocaleString();
  if (p.status === "published" && p.published_at) return new Date(p.published_at).toLocaleString();
  return "—";
}
