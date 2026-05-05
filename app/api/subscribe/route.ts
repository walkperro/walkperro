import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM = process.env.RESEND_FROM || "walkperro <hello@walkperro.com>";
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  const resend = new Resend(apiKey);

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (AUDIENCE_ID) {
      await resend.contacts.create({ email, audienceId: AUDIENCE_ID });
    }

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "walkperro — you're in.",
      html: `
        <div style="font-family:ui-monospace,SFMono-Regular,JetBrains Mono,monospace;color:#0E0E0E;background:#F5F1E8;padding:32px">
          <p style="margin:0 0 16px 0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B">// welcome</p>
          <p style="margin:0 0 12px 0;font-family:Georgia,'Instrument Serif',serif;font-size:24px;line-height:1.1">You're on the list.</p>
          <p style="margin:0 0 24px 0;color:#1A1A1A;font-family:Georgia,serif">Field notes land here. No fluff. One opinion per post, defended.</p>
          <p style="margin:0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B6B">— walkperro</p>
        </div>
      `,
    });

    if (process.env.NOTIFY_SIGNUPS_TO) {
      await resend.emails.send({
        from: FROM,
        to: process.env.NOTIFY_SIGNUPS_TO,
        subject: "new walkperro subscriber",
        text: email,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("SUBSCRIBE_ERROR", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
