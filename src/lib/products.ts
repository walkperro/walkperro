export type Product = {
  slug: string;
  title: string;
  tag: string;
  price: number;
  blurb: string;
  bullets: string[];
  payhipCode: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "10-quick-codes",
    title: "10 Quick Codes for $100 Days",
    tag: "Fast & Easy Side Income Guide",
    price: 9.99,
    blurb:
      "Ten low-barrier plays to hit your first $100 days fast. No fancy skills. No big startup cost. Just motion.",
    bullets: [
      "Step-by-step breakdowns for each hustle",
      "Zero–minimal startup costs",
      "Beginner-friendly but scalable",
      "Bonus: tools, apps & ChatGPT prompts",
      "Includes the WalkPerro Cashflow Tracker (editable PDF)",
    ],
    payhipCode: "/b/10-quick-codes-for-100-dollar-days",
  },
  {
    slug: "wealth-hacks",
    title: "WalkPerro Wealth Hacks",
    tag: "Faceless Social Media Cashflow Secrets",
    price: 16.99,
    blurb:
      "Faceless, aesthetic systems for stacking daily cashflow without ever showing your face online.",
    bullets: [
      "Aggressive faceless growth strategies",
      "Copy-paste content systems",
      "Built for recurring daily cash, not just virality",
      "Bonus tracking tool to keep you consistent",
    ],
    payhipCode: "/b/wealth-hacks",
  },
  {
    slug: "money-moves-toolkit",
    title: "Money Moves Toolkit",
    tag: "Flip, Resell & Stack Quickly",
    price: 16.99,
    blurb:
      "Plug-and-play templates for flipping, reselling and monetizing fast — without overthinking the math.",
    bullets: [
      "Resell & flipping templates",
      "Pricing + profit margin calculators",
      "Promo post templates for social",
      "Bonus AI prompts to scale your offers",
    ],
    payhipCode: "/b/money-moves-toolkit",
  },
  {
    slug: "chatgpt-cash-hacks",
    title: "ChatGPT Cash Hacks",
    tag: "25 Prompts That Print Money",
    price: 6.99,
    blurb:
      "A tight prompt pack for turning ChatGPT into a money assistant — freelance, flipping, products & more.",
    bullets: [
      "25 practical money-making prompts",
      "Side-hustle focused, not generic",
      "Designed to be copied + adapted fast",
      "Pairs perfectly with the other WalkPerro systems",
    ],
    payhipCode: "/b/25-chatgpt-prompts-that-print-money",
  },
  {
    slug: "all-in-one-toolkit",
    title: "All-In-One Toolkit Bundle",
    tag: "Every System, Every Key, One Price",
    price: 34.99,
    blurb:
      "The full WalkPerro starter stack. All the plays, all the templates, all the prompts — for the ones who lead the pack.",
    bullets: [
      "Includes all 4 core products",
      "Cohesive system: hustles + tools + prompts",
      "Best value if you're serious about motion",
      "Designed to get you earning this week, not someday",
    ],
    payhipCode: "/b/all-in-one-toolkit-bundle",
    featured: true,
  },
];

export const reviews = [
  {
    name: "J. Rivera",
    role: "Quiet builder",
    text: "Grabbed the bundle on a Sunday, had my first $120 day by Thursday. Clean, no fluff.",
  },
  {
    name: "A. Martinez",
    role: "Faceless creator",
    text: "Wealth Hacks alone paid for itself in a week. Finally a system that matches my aesthetic.",
  },
  {
    name: "D. Carter",
    role: "Side-hustler",
    text: "The Money Moves templates removed all the overthinking. Just plug, run, collect.",
  },
  {
    name: "M. Lopez",
    role: "Digital minimalist",
    text: "Everything feels curated. It’s not loud, just precise. WalkPerro is for people who actually move.",
  },
];
