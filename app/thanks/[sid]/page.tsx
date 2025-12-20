import Link from "next/link";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeSid(raw: any): string {
  let v = String(raw ?? "");
  try { v = decodeURIComponent(v); } catch {}
  v = v.trim();
  if (v.includes("?")) v = v.split("?")[0].trim();
  v = v.replace(/\/+$/g, "").trim();
  return v;
}

function looksLikeCheckoutSessionId(sid: string) {
  return /^cs_(test|live)_[A-Za-z0-9]+$/.test(sid);
}

async function originFromRequest() {
  const h = await headers(); // Next 16: headers() can be a Promise
  const proto = h.get("x-forwarded-proto") || "https";
  const host  = h.get("x-forwarded-host") || h.get("host");
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://www.walkperro.com");
}

export default async function ThanksPage({ params }: { params: { sid: string } }) {
  const sid = normalizeSid(params?.sid);

  // Always show a pleasant confirmation page even if SID is weird
  if (!sid || !looksLikeCheckoutSessionId(sid)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="text-4xl font-semibold tracking-tight">You’re in. ✅</h1>
          <p className="mt-2 text-slate-300">Purchase confirmed. Your downloads are delivered automatically.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-200">If you don’t see a download button here, check your email receipt.</p>
          </div>
          <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const origin = await originFromRequest();

  type ApiResp = {
    ok: boolean;
    email: string | null;
    resolved?: { name: string; resolved_url: string }[];
    error?: string;
  };

  let data: ApiResp | null = null;

  try {
    const res = await fetch(`${origin}/api/thanks/${sid}`, { cache: "no-store" });
    data = (await res.json()) as ApiResp;
  } catch {
    data = null;
  }

  const links = (data?.resolved || []).filter(x => !!x?.resolved_url);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">You’re in. ✅</h1>

        <p className="mt-2 text-slate-300">
          {data?.email ? (
            <>Purchase confirmed for <span className="font-medium">{data.email}</span>.</>
          ) : (
            <>Receipt + downloads were sent to your email.</>
          )}
        </p>

        {links.length > 0 ? (
          <div className="mt-8 space-y-3">
            {links.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="font-medium">{d.name}</div>
                <a
                  href={d.resolved_url}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-200">
              We couldn’t load your downloads right now. Please use the links in your email receipt.
            </p>
            {data?.error ? (
              <p className="mt-2 text-xs text-slate-400">debug: {data.error}</p>
            ) : null}
          </div>
        )}

        <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">
          Back to home
        </Link>
      </div>
    </main>
  );
}
