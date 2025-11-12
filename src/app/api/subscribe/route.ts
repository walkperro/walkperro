import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || "WalkPerro <team@walkperro.com>";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok:false }, { status: 400 });
    }

    // Send a simple welcome (you can swap to Audiences later)
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to WalkPerro — Lead the Pack",
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;color:#111">
          <h2>Welcome to WalkPerro</h2>
          <p>You’re in. Expect clean, minimal moves that compound.</p>
          <p><a href="https://walkperro.com" style="color:#005949">Enter the Exhibit →</a></p>
        </div>
      `
    });

    // Optional: notify you
    if (process.env.NOTIFY_SIGNUPS_TO) {
      await resend.emails.send({
        from: FROM,
        to: process.env.NOTIFY_SIGNUPS_TO,
        subject: "New WalkPerro subscriber",
        text: email
      });
    }

    return NextResponse.json({ ok:true });
  } catch (e) {
    console.error("SUBSCRIBE_ERROR", e);
    return NextResponse.json({ ok:false }, { status: 500 });
  }
}
