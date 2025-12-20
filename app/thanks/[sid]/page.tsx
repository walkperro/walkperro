import Link from "next/link";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApiResp = {
  ok: boolean;
  email?: string | null;
  resolved?: { name: string; src?: string | null; resolved_url: string | null }[];
  error?: string;
};

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

async function originFromHeaders() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host  = h.get("x-forwarded-host") || h.get("host");
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://www.walkperro.com");
}

export default async function ThanksSidPage({ params }: { params: { sid: string } }) {
  const sid = normalizeSid(params?.sid);

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

  let email = "";
  let resolved: { name: string; resolved_url: string | null }[] = [];
  let err = "";

  try {
    const origin = await originFromHeaders();
    const r = await fetch(`${origin}/api/thanks/${encodeURIComponent(sid)}`, { cache: "no-store" });
    const j = (await r.json()) as ApiResp;

    if (!j.ok) err = j.error || "api_error";
    email = j.email || "";
    resolved = (j.resolved || []).map(x => ({ name: x.name, resolved_url: x.resolved_url }));
  } catch (e) {
    err = "fetch_failed";
  }

  const ready = resolved.filter(x => x.resolved_url);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Order confirmed</h1>
        <p className="mt-3 text-slate-300 leading-relaxed">
          {email ? <>Receipt + downloads were sent to <span className="font-medium text-slate-100">{email}</span>.</> : <>Receipt + downloads were sent to your email.</>}
        </p>

        <div className="mt-7 space-y-3">
          {ready.length ? (
            ready.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-slate-100 font-medium">{d.name}</div>
                <a
                  href={d.resolved_url!}
                  target="_blank"
                  rel="noopener"
                  className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
              {err ? "We couldn’t load your downloads on this page. Please use the links in your email receipt." :
                "We’re generating your secure links now. If you don’t see buttons here in a moment, use the links in your email receipt."}
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Tip: secure links expire — if you need them again, use the email receipt.
        </p>

        <Link href="/" className="mt-8 inline-block rounded-full bg-white px-5 py-2 text-slate-900 font-semibold hover:bg-slate-100">
          Back to home
        </Link>
      </div>
    </main>
  );
}
