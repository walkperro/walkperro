import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import SubscribersClient from "./Client";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const user = await requireAdmin("/admin/subscribers");
  return (
    <PanelShell email={user.email} title="// 02 — SUBSCRIBERS">
      <SubscribersClient />
    </PanelShell>
  );
}
