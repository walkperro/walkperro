import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;
  const { id } = await params;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  const stripe = new Stripe(stripeKey);

  const supa = admin();
  const { data: tool } = await supa
    .from("tools")
    .select("id, slug, title, description, price_cents, stripe_price_id")
    .eq("id", id)
    .maybeSingle();

  if (!tool) return NextResponse.json({ ok: false, error: "tool_not_found" }, { status: 404 });
  if (!tool.price_cents || tool.price_cents <= 0) {
    return NextResponse.json({ ok: false, error: "tool_is_free" }, { status: 400 });
  }
  if (tool.stripe_price_id) {
    return NextResponse.json({ ok: true, already: true, stripe_price_id: tool.stripe_price_id });
  }

  // Create Product + one-time Price.
  const product = await stripe.products.create({
    name: tool.title,
    description: tool.description.slice(0, 500),
    metadata: { tool_id: tool.id, slug: tool.slug },
  });
  const price = await stripe.prices.create({
    currency: "usd",
    unit_amount: tool.price_cents,
    product: product.id,
    metadata: { tool_id: tool.id },
  });

  await supa.from("tools").update({ stripe_price_id: price.id }).eq("id", id);
  await audit(ctx.user.id, "tool_stripe_synced", { id, product: product.id, price: price.id }, { ip: ctx.ip, userAgent: ctx.userAgent });

  return NextResponse.json({ ok: true, stripe_price_id: price.id, stripe_product_id: product.id });
}
