import Stripe from "stripe";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { priceId, promotionCodeId, promotionCode } = await req.json();

    if (!priceId) {
      return Response.json({ error: "Missing priceId" }, { status: 400 });
    }

    let promoId: string | undefined = promotionCodeId;

    // Explicit promo handling
    if (!promoId && promotionCode === "DOG30") {
      promoId = process.env.NEXT_PUBLIC_PROMO_DOG30_ID;
    }

    // WALK100 exists but is NEVER auto-applied
    // Only applied if explicitly passed
    if (!promoId && promotionCode === "WALK100") {
      promoId = process.env.NEXT_PUBLIC_DEFAULT_PROMO_ID;
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://walkperro.com";

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(promoId ? { discounts: [{ promotion_code: promoId }] } : {}),
      return_url: `${origin}/thanks/{CHECKOUT_SESSION_ID}`,
      redirect_on_completion: "always",
      ...(promoId ? {} : { allow_promotion_codes: true }),
    });

    return Response.json({ client_secret: session.client_secret, session_id: session.id });
  } catch (err: any) {
    console.error("Embedded checkout error:", err);
    return Response.json({ error: err?.message || "server_error" }, { status: 500 });
  }
}
