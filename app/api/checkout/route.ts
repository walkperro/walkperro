import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const price = searchParams.get("price");
    if (!price) return NextResponse.json({ error: "missing_price" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: [{ price, quantity: 1 }],
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      // Optional: collect email up-front for fulfillment/Receipts
      customer_email: undefined,
      // Optional: auto-tax or discounts can go here
    });

    return NextResponse.json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("Stripe Embedded GET error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// Keep POST for hosted Checkout (unused by homepage now, but harmless)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prices: string[] = body?.priceIds || [];
    if (!Array.isArray(prices) || prices.length === 0) {
      return NextResponse.json({ error: "missing_prices" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: prices.map((p) => ({ price: p, quantity: 1 })),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Hosted POST error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
