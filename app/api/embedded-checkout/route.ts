import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { priceId, promotionCodeId, promotionCode } = await req.json();

    if (!priceId) {
      return Response.json({ error: "Missing priceId" }, { status: 400 });
    }

    // Resolve a human-readable code to a promotion_code id if needed
    let promoId: string | undefined = promotionCodeId || undefined;
    if (!promoId && promotionCode) {
      const found = await stripe.promotionCodes.list({ code: promotionCode, active: true, limit: 1 });
      promoId = found.data[0]?.id;
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://walkperro.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      ...(promoId ? { discounts: [{ promotion_code: promoId }] } : {}),
      return_url: `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Return the key name the widget originally expected
    return Response.json({ client_secret: session.client_secret });
  } catch (err: any) {
    console.error("Embedded checkout error:", err);
    return Response.json({ error: err?.message || "server_error" }, { status: 500 });
  }
}
