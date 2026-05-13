import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const user = await requireAdmin("/admin/metrics");
  return (
    <PanelShell email={user.email} title="// 07 — METRICS">
      <p className="label">// METRICS — COMING SOON.</p>
      <p className="mt-4 text-charcoal/80 max-w-prose">
        Subscriber growth, post views, tool downloads, conversion funnels.
        Wire-up pending — quick stats live in <code className="font-mono">// 02 — SUBSCRIBERS</code> meanwhile.
      </p>
    </PanelShell>
  );
}
