import Stripe from "stripe";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

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

async function signIfSupabasePath(pathOrUrl: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SECRET_SUPABASE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) return null;

  const sb = createClient(url, key);

  const [bucket, ...rest] = pathOrUrl.split("/");
  const keyPath = rest.join("/");
  if (!bucket || !keyPath) return null;

  const { data } = await sb.storage.from(bucket).createSignedUrl(keyPath, 3600);
  return data?.signedUrl ?? null;
}

export default async function ThanksSidPage({ params }: { params: { sid: string } }) {
  const sid = normalizeSid(params?.sid);

  // If sid is junk, show a clean confirmation page (no scary errors)
  if (!sid || !looksLikeCheckoutSessionId(sid)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="text-4xl font-semibold tracking-tight">You’re in. ✅</h1>
          <p className="mt-2 text-slate-300">
            Purchase confirmed. Your downloads are delivered automatically.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-200">
              If you don’t see a download button here, check your email receipt.
            </p>
          </div>
          <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const s = await stripe.checkout.sessions.retrieve(sid, {
      expand: ["line_items.data.price.product", "customer"],
    });

    const email = (s.customer as any)?.email || s.customer_details?.email || "";

    const raw = (s.line_items?.data || []).map((li: any) => {
      const prod = li.price?.product as any;
      const dl = prod?.metadata?.download_url || prod?.metadata?.supabase_path || null;
      return { name: prod?.name || "Download", dl };
    });

    const downloads: { name: string; url: string | null }[] = [];
    for (const r of raw) {
      const url = await signIfSupabasePath(r.dl);
      downloads.push({ name: r.name, url });
    }

    const hasAny = downloads.some(d => !!d.url);

    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="text-4xl font-semibold tracking-tight">You’re in. ✅</h1>
          <p className="mt-2 text-slate-300">
            {email ? (
              <>Purchase confirmed for <span className="font-medium">{email}</span>.</>
            ) : (
              "Purchase confirmed."
            )}{" "}
            {hasAny ? "Grab your downloads below." : "Receipt + downloads were sent to your email."}
          </p>

          <div className="mt-8 space-y-3">
            {downloads.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="font-medium">{d.name}</div>
                {d.url ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">Preparing…</span>
                )}
              </div>
            ))}
          </div>

          {!hasAny && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-slate-200">
                If you don’t see download buttons within a minute, check your email receipt.
              </p>
            </div>
          )}

          <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">
            Back to home
          </Link>
        </div>
      </main>
    );
  } catch (e) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="text-4xl font-semibold tracking-tight">You’re in. ✅</h1>
          <p className="mt-2 text-slate-300">
            Receipt + downloads were sent to your email.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-200">
              We couldn’t load your downloads right now. Please use the links in your email receipt.
            </p>
          </div>
          <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">
            Back to home
          </Link>
        </div>
      </main>
    );
  }
}
