// app/api/checkout/route.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  try {
    const { priceIds, successPath = '/thanks' } = await req.json();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: priceIds.map((id: string) => ({ price: id, quantity: 1 })),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store`,
      automatic_tax: { enabled: true }
    });
    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}