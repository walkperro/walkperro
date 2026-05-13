import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import SettingsClient from "./Client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireAdmin("/admin/settings");
  return (
    <PanelShell email={user.email} title="// 08 — SETTINGS">
      <SettingsClient totpEnabled={user.totp_enabled} />
    </PanelShell>
  );
}
