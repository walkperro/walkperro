import { NextRequest, NextResponse } from "next/server";

const aliasToSlug: Record<string, string> = {
  "all-in-one-toolkit-bundle": "all-in-one",
  "money-moves-toolkit": "money-moves",
  "25-chatgpt-prompts-that-print-money": "chatgpt-cash-hacks",
  "10-quick-codes-for-100-dollar-days": "10-quick-codes",
};

const slugToPrice: Record<string, string> = {
  "10-quick-codes": "price_1SbjuCCCBLLo4EMcvRTE72Ar",
  "wealth-hacks": "price_1Sbm8tCCBLLo4EMcp76vtrtw",
  "money-moves": "price_1SbmBeCCBLLo4EMc9ueTdbkv",
  "chatgpt-cash-hacks": "price_1SbmDoCCBLLo4EMccp2qIyDo",
  "all-in-one": "price_1SbmGUCCBLLo4EMcl3h2ZHKl",
};

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params; // <-- NEW Next.js 16 requirement
  const incoming = (slug || "").toLowerCase();

  const canonical = aliasToSlug[incoming] ?? incoming;
  const priceId = slugToPrice[canonical];

  if (!priceId) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const url = new URL(req.url);
  url.pathname = "/checkout";
  url.search = `?price=${encodeURIComponent(priceId)}`;

  return NextResponse.redirect(url, 308);
}
