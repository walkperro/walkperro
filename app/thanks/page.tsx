import Stripe from "stripe";
import Link from "next/link";
import { supabaseAdmin } from "@/utils/supabaseServer";

const __sb = (typeof supabaseAdmin === "function" ? supabaseAdmin() : (supabaseAdmin as any));

export default async function ThanksPage({ searchParams }:{ searchParams: { session_id?: string } }) {
  const sessionId = searchParams?.session_id;
  let email = "";
  if (sessionId) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const s = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["customer"] });
    // record purchase (soft-fail)
    try {
      const cust = (s.customer as any) || {};
      email = cust?.email || s.customer_details?.email || "";
      await __sb.from("purchases").insert({
        session_id: sessionId,
        email,
        amount_total: s.amount_total,
        currency: s.currency,
      });
    } catch {}
  }
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">You’re in. ✅</h1>
        <p className="mt-3 text-slate-600">
          Your purchase is confirmed{email ? ` for ${email}` : ""}. A receipt and download link are on the way.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-white">Back to home</Link>
      </div>
    </main>
  );
}
