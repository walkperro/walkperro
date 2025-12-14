import Stripe from "stripe";
export const runtime = "nodejs";
export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const list = await stripe.prices.list({ active: true, limit: 50, expand: ["data.product"] });
    const rows = list.data
      .filter(p => p.type === "one_time" && p.currency === "usd")
      .map(p => {
        const prod = typeof p.product === "object" ? p.product : null;
        const isDeleted = !!(prod as any)?.deleted;
        return {
          price_id: p.id,
          active: p.active,
          amount: p.unit_amount,
          product: prod && !isDeleted ? {
            id: (prod as any).id,
            name: (prod as any).name,
            active: (prod as any).active
          } : (isDeleted ? { deleted: true } : null)
        };
      });
    return Response.json({ ok:true, count: rows.length, prices: rows });
  } catch (e:any) {
    return Response.json({ ok:false, error: e?.message || "stripe_error" }, { status: 400 });
  }
}
