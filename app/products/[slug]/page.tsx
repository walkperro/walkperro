import { redirect } from "next/navigation";
import { products } from "@/lib/products";

const priceBySlug: Record<string,string> =
  Object.fromEntries(products.map(p => [p.slug.toLowerCase(), p.stripePriceId]));

const legacy: Record<string,string> = {
  "all-in-one-toolkit-bundle": "all-in-one",
  "money-moves-toolkit": "money-moves",
  "25-chatgpt-prompts-that-print-money": "chatgpt-cash-hacks",
  "10-quick-codes-for-100-dollar-days": "10-quick-codes",
};

function normalize(slug: string): string | null {
  const s = slug.toLowerCase();

  // Exact current slugs
  if (priceBySlug[s]) return s;

  // Known legacy aliases
  if (legacy[s] && priceBySlug[legacy[s]]) return legacy[s];

  // Heuristics
  if (s.includes("all-in-one")) return "all-in-one";
  if (s.includes("money-moves")) return "money-moves";
  if (s.includes("chatgpt") || s.includes("prompts")) return "chatgpt-cash-hacks";
  if (s.includes("10-quick-codes")) return "10-quick-codes";

  return null;
}

export default function ProductSlugPage({ params }: { params: { slug: string } }) {
  const norm = normalize(decodeURIComponent(params.slug));
  if (!norm) redirect("/");

  const price = priceBySlug[norm];
  redirect(`/checkout?price=${encodeURIComponent(price)}`);
}
