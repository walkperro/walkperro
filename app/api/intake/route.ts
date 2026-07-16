import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase/admin";
import { isEmail } from "@/lib/validation";
import { rateLimit, ipKey } from "@/lib/rate-limit";

// Public intake form → walkperro.intake_submissions (service-role write;
// table is default-deny RLS, admin-only read via /admin/intake).
export const runtime = "nodejs";

const PLATFORMS = new Set(["tiktok", "instagram", "youtube"]);
const AUDIENCE = new Set(["<10k", "10k-50k", "50k-200k", "200k+"]);

function str(v: unknown, max = 2000): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().slice(0, max);
  return s.length ? s : null;
}

export async function POST(req: NextRequest) {
  try {
    const { limited } = await rateLimit(ipKey(req.headers, "intake"), {
      windowSeconds: 300,
      max: 5,
    });
    if (limited)
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );

    const body = await req.json().catch(() => ({}));

    // Honeypot: silently accept bot submissions without writing anything.
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = str(body.name, 120);
    const email = str(body.email, 200)?.toLowerCase() ?? null;
    const handle = str(body.handle, 120)?.replace(/^@/, "") ?? null;
    const platform = typeof body.platform === "string" ? body.platform : "";

    if (!name || !email || !handle || !PLATFORMS.has(platform)) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 }
      );
    }

    const audienceRaw = typeof body.audience_size === "string" ? body.audience_size : "";
    const { error } = await admin().from("intake_submissions").insert({
      name,
      email,
      phone: str(body.phone, 60),
      platform,
      handle,
      other_links: str(body.other_links, 500),
      niche: str(body.niche, 200),
      audience_size: AUDIENCE.has(audienceRaw) ? audienceRaw : null,
      q_always_ask: str(body.q_always_ask),
      q_result: str(body.q_result),
      q_would_charge: str(body.q_would_charge, 200),
    });
    if (error) {
      console.error("INTAKE_INSERT_ERROR", error);
      return NextResponse.json(
        { ok: false, error: "server_error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("INTAKE_ERROR", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
