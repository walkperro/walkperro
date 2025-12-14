export const revalidate = 0;
export const dynamic = "force-dynamic";
import ParamGuard from "./ParamGuard";
import Stripe from "stripe";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

async function signIfSupabasePath(pathOrUrl: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl; // already a URL
  // expect "products/filename.ext"
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SECRET_SUPABASE_KEY!;
  const sb = createClient(url, key);
  const [bucket, ...rest] = pathOrUrl.split("/");
  const keyPath = rest.join("/");
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(keyPath, 3600);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export default async function ThanksPage({ searchParams }:{ searchParams: { session_id?: string; sessionId?: string } }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://walkperro.com";
  const sessionId = searchParams?.session_id || (searchParams as any)?.sessionId || null;

  if (!sessionId) {
    return (<main className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
      {/* fallback if Stripe drops the query param */}
      <ParamGuard />
        <div className="max-w-md rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10">
          <p className="text-base">Missing session. If you just paid, check your email for your receipt & downloads.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-emerald-500 px-5 py-2 text-white">Back to home</Link>
        </div>
      </main>
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const s = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items.data.price.product","customer"] });
  const email = (s.customer as any)?.email || s.customer_details?.email || "";

  // Build downloads from product metadata
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">You’re in. ✅</h1>
        <p className="mt-2 text-slate-300">
          {email ? <>Your purchase is confirmed for <span className="font-medium">{email}</span>.</> : "Your purchase is confirmed."} Your downloads are below.
        </p>

        <div className="mt-6 space-y-3">
          {downloads.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="font-medium">{d.name}</div>
              {d.url ? (
                <a href={d.url} target="_blank" rel="noopener" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white">Download</a>
              ) : (
                <span className="text-sm text-slate-400">No link found</span>
              )}
            </div>
          ))}
        </div>

        {/* Single Upsell card */}
        <div className="mt-10 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
          <div className="text-lg font-semibold">Upgrade: All-In-One Toolkit</div>
          <p className="mt-1 text-slate-300">Every current & future digital drop in one sleek bundle.</p>
          <p className="mt-2 text-emerald-300">Use code <span className="font-bold">DOG30</span> for 30% off.</p>
          <Link href="/checkout?price=price_1SbmGUCCBLLo4EMcl3h2ZHKl&promotionCode=DOG30" className="mt-4 inline-block rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white">Explore Bundle</Link>
        </div>

        <p className="mt-10 text-sm text-slate-400">
          Need help? DM <a className="underline" href="https://instagram.com/walkperro">@walkperro</a> or email <a className="underline" href="mailto:walkperro@proton.me">walkperro@proton.me</a>.
        </p>

        <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-slate-900">Back to home</Link>
      </div>
    </main>
  );
}
