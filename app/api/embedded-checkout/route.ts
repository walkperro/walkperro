import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { priceIds, returnPath = "/thanks" } = await req.json();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: priceIds.map((p: string) => ({ price: p, quantity: 1 })),
      allow_promotion_codes: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}${returnPath}?session_id={CHECKOUT_SESSION_ID}`,
    });
    return Response.json({ client_secret: session.client_secret });
  } catch (e: any) {
    console.error("Embedded session error:", e?.message || e);
    return Response.json({ error: "embedded_failed" }, { status: 400 });
  }
}
