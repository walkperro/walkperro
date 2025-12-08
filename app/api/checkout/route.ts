import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { priceIds, successPath = "/thanks" } = await req.json();

    if (!Array.isArray(priceIds) || priceIds.length === 0) {
      return new Response(JSON.stringify({ error: "no_price_ids" }), { status: 400 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "missing_secret_key" }), { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // figure out absolute site url
    const hdrOrigin = req.headers.get("origin") || "";
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || hdrOrigin || vercelUrl || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: priceIds.map((id: string) => ({ price: id, quantity: 1 })),
      success_url: `${siteUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: "checkout_failed" }), { status: 500 });
  }
}
