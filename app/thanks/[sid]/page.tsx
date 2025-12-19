import Stripe from "stripe";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function signIfSupabasePath(pathOrUrl: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SECRET_SUPABASE_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) return null;

  const cleaned = pathOrUrl.replace(/^\/+/, "");
  const [bucket, ...rest] = cleaned.split("/");
  const objectPath = rest.join("/");
  if (!bucket || !objectPath) return null;

  const sb = createClient(supabaseUrl, supabaseKey);
  const { data } = await sb.storage.from(bucket).createSignedUrl(objectPath, 60 * 60); // 1 hour
  return data?.signedUrl ?? null;
}

export default async function ThanksSidPage({ params }: { params: { sid: string } }) {
  const sid = params.sid;

  let email = "";
  let hadStripeError = false;
  let downloads: { name: string; url: string | null }[] = [];

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const session = await stripe.checkout.sessions.retrieve(sid, { expand: ["customer"] });

    email =
      (session.customer as any)?.email ||
      session.customer_details?.email ||
      "";

    // ✅ This is the critical part: listLineItems (reliable)
    const li = await stripe.checkout.sessions.listLineItems(sid, {
      expand: ["data.price.product"],
      limit: 50,
    });

    const raw = (li.data || []).map((row: any) => {
      const prod = row.price?.product as any;
      const supabase_path = prod?.metadata?.supabase_path ?? null;
      const download_url = prod?.metadata?.download_url ?? null;
      const src = download_url || supabase_path || null;

      return {
        name: prod?.name ?? "Download",
        src,
      };
    });

    downloads = await Promise.all(
      raw.map(async (r) => ({
        name: r.name,
        url: await signIfSupabasePath(r.src),
      }))
    );
  } catch {
    hadStripeError = true;
  }

  const ready = downloads.filter((d) => d.url);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Order confirmed</h1>
<p className="mt-2 text-xs text-slate-500">build: {'process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,7) || "local"'}</p>

        <p className="mt-3 text-slate-300 leading-relaxed">
          {email ? (
            <>Receipt + downloads were sent to <span className="font-medium text-slate-100">{email}</span>.</>
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
                  href={d.url!}
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
              {hadStripeError
                ? "We couldn’t load your downloads on this page. Please use the links in your email receipt."
                : "We’re generating your secure links now. If you don’t see buttons here in a moment, use the links in your email receipt."}
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Tip: secure links expire — if you need them again, use the email receipt.
        </p>

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
