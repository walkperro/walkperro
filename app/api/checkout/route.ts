import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { priceIds, successPath = "/thanks" } = await req.json();
    if (!Array.isArray(priceIds) || priceIds.length === 0) {
      return Response.json({ error: "Missing priceIds" }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: priceIds.map((id: string) => ({ price: id, quantity: 1 })),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=1`,
      allow_promotion_codes: true,
    });
    return Response.json({ url: session.url });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Stripe error" }, { status: 500 });
  }
}
