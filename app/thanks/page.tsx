import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ThanksPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sid = searchParams.session_id;
  if (!sid) redirect("/");
  redirect(`/thanks/${encodeURIComponent(sid)}`);
}
