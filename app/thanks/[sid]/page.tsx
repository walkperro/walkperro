import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ThanksApi = {
  ok: boolean;
  email?: string | null;
  resolved?: { name: string; src: string | null; resolved_url: string | null }[];
  error?: string;
};

export default async function ThanksSidPage({ params }: { params: { sid: string } }) {
  const { sid } = params;

  // ✅ Relative fetch (works reliably on Vercel)
  const r = await fetch(`/api/thanks/${encodeURIComponent(sid)}`, { cache: "no-store" });
  const j = (await r.json().catch(() => null)) as ThanksApi | null;

  const links =
    (j?.resolved || []).filter((x) => x?.resolved_url) as {
      name: string;
      src: string | null;
      resolved_url: string;
    }[];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">You’re in. ✅</h1>
        <p className="mt-2 text-slate-300">Purchase confirmed. Your downloads are delivered automatically.</p>

        <div className="mt-8 space-y-3">
          {links.length > 0 ? (
            links.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="font-medium">{d.name || "Download"}</div>
                <a
                  href={d.resolved_url}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-slate-200">
                {j?.ok === false
                  ? `We couldn’t load your links: ${j?.error || "unknown error"}`
                  : "If you don’t see a download button here, check your email receipt."}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                debug: ok={String(j?.ok)} links={String(links.length)}
              </p>
            </div>
          )}
        </div>

        <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">
          Back to home
        </Link>
      </div>
    </main>
  );
}
