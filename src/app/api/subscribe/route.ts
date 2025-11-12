import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || "WalkPerro <team@walkperro.com>";
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID; // <- set this in Vercel

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok:false }, { status: 400 });
    }

    // 1) Add contact to your Resend Audience (list)
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
      });
    }

    // 2) Send a clean welcome email
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to WalkPerro — Lead the Pack",
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;color:#F8F8F8;background:#0B0B0C;padding:24px">
          <h2 style="margin:0 0 8px 0;color:#F8F8F8">Welcome to WalkPerro</h2>
          <p style="margin:0 0 12px 0;color:#B8B8B8">Minimal moves that compound. You’re in.</p>
          <p style="margin:0"><a href="https://walkperro.com" style="color:#005949;text-decoration:none">Enter the Exhibit →</a></p>
        </div>
      `,
    });

    // Optional: notify you
    if (process.env.NOTIFY_SIGNUPS_TO) {
      await resend.emails.send({
        from: FROM,
        to: process.env.NOTIFY_SIGNUPS_TO,
        subject: "New WalkPerro subscriber",
        text: email,
      });
    }

    return NextResponse.json({ ok:true });
  } catch (e) {
    console.error("SUBSCRIBE_ERROR", e);
    return NextResponse.json({ ok:false }, { status: 500 });
  }
}
