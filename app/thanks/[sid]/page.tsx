import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApiResp = {
  ok: boolean;
  email?: string | null;
  resolved?: { name: string; src: string | null; resolved_url: string | null }[];
  error?: string;
};

function siteBase() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.walkperro.com";
}

export default async function ThanksSidPage({
  params,
  searchParams,
}: {
  params: { sid: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sid = params.sid;
  const debug = (searchParams?.debug as string | undefined) === "1";

  let data: ApiResp | null = null;
  let fetchErr: string | null = null;

  try {
    const res = await fetch(`${siteBase()}/api/thanks/${encodeURIComponent(sid)}`, {
      cache: "no-store",
    });
    data = (await res.json()) as ApiResp;
    if (!res.ok || !data?.ok) fetchErr = data?.error || `api_error_${res.status}`;
  } catch (e: any) {
    fetchErr = e?.message || "fetch_failed";
  }

  const email = data?.email || "";
  const ready = (data?.resolved || []).filter((x) => x.resolved_url);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Order confirmed</h1>

        <p className="mt-3 text-slate-300 leading-relaxed">
          {email ? (
            <>
              Receipt + downloads were sent to{" "}
              <span className="font-medium text-slate-100">{email}</span>.
            </>
          ) : (
            <>Receipt + downloads were sent to your email.</>
          )}
        </p>

        <div className="mt-7 space-y-3">
          {ready.length ? (
            ready.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
              >
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
              We’re generating your secure links now. If you don’t see buttons here in a moment, use the links in your email receipt.
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Tip: secure links expire — if you need them again, use the email receipt.
        </p>

        {debug ? (
          <pre className="mt-6 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-slate-200">
            {JSON.stringify({ sid, fetchErr, data }, null, 2)}
          </pre>
        ) : null}

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-white px-5 py-2 text-slate-900 font-semibold hover:bg-slate-100"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
