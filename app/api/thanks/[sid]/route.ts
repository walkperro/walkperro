import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

async function signIfSupabasePath(pathOrUrl: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SECRET_SUPABASE_KEY!;
  const sb = createClient(url, key);
  const [bucket, ...rest] = pathOrUrl.split("/");
  const keyPath = rest.join("/");
  const { data } = await sb.storage.from(bucket).createSignedUrl(keyPath, 3600);
  return data?.signedUrl ?? null;
}

// GET /api/thanks/:sid  -> JSON with resolved download links
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sid: string }> }
) {
  const { sid } = await params;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const s = await stripe.checkout.sessions.retrieve(sid, {
      expand: ["line_items.data.price.product", "customer"],
    });

    const email =
      (s.customer as any)?.email || s.customer_details?.email || null;

    const items = (s.line_items?.data || []).map((li: any) => {
      const prod = li.price?.product as any;
      return {
        product_id: prod?.id ?? null,
        product_name: prod?.name ?? "Download",
        download_url: prod?.metadata?.download_url ?? null,
        supabase_path: prod?.metadata?.supabase_path ?? null,
      };
    });

    const resolved = [];
    for (const it of items) {
      const src = it.download_url || it.supabase_path || null;
      const url = await signIfSupabasePath(src);
      resolved.push({ name: it.product_name, src, resolved_url: url });
    }

    return Response.json({ ok: true, email, items, resolved });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || "stripe_error" }),
      { status: 400 }
    );
  }
}
