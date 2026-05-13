import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await requireAdmin("/admin/studio");
  return (
    <PanelShell email={user.email} title="// 01 — STUDIO">
      <p className="label">// DRAFTS INBOX — COMING SOON.</p>
      <p className="mt-4 text-charcoal/80 max-w-prose">
        This is where draft posts, social captions, and one-off content will land before they ship.
        Wire-up pending. For now, head to <code className="font-mono">// 03 — POSTS</code> to publish.
      </p>
    </PanelShell>
  );
}
