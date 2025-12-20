import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ResolvedItem = { name: string; src?: string | null; resolved_url: string | null };

async function getOrigin() {
  // Next 16: headers() is async in your build env (must await)
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host  = h.get("x-forwarded-host") || h.get("host");
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://www.walkperro.com");
}

export default async function ThanksSidPage({ params }: { params: { sid: string } }) {
  const { sid } = params;
  const origin = await getOrigin();

  let email = "";
  let resolved: ResolvedItem[] = [];
  let ok = false;

  try {
    const r = await fetch(`${origin}/api/thanks/${encodeURIComponent(sid)}`, { cache: "no-store" });
    const j = await r.json();
    ok = !!j?.ok;
    email = j?.email || "";
    resolved = Array.isArray(j?.resolved) ? j.resolved : [];
  } catch {}

  const links = resolved.filter((x) => x?.resolved_url);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">You’re in. ✅</h1>

        <p className="mt-2 text-slate-300">
          {email ? (
            <>
              Receipt + downloads were sent to <span className="font-medium">{email}</span>.
            </>
          ) : (
            "Receipt + downloads were sent to your email."
          )}
        </p>

        {links.length > 0 ? (
          <div className="mt-6 space-y-3">
            {links.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="font-medium">{d.name || "Download"}</div>
                <a
                  href={d.resolved_url!}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white"
                >
                  Download
                </a>
              </div>
            ))}
            <p className="pt-2 text-xs text-slate-500">
              Tip: secure links expire — if you need them again, use the email receipt.
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-200">
              {ok ? "We couldn’t load your downloads right now." : "Purchase confirmed."}
            </p>
            <p className="mt-2 text-slate-400">Please use the links in your email receipt.</p>
          </div>
        )}

        <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">
          Back to home
        </Link>
      </div>
    </main>
  );
}
