import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

// Create a split Payment Link for a creator's product: buyer pays on Stripe,
// funds transfer to the creator's Express account, platform keeps 20%.
// Creator is seller of record (destination charge).
const FEE_BPS = 2000; // 20%

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey)
    return NextResponse.json(
      { ok: false, error: "stripe_not_configured" },
      { status: 503 }
    );

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 200) : "";
  const priceCents = Number(body.price_cents);
  if (!title || !Number.isInteger(priceCents) || priceCents < 100 || priceCents > 50_000_00) {
    return NextResponse.json({ ok: false, error: "bad_input" }, { status: 400 });
  }

  const supa = admin();
  const { data: row, error } = await supa
    .from("intake_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !row)
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  if (!row.stripe_account_id)
    return NextResponse.json(
      { ok: false, error: "no_stripe_account" },
      { status: 400 }
    );

  const stripe = new Stripe(stripeKey);
  try {
    const product = await stripe.products.create({
      name: title,
      metadata: { intake_submission_id: id, handle: row.handle },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: priceCents,
      currency: "usd",
    });
    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      application_fee_amount: Math.round((priceCents * FEE_BPS) / 10_000),
      transfer_data: { destination: row.stripe_account_id },
      metadata: { intake_submission_id: id },
    });

    await supa
      .from("intake_submissions")
      .update({
        product_title: title,
        price_cents: priceCents,
        stripe_payment_link_id: link.id,
        payment_link_url: link.url,
      })
      .eq("id", id);

    await audit(ctx.user.id, "intake_payment_link", {
      id,
      title,
      price_cents: priceCents,
      payment_link: link.id,
    });
    return NextResponse.json({ ok: true, url: link.url });
  } catch (e) {
    console.error("PAYMENT_LINK_ERROR", e);
    return NextResponse.json(
      { ok: false, error: "stripe_error" },
      { status: 502 }
    );
  }
}
