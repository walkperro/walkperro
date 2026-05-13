import { notFound } from "next/navigation";
import PanelShell from "@/components/admin/PanelShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { admin } from "@/lib/supabase/admin";
import type { Post } from "@/lib/supabase/types";
import PostEditor from "../Editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAdmin(`/admin/posts`);
  const { id } = await params;
  const { data } = await admin().from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as unknown as Post;
  return (
    <PanelShell email={user.email} title={`// 03 — POSTS — ${post.title}`}>
      <PostEditor mode="edit" initial={post} />
    </PanelShell>
  );
}
