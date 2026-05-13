import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import PostEditor from "../Editor";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const user = await requireAdmin("/admin/posts/new");
  return (
    <PanelShell email={user.email} title="// 03 — POSTS — NEW">
      <PostEditor mode="create" />
    </PanelShell>
  );
}
