import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const user = await requireAdmin("/admin/calendar");
  return (
    <PanelShell email={user.email} title="// 06 — CALENDAR">
      <p className="label">// SCHEDULE VIEW — COMING SOON.</p>
      <p className="mt-4 text-charcoal/80 max-w-prose">
        Weekly grid of scheduled posts, drafts in flight, and NOW updates.
        For now, scheduled posts live under <code className="font-mono">// 03 — POSTS</code>.
      </p>
    </PanelShell>
  );
}
