import Stripe from "stripe";
import { Resend } from "resend";

// Force Node runtime
export const runtime = "nodejs";

// --- Optional Supabase signed URLs ---
let supabaseClient: any = null;
try {
  const { createClient } = require("@supabase/supabase-js");
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SECRET_SUPABASE_KEY;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }
} catch {
  // supabase-js not installed — skip
}

async function maybeSignFromSupabase(path: string): Promise<string | null> {
  try {
    if (!supabaseClient) return null;
    const [bucket, ...rest] = path.split("/");
    const objectPath = rest.join("/");
    if (!bucket || !objectPath) return null;
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .createSignedUrl(objectPath, 60 * 60 * 24);
    if (error) return null;
    return data?.signedUrl ?? null;
  } catch {
    return null;
  }
}

// SDKs
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers.get("stripe-signature") || "";
    const raw = await req.text();

    let event: any;
    if (whSecret) {
      event = stripe.webhooks.constructEvent(raw, sig, whSecret);
    } else {
      event = JSON.parse(raw);
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      console.log("[WH] event:", event.type);

      const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
        expand: ["line_items.data.price.product"],
      });

      const email = session.customer_details?.email ?? undefined;
      console.log("[WH] email:", email);
      if (!email) {
        console.log("[WH] no email found; skipping send");
        return Response.json({ ok: true });
      }

      const items =
        session.line_items?.data?.map((li: any) => {
          const product: any = li.price?.product;
          return {
            name: product?.name,
            dl:
              product?.metadata?.download_url ||
              product?.metadata?.supabase_path ||
              null,
          };
        }) ?? [];

      console.log("[WH] raw items:", items);

      const resolved: { name: string; url: string | null }[] = [];
      for (const it of items) {
        if (!it.dl) {
          resolved.push({ name: it.name, url: null });
          continue;
        }
        if (/^https?:\/\//i.test(it.dl)) {
          resolved.push({ name: it.name, url: it.dl });
        } else {
          const signed = await maybeSignFromSupabase(it.dl);
          resolved.push({ name: it.name, url: signed });
        }
      }
      console.log("[WH] resolved:", resolved);

      const site = process.env.NEXT_PUBLIC_SITE_URL || "https://walkperro.com";
      const html = `
        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;color:#0f172a">
          <h2 style="margin:0 0 8px;font-weight:700;">You're in. ✅</h2>
          <p style="margin:0 0 16px;">Thanks for your purchase! Your downloads are below.</p>
          <ul style="padding-left:18px;margin:0 0 16px;">
            ${resolved
              .map((r) =>
                r.url
                  ? `<li><strong>${r.name}</strong> — <a href="${r.url}" target="_blank" rel="noopener">Download</a></li>`
                  : `<li><strong>${r.name}</strong> — (no download link found)</li>`
              )
              .join("")}
          </ul>
          <p style="margin:16px 0 0;">Need help? Reply to this email or visit <a href="${site}">${site.replace(/^https?:\/\//, "")}</a>.</p>
        </div>
      `;

      const sendRes = await resend.emails.send({
        from: process.env.RESEND_FROM || "team@walkperro.com",
        to: email,
        subject: "Your downloads from WALKPERRO",
        html,
      });
      console.log("[WH] resend result:", sendRes);

      if (process.env.NOTIFY_SIGNUPS_TO) {
        await resend.emails.send({
          from: process.env.RESEND_FROM || "team@walkperro.com",
          to: process.env.NOTIFY_SIGNUPS_TO!,
          subject: `New purchase — ${email}`,
          html,
        });
      }
    }

    return Response.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err?.message || err);
    return new Response("Webhook Error", { status: 400 });
  }
}
