import Stripe from "stripe";
export const runtime = "nodejs";

// GET /api/diag/price?price=price_xxx
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const priceId = url.searchParams.get("price");
    if (!priceId) return new Response(JSON.stringify({ error: "missing price param" }), { status: 400 });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });

    const product = typeof price.product === "object" ? price.product : null;
    const isDeleted = !!(product as any)?.deleted;

    return Response.json({
      ok: true,
      price: {
        id: price.id,
        active: price.active,
        currency: price.currency,
        unit_amount: price.unit_amount,
        type: price.type,
      },
      product: product && !isDeleted ? {
        id: (product as Stripe.Product).id,
        name: (product as Stripe.Product).name,
        active: (product as Stripe.Product).active,
        shippable: (product as any).shippable ?? null,
      } : (isDeleted ? { deleted: true } : null)
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok:false, error: err?.message || "stripe_error" }), { status: 400 });
  }
}
