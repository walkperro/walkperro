import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

async function signIfSupabasePath(pathOrUrl: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SECRET_SUPABASE_KEY ||
    "";

  if (!url || !key) return null;

  const sb = createClient(url, key);

  const cleaned = pathOrUrl.replace(/^\/+/, "");
  const [bucket, ...rest] = cleaned.split("/");
  const objectPath = rest.join("/");

  if (!bucket || !objectPath) return null;

  const { data } = await sb.storage.from(bucket).createSignedUrl(objectPath, 3600);
  return data?.signedUrl ?? null;
}

// IMPORTANT: Next 16 expects params as a Promise in the handler context type (per your build error)
export async function GET(_req: NextRequest, ctx: { params: Promise<{ sid: string }> }) {
  const { sid } = await ctx.params;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.retrieve(sid, {
      expand: ["customer"],
    });

    const li = await stripe.checkout.sessions.listLineItems(sid, {
      expand: ["data.price.product"],
      limit: 10,
    });

    const email =
      (session.customer as any)?.email ||
      session.customer_details?.email ||
      null;

    const items = (li.data || []).map((row: any) => {
      const prod = row.price?.product as any;
      return {
        product_id: prod?.id ?? null,
        product_name: prod?.name ?? "Download",
        download_url: prod?.metadata?.download_url ?? null,
        supabase_path: prod?.metadata?.supabase_path ?? null,
      };
    });

    const resolved: { name: string; src: string | null; resolved_url: string | null }[] = [];

    for (const it of items) {
      const src = it.download_url || it.supabase_path || null;
      const url = await signIfSupabasePath(src);
      resolved.push({ name: it.product_name, src, resolved_url: url });
    }

    return Response.json({ ok: true, email, items, resolved });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || "stripe_error" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
}
