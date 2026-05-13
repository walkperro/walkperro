import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { admin } from "@/lib/supabase/admin";
import ToolsClient from "./Client";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const user = await requireAdmin("/admin/tools");
  const { data } = await admin()
    .from("tools")
    .select("*")
    .order("sort_order", { ascending: true });
  return (
    <PanelShell email={user.email} title="// 05 — TOOLS">
      <ToolsClient initial={data || []} />
    </PanelShell>
  );
}
