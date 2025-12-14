import { redirect } from "next/navigation";

const map: Record<string,string> = {
  "10-quick-codes": "price_1SbjuCCCBLLo4EMcvRTE72Ar",
  "wealth-hacks": "price_1Sbm8tCCBLLo4EMcp76vrtrw",
  "money-moves": "price_1SbmBeCCBLLo4EMc9ueTdbkv",
  "ChatGPT-cash-hacks": "price_1SbmDoCCBLLo4EMccp2qIyDo",
  "all-in-one": "price_1SbmGUCCBLLo4EMcI3h2ZHKl",
  // legacy aliases
  "10-quick-codes-for-100-dollar-days": "price_1SbjuCCCBLLo4EMcvRTE72Ar",
  "25-chatgpt-prompts-that-print-money": "price_1SbmDoCCBLLo4EMccp2qIyDo",
  "money-moves-toolkit": "price_1SbmBeCCBLLo4EMc9ueTdbkv",
  "all-in-one-toolkit-bundle": "price_1SbmGUCCBLLo4EMcI3h2ZHKl",
};

export default function ProductSlugPage({ params }: { params: { slug: string } }) {
  const price = map[decodeURIComponent(params.slug)];
  if (!price) {
    redirect("/404");
  }
  redirect(`/checkout?price=${encodeURIComponent(price)}`);
}
