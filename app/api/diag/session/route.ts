import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

async function signIfSupabasePath(pathOrUrl: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SECRET_SUPABASE_KEY!;
  const sb = createClient(url, key);
  const [bucket, ...rest] = pathOrUrl.split("/");
  const keyPath = rest.join("/");
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(keyPath, 3600);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export async function GET(req: Request) {
  try {
    const q = new URL(req.url).searchParams;
    const sid = q.get("sid");
    if (!sid) return Response.json({ error: "missing sid" }, { status: 400 });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const s = await stripe.checkout.sessions.retrieve(sid, { expand: ["line_items.data.price.product","customer"] });

    const raw = (s.line_items?.data || []).map((li: any) => {
      const prod = li.price?.product as any;
      return {
        product_id: prod?.id,
        product_name: prod?.name,
        download_url: prod?.metadata?.download_url || null,
        supabase_path: prod?.metadata?.supabase_path || null,
      };
    });

    const resolved = [];
    for (const r of raw) {
      const src = r.download_url || r.supabase_path || null;
      const url = await signIfSupabasePath(src);
      resolved.push({ name: r.product_name, src, resolved_url: url });
    }

    return Response.json({
      ok: true,
      email: (s.customer as any)?.email || s.customer_details?.email || null,
      items: raw,
      resolved
    });
  } catch (e:any) {
    return Response.json({ ok:false, error: e?.message || "server_error" }, { status: 500 });
  }
}
