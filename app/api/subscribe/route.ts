import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { admin } from "@/lib/supabase/admin";
import { rateLimit, ipKey } from "@/lib/rate-limit";
import { isEmail } from "@/lib/validation";
import { welcomeHtml, welcomeText } from "@/lib/email/welcome";

const FROM = process.env.RESEND_FROM || "walkperro <walkperro@walkperro.com>";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit per IP
    const { limited } = await rateLimit(ipKey(req.headers, "subscribe"), {
      windowSeconds: 60,
      max: 5,
    });
    if (limited) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    // 2. Validate payload
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" ? body.source : "unknown";

    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }
    if (source.length > 64) {
      return NextResponse.json({ ok: false, error: "invalid_source" }, { status: 400 });
    }

    const supa = admin();

    // 3. Insert into subscribers (ON CONFLICT DO NOTHING)
    const { data: existing } = await supa
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, status: "already_subscribed", id: existing.id });
    }

    const { data: inserted, error: insErr } = await supa
      .from("subscribers")
      .insert({ email, source })
      .select("id")
      .single();

    if (insErr || !inserted) {
      console.error("SUBSCRIBE_INSERT_ERROR", insErr);
      return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    }

    // 4. Audit log (admin_user_id null since this is public signup)
    await supa.from("admin_audit_log").insert({
      admin_user_id: null,
      action: "subscribe",
      details: { subscriber_id: inserted.id, source },
      ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      user_agent: req.headers.get("user-agent") || null,
    });

    // 5. Resend audience + welcome email (best-effort — never block success on Resend errors)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);

        let audienceId = process.env.RESEND_AUDIENCE_ID;
        if (!audienceId) {
          const { data: aud } = await resend.audiences.create({ name: "WalkPerro Subscribers" });
          if (aud?.id) {
            audienceId = aud.id;
            console.log(`ADD THIS TO ENV → RESEND_AUDIENCE_ID=${aud.id}`);
          }
        }
        if (audienceId) {
          await resend.contacts.create({ email, audienceId, unsubscribed: false });
        }

        await resend.emails.send({
          from: FROM,
          to: email,
          subject: "you're in.",
          html: welcomeHtml(),
          text: welcomeText(),
        });

        if (process.env.NOTIFY_SIGNUPS_TO) {
          await resend.emails.send({
            from: FROM,
            to: process.env.NOTIFY_SIGNUPS_TO,
            subject: `new walkperro subscriber (${source})`,
            text: `${email}\nsource: ${source}\nid: ${inserted.id}`,
          });
        }
      } catch (e) {
        console.warn("SUBSCRIBE_EMAIL_WARNING", e);
        // do not fail the request — subscriber is saved in DB
      }
    }

    return NextResponse.json({ ok: true, status: "subscribed", id: inserted.id });
  } catch (e) {
    console.error("SUBSCRIBE_ERROR", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
