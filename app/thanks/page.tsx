import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ThanksIndex({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sid =
    (typeof searchParams?.sid === "string" && searchParams.sid) ||
    (typeof searchParams?.session_id === "string" && searchParams.session_id) ||
    (typeof searchParams?.session === "string" && searchParams.session) ||
    (typeof searchParams?.checkout_session_id === "string" && searchParams.checkout_session_id) ||
    null;

  if (sid && sid.startsWith("cs_")) redirect(`/thanks/${sid}`);

  // No SID? send them home (prevents build from calling Stripe with undefined)
  redirect("/");
}
