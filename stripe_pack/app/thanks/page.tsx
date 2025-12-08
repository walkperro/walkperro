// app/thanks/page.tsx
import Stripe from "stripe";
import Link from "next/link";
import { supabaseAdmin } from "@/utils/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export default async function ThanksPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const session_id = searchParams?.session_id as string;
  const sess = await stripe.checkout.sessions.retrieve(session_id);
  const items = await stripe.checkout.sessions.listLineItems(session_id, { expand: ["data.price.product"] });

  const fileKeys = items.data
    .map((li) => {
      const p: any = li.price?.product || {};
      const fromPrice = (li.price as any)?.metadata?.fileKey;
      const fromProd = (p.metadata || {}).fileKey;
      return fromPrice || fromProd;
    })
    .filter(Boolean) as string[];

  const supabase = supabaseAdmin();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "products";
  const links: { name: string; url: string }[] = [];
  for (const key of fileKeys) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(key, 60 * 60 * 2);
    if (!error && data?.signedUrl) links.push({ name: key, url: data.signedUrl });
  }

  return (
    <main className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Thank you — your downloads are ready</h1>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.url}>
            <a className="underline" href={l.url}>Download {l.name}</a> <span>(expires in ~2 hours)</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link className="underline" href="/store">Back to store</Link>
      </div>
    </main>
  );
}