import { headers } from "next/headers";
import ThanksClient from "./ThanksClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;



async function originFromHeaders() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host  = h.get("x-forwarded-host") || h.get("host");
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://www.walkperro.com");
}

export default function ThanksSidPage({ params }: { params: { sid: string } }) {
  return <ThanksClient sid={params.sid} />;
}
