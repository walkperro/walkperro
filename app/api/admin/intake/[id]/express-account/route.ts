import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { admin } from "@/lib/supabase/admin";
import { withAdmin, isContext } from "@/lib/auth/require-admin-api";
import { audit } from "@/lib/auth/audit";

// Create (or reuse) a Stripe Express account for a creator and return a fresh
// hosted-onboarding link. Operator triggers this from /admin/intake and sends
// the link to the creator.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await withAdmin(req);
  if (!isContext(ctx)) return ctx;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey)
    return NextResponse.json(
      { ok: false, error: "stripe_not_configured" },
      { status: 503 }
    );

  const { id } = await params;
  const supa = admin();
  const { data: row, error } = await supa
    .from("intake_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !row)
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const stripe = new Stripe(stripeKey);
  const appUrl = process.env.APP_URL || "https://www.walkperro.com";

  try {
    let accountId: string = row.stripe_account_id;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: row.email,
        metadata: { intake_submission_id: id, handle: row.handle },
      });
      accountId = account.id;
      await supa
        .from("intake_submissions")
        .update({ stripe_account_id: accountId })
        .eq("id", id);
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      // TODO(walk): a nicer landing for refresh/return than the homepage.
      refresh_url: `${appUrl}/?onboarding=refresh`,
      return_url: `${appUrl}/?onboarding=done`,
      type: "account_onboarding",
    });

    await audit(ctx.user.id, "intake_express_account", {
      id,
      account: accountId,
    });
    return NextResponse.json({ ok: true, accountId, url: link.url });
  } catch (e) {
    console.error("EXPRESS_ACCOUNT_ERROR", e);
    return NextResponse.json(
      { ok: false, error: "stripe_error" },
      { status: 502 }
    );
  }
}
