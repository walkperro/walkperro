import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "../../../src/lib/products";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug  = searchParams.get("slug");
    const price = searchParams.get("price");
    const code  = searchParams.get("code");

    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.walkperro.com";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    let stripePriceId: string | null = null;
    if (price) {
      stripePriceId = price;
    } else if (slug) {
      const p = products.find(p => p.slug === slug);
      stripePriceId = p?.stripePriceId ?? null;
    }
    if (!stripePriceId) {
      return NextResponse.json({ error: "Unknown product/price." }, { status: 400 });
    }

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (code === "DOG30" && process.env.PROMO_DOG30_ID) discounts = [{ promotion_code: process.env.PROMO_DOG30_ID }];
    if (code === "WALK100" && process.env.PROMO_WALK100_ID) discounts = [{ promotion_code: process.env.PROMO_WALK100_ID }];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `/thanks/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/`,
      allow_promotion_codes: true,
      ...(discounts ? { discounts } : {}),
    });

    if (!session.url) return NextResponse.json({ error: "No checkout URL." }, { status: 500 });
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err: any) {
    console.error("[/api/checkout] error:", err);
    return NextResponse.json({ error: err?.message || "Checkout failed." }, { status: 500 });
  }
}
