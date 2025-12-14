import Stripe from "stripe";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function signIfSupabasePath(pathOrUrl: string | null) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SECRET_SUPABASE_KEY!;
  const sb = createClient(url, key);

  const [bucket, ...rest] = pathOrUrl.split("/");
  const keyPath = rest.join("/");

  const { data } = await sb.storage
    .from(bucket)
    .createSignedUrl(keyPath, 3600);

  return data?.signedUrl ?? null;
}

export default async function ThanksPage({
  params,
}: {
  params: { sid: string };
}) {
  const sessionId = params.sid;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product", "customer"],
  });

  const email =
    (session.customer as any)?.email ||
    session.customer_details?.email ||
    "";

  const raw = (session.line_items?.data || []).map((li: any) => {
    const prod = li.price?.product as any;
    return {
      name: prod?.name || "Download",
      src:
        prod?.metadata?.download_url ||
        prod?.metadata?.supabase_path ||
        null,
    };
  });

  const downloads = await Promise.all(
    raw.map(async (r) => ({
      name: r.name,
      url: await signIfSupabasePath(r.src),
    }))
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold">You’re in. ✅</h1>

        <p className="mt-2 text-slate-300">
          {email
            ? <>Your purchase is confirmed for <b>{email}</b>.</>
            : "Your purchase is confirmed."}
        </p>

        <div className="mt-6 space-y-3">
          {downloads.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div>{d.name}</div>
              {d.url ? (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm text-white"
                >
                  Download
                </a>
              ) : (
                <span className="text-slate-400 text-sm">No link found</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
          <div className="font-semibold">Upgrade: All-In-One Toolkit</div>
          <p className="mt-1 text-slate-300">
            Every current & future digital drop.
          </p>
          <p className="mt-2 text-emerald-300">
            Use code <b>DOG30</b> for 30% off.
          </p>
          <Link
            href="/checkout?price=price_1SbmGUCCBLLo4EMcl3h2ZHKl&promotionCode=DOG30"
            className="mt-4 inline-block rounded-full bg-emerald-500 px-5 py-2 text-white"
          >
            Explore Bundle
          </Link>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-white px-5 py-2 text-slate-900"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
