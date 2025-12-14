import Stripe from "stripe";
export const runtime = "nodejs";
export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const acct = await stripe.accounts.retrieve();
    return Response.json({ ok:true, account: { id: acct.id, email: (acct as any).email ?? null } });
  } catch (e:any) {
    return Response.json({ ok:false, error: e?.message || "stripe_error" }, { status: 400 });
  }
}
