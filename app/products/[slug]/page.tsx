import { redirect, notFound } from "next/navigation";

// Map legacy aliases -> canonical slugs
const aliasToSlug: Record<string, string> = {
  // legacy → canonical
  "all-in-one-toolkit-bundle": "all-in-one",
  "money-moves-toolkit": "money-moves",
  "25-chatgpt-prompts-that-print-money": "chatgpt-cash-hacks",
  "10-quick-codes-for-100-dollar-days": "10-quick-codes",
};

// Canonical slug → Stripe priceId (from src/lib/products.ts)
const slugToPrice: Record<string, string> = {
  "10-quick-codes": "price_1SbjuCCCBLLo4EMcvRTE72Ar",
  "wealth-hacks": "price_1Sbm8tCCBLLo4EMcp76vrtrw",
  "money-moves": "price_1SbmBeCCBLLo4EMc9ueTdbkv",
  "chatgpt-cash-hacks": "price_1SbmDoCCBLLo4EMccp2qIyDo",
  "all-in-one": "price_1SbmGUCCBLLo4EMcI3h2ZHKl",
};

// Ensure this route is evaluated at request time
export const dynamic = "force-dynamic";

export default function LegacyProductRedirect({
  params,
}: {
  params: { slug: string };
}) {
  const incoming = (params?.slug || "").toLowerCase();
  const canonical = aliasToSlug[incoming] ?? incoming;
  const priceId = slugToPrice[canonical];

  if (!priceId) {
    // Unknown slug → 404 (so we don't bounce to /)
    notFound();
  }

  redirect(`/checkout?price=${encodeURIComponent(priceId)}`);
}
