import Stripe from "stripe";
import { Resend } from "resend";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("❌ Bad Stripe signature:", err?.message);
    return new Response("Bad signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;

    const email =
      s.customer_details?.email ||
      (s.customer_email as string | null) ||
      undefined;

    if (email) {
      const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://walkperro.com"}/download?session=${encodeURIComponent(s.id)}`;

      try {
        const sent = await resend.emails.send({
          from: process.env.RESEND_FROM!,           // ✅ matches your Vercel key
          to: email,
          subject: "Your WalkPerro download is ready 🐕",
          html: `
            <h2>You’re in. ✅</h2>
            <p>Thanks for your purchase. Click below to download:</p>
            <p><a href="${downloadUrl}">👉 Download your product</a></p>
            <p>If you didn’t expect this email, you can ignore it.</p>
            <p>— WalkPerro</p>
          `,
        });
        console.log("✅ Resend id:", sent?.data?.id ?? "ok");
      } catch (e: any) {
        console.error("❌ Resend error:", e?.message || e);
      }
    } else {
      console.warn("⚠️ No email on session", s.id);
    }
  }

  return Response.json({ received: true });
}
