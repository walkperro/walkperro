import { NextResponse, type NextRequest } from "next/server";

const slugToPrice: Record<string, string> = {
  // Canonical
  "10-quick-codes": "price_1SbjuCCCBLLo4EMcvRTE72Ar",
  "wealth-hacks": "price_1Sbm8tCCBLLo4EMcp76vrtrw",
  "money-moves": "price_1SbmBeCCBLLo4EMc9ueTdbkv",
  "ChatGPT-cash-hacks": "price_1SbmDoCCBLLo4EMccp2qIyDo",
  "all-in-one": "price_1SbmGUCCBLLo4EMcI3h2ZHKl",

  // Legacy aliases (keep working)
  "10-quick-codes-for-100-dollar-days": "price_1SbjuCCCBLLo4EMcvRTE72Ar",
  "25-chatgpt-prompts-that-print-money": "price_1SbmDoCCBLLo4EMccp2qIyDo",
  "money-moves-toolkit": "price_1SbmBeCCBLLo4EMc9ueTdbkv",
  "all-in-one-toolkit-bundle": "price_1SbmGUCCBLLo4EMcI3h2ZHKl",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // /products/<slug>
  const m = pathname.match(/^\/products\/([^\/]+)\/?$/);
  if (!m) return NextResponse.next();

  const slug = decodeURIComponent(m[1]);
  const priceId = slugToPrice[slug];
  if (!priceId) {
    // unknown slug → 404 fallback (could redirect home if you prefer)
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  const url = new URL("/checkout", req.url);
  url.searchParams.set("price", priceId);

  // optional: pass through DOG30 upsell if present & valid
  const promo = req.nextUrl.searchParams.get("promotionCode") || req.nextUrl.searchParams.get("promo");
  if (promo) url.searchParams.set("promo", promo);

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/products/:path*"],
};
