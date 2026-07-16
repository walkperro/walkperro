import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import IntakeClient from "./Client";

export const dynamic = "force-dynamic";

export default async function IntakePage() {
  const user = await requireAdmin("/admin/intake");
  return (
    <PanelShell email={user.email} title="// 00 — INTAKE">
      <IntakeClient />
    </PanelShell>
  );
}
