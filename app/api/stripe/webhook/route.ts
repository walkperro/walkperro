import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { admin } from "@/lib/supabase/admin";
import { createDownloadRow } from "@/lib/tools-server";
import { downloadReadyHtml } from "@/lib/email/download-ready";
import { audit } from "@/lib/auth/audit";

const FROM = process.env.RESEND_FROM || "walkperro <walkperro@walkperro.com>";

// Stripe webhook needs the raw body — disable Next.js JSON parsing.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }
  const stripe = new Stripe(stripeKey);

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ ok: false, error: "missing_signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (e) {
    console.error("STRIPE_SIG_VERIFY_FAIL", e);
    return NextResponse.json({ ok: false, error: "bad_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const toolId = session.metadata?.tool_id;
    const slug = session.metadata?.slug;
    const email = (session.customer_details?.email || session.metadata?.email || "").toLowerCase();
    const amountPaid = session.amount_total || 0;
    const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;

    if (toolId && email) {
      const supa = admin();

      // Subscriber upsert
      let subscriberId: string | null = null;
      const { data: existing } = await supa.from("subscribers").select("id").eq("email", email).maybeSingle();
      if (existing) {
        subscriberId = existing.id;
      } else {
        const { data: inserted } = await supa
          .from("subscribers")
          .insert({ email, source: `tool:${slug || "purchase"}` })
          .select("id")
          .single();
        subscriberId = inserted?.id || null;
      }

      // Idempotency: skip if we already have a download row for this payment intent
      let dlToken: string | null = null;
      if (paymentIntent) {
        const { data: existingDl } = await supa
          .from("tool_downloads")
          .select("download_token")
          .eq("stripe_payment_intent_id", paymentIntent)
          .maybeSingle();
        if (existingDl) dlToken = existingDl.download_token;
      }
      if (!dlToken) {
        const dl = await createDownloadRow({
          toolId,
          email,
          subscriberId,
          amountPaidCents: amountPaid,
          stripePaymentIntentId: paymentIntent,
        });
        if (dl) dlToken = dl.token;
      }

      if (dlToken) {
        const appUrl = process.env.APP_URL || "https://www.walkperro.com";
        const downloadUrl = `${appUrl}/api/tools/download/${dlToken}`;

        const { data: tool } = await supa.from("tools").select("title").eq("id", toolId).maybeSingle();

        if (process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: FROM,
              to: email,
              subject: `your ${tool?.title?.toLowerCase() || "download"} is ready.`,
              html: downloadReadyHtml({ toolTitle: tool?.title || "your download", downloadUrl }),
            });
          } catch (e) {
            console.warn("STRIPE_DL_EMAIL_WARN", e);
          }
        }
      }

      await audit(null, "tool_purchase", { tool_id: toolId, email, amount: amountPaid });
    }

    // Concierge branch: sessions created from a Payment Link (creator products,
    // 80/20 split). Log to walkperro.orders and bump the intake row to selling.
    const paymentLinkId =
      typeof session.payment_link === "string" ? session.payment_link : null;
    if (!toolId && paymentLinkId) {
      const supa = admin();

      // Map back to the intake row: metadata first, payment-link id as fallback.
      const metaId = session.metadata?.intake_submission_id || null;
      const { data: intakeRow } = await supa
        .from("intake_submissions")
        .select("id, stripe_account_id")
        .or(
          metaId
            ? `id.eq.${metaId},stripe_payment_link_id.eq.${paymentLinkId}`
            : `stripe_payment_link_id.eq.${paymentLinkId}`
        )
        .limit(1)
        .maybeSingle();
      const intakeId = intakeRow?.id ?? null;

      const amount = session.amount_total || 0;
      const feeCents = Math.round(amount * 0.2); // TODO(walk): read the exact fee from the PaymentIntent if it ever varies

      // Idempotent on the unique checkout-session id.
      const { error: orderErr } = await supa.from("orders").upsert(
        {
          intake_submission_id: intakeId,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntent,
          stripe_payment_link_id: paymentLinkId,
          destination_account: intakeRow?.stripe_account_id ?? null,
          buyer_email: email || null,
          amount_cents: amount,
          application_fee_cents: feeCents,
        },
        { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true }
      );
      if (orderErr) console.error("CONCIERGE_ORDER_ERROR", orderErr);

      if (intakeId) {
        await supa
          .from("intake_submissions")
          .update({ status: "selling" })
          .eq("id", intakeId);
      }

      await audit(null, "concierge_sale", {
        intake_id: intakeId,
        payment_link: paymentLinkId,
        amount,
      });
    }
  }

  return NextResponse.json({ received: true });
}
