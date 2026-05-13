import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { admin } from "@/lib/supabase/admin";
import NowClient from "./Client";

export const dynamic = "force-dynamic";

export default async function NowPage() {
  const user = await requireAdmin("/admin/now");
  const { data } = await admin()
    .from("now_strip")
    .select("building, reading, listening")
    .eq("is_active", true)
    .maybeSingle();
  return (
    <PanelShell email={user.email} title="// 04 — NOW">
      <NowClient initial={data || { building: "", reading: "", listening: "" }} />
    </PanelShell>
  );
}
