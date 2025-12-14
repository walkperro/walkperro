import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function signIfSupabasePath(pathOrUrl: string | null) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SECRET_SUPABASE_KEY!;
  const sb = createClient(url, key);
  const [bucket, ...rest] = pathOrUrl.split("/");
  const keyPath = rest.join("/");
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(keyPath, 3600);
  return error ? null : (data?.signedUrl ?? null);
}

export async function GET(req: NextRequest, {
  const { sid } = await params; params }: { params: Promise<{ sid: string }> }){
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const s = await stripe.checkout.sessions.retrieve(params.sid, {
      expand: ["line_items.data.price.product","customer"]
    });

    const email = (s.customer as any)?.email || s.customer_details?.email || null;
    const items = (s.line_items?.data || []).map((li: any) => {
      const prod = li.price?.product as any;
      return {
        product_id: prod?.id ?? null,
        product_name: prod?.name ?? null,
        download_url: prod?.metadata?.download_url ?? null,
        supabase_path: prod?.metadata?.supabase_path ?? null,
      };
    });

    const resolved = await Promise.all(items.map(async it => ({
      name: it.product_name,
      src: it.download_url ?? it.supabase_path ?? null,
      resolved_url: await signIfSupabasePath(it.download_url ?? it.supabase_path ?? null),
    })));

    return Response.json({ ok: true, sid: params.sid, email, items, resolved });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok:false, error: err?.message || "server_error" }), { status: 400 });
  }
}
