import { redirect } from "next/navigation";
import { products } from "@/lib/products"; // {slug, stripePriceId, ...}

type Params = { params: { slug: string } };

// Legacy → Canonical slug aliases
const aliasToSlug: Record<string, string> = {
  "10-quick-codes-for-100-dollar-days": "10-quick-codes",
  "wealth-hacks": "wealth-hacks",
  "money-moves-toolkit": "money-moves",
  "25-chatgpt-prompts-that-print-money": "chatgpt-cash-hacks",
  "all-in-one-toolkit-bundle": "all-in-one",
  "all-in-one": "all-in-one",
  "10-quick-codes": "10-quick-codes",
  "chatgpt-cash-hacks": "chatgpt-cash-hacks",
};

function resolvePriceId(incoming: string): string | null {
  const canonical = aliasToSlug[incoming] ?? incoming;
  const p = products.find((x) => x.slug === canonical);
  return p?.stripePriceId ?? null;
}

export default function ProductSlugPage({ params }: Params) {
  const priceId = resolvePriceId((params.slug || "").toLowerCase());
  if (priceId) {
    redirect(`/checkout?price=${encodeURIComponent(priceId)}`);
  }
  // Fallback: go to home if truly unknown slug
  redirect("/");
}
