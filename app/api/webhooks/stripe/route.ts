import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.headers.get("stripe-signature") || "";
    const payload = await req.text();

    if (!process.env.STRIPE_SECRET_KEY) return new Response("No secret", { status: 500 });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // If you haven't configured the endpoint secret yet, skip verification (dev only)
    if (!secret) {
      // parse without verification for now
      const event = JSON.parse(payload);
      console.log("Webhook (unverified in dev):", event?.type);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    console.log("Webhook:", event.type);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err?.message || err);
    return new Response(`Webhook Error`, { status: 400 });
  }
}
