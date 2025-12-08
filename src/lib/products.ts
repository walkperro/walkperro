export type Product = {
  slug: string;
  name: string;
  eyebrow: string;
  price: string; // display label like "$9.99"
  coverImage: string | null;
  bullets: string[];
  footerLine?: string;
  stripePriceId: string;
};

export const products: Product[] = [
  {
    slug: "10-quick-codes",
    name: "10 Quick Codes for $100 Days",
    eyebrow: "FAST & EASY SIDE INCOME GUIDE",
    price: "$9.99",
    coverImage: "/images/products/10-Quick-Codes.png",
    bullets: [
      "Ten low-barrier plays to hit your first $100 days fast.",
      "Step-by-step breakdowns for each hustle.",
      "Zero–minimal startup costs.",
      "Bonus: tools, apps & ChatGPT prompts.",
    ],
    footerLine: "Best for getting motion TODAY, not someday.",
    stripePriceId: "price_1SbjuCCCBLLo4EMcvRTE72Ar",
  },
  {
    slug: "wealth-hacks",
    name: "WalkPerro Wealth Hacks",
    eyebrow: "FACELESS SOCIAL MEDIA CASHFLOW SECRETS",
    price: "$16.99",
    coverImage: "/images/products/Wealth_hacks.png",
    bullets: [
      "Faceless content systems built for quiet cashflow.",
      "Page layouts, hooks & posting cadences.",
      "How to stack multiple faceless pages into one income web.",
    ],
    footerLine: "Perfect if you want to print cash without being the face.",
    stripePriceId: "price_1Sbm8tCCBLLo4EMcp76vrtrw",
  },
  {
    slug: "money-moves",
    name: "Money Moves Toolkit",
    eyebrow: "FLIP, RESELL & STACK QUICKLY",
    price: "$16.99",
    coverImage: null,
    bullets: [
      "Plays for flipping, reselling & quick-turn cash injections.",
      "Checklists for sourcing, listing & moving product fast.",
      "Built to layer on top of your 9-5 without burnout.",
    ],
    footerLine: "Ideal for people who like deals, arbitrage & stacks.",
    stripePriceId: "price_1SbmBeCCBLLo4EMc9ueTdbkv",
  },
  {
    slug: "chatgpt-cash-hacks",
    name: "ChatGPT Cash Hacks",
    eyebrow: "25 PROMPTS THAT PRINT MONEY",
    price: "$6.99",
    coverImage: "/images/products/25-Cash-Prompts.png",
    bullets: [
      "25 battle-tested prompts to spin up offers, funnels & content.",
      "Prompts for product ideas, copy, upsells & backend offers.",
      "No prompt-engineering degree needed — just copy, paste, tweak.",
    ],
    footerLine: "Best for turning ChatGPT into a quiet business partner.",
    stripePriceId: "price_1SbmDoCCBLLo4EMccp2qIyDo",
  },
  {
    slug: "all-in-one",
    name: "All-In-One Toolkit Bundle",
    eyebrow: "EVERY SYSTEM, EVERY KEY, ONE PRICE",
    price: "$34.99",
    coverImage: "/images/products/all-in-one-toolkit.png",
    bullets: [
      "Includes 10 Quick Codes, Wealth Hacks, Money Moves & ChatGPT Cash Hacks.",
      "Cohesive system: hustles + tools + prompts that lock together.",
      "Swipe-ready templates so you don’t start from a blank page.",
    ],
    footerLine: "For the ones who want the full WalkPerro starter stack.",
    stripePriceId: "price_1SbmGUCCBLLo4EMcI3h2ZHKl",
  },
];

export function getProductBySlug(slug: string) {
  return products.find(p => p.slug === slug) ?? null;
}
