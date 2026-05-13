import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPublicTool } from "@/lib/tools-server";
import { isEmail } from "@/lib/validation";
import { rateLimit, ipKey } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { limited } = await rateLimit(ipKey(req.headers, `tool-checkout:${slug}`), {
      windowSeconds: 60,
      max: 20,
    });
    if (limited) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!isEmail(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });

    const tool = await getPublicTool(slug);
    if (!tool) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    if (tool.price_cents <= 0 || !tool.stripe_price_id) {
      return NextResponse.json({ ok: false, error: "free_or_unconfigured" }, { status: 400 });
    }

    const appUrl = process.env.APP_URL || "https://www.walkperro.com";
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: tool.stripe_price_id, quantity: 1 }],
      customer_email: email,
      success_url: `${appUrl}/tools/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/tools/${slug}`,
      metadata: { tool_id: tool.id, slug, email },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    console.error("CHECKOUT_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
