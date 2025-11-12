export const products = [
  {
    slug: "10-quick-codes-for-100-dollar-days",
    title: "10 Quick Codes for $100 Days",
    price: 9.99,
    blurb: "10 low-barrier gigs you can start today — step-by-step, minimal cost. Includes the WalkPerro Cashflow Tracker.",
    payhipCode: "10-quick-codes-for-100-dollar-days",
  },
  {
    slug: "wealth-hacks",
    title: "WalkPerro Wealth Hacks | Faceless Social Media Cashflow Secrets",
    price: 16.99,
    blurb: "Aesthetic, faceless systems for fast daily cashflow. Plug-and-play growth with a progress tracker.",
    payhipCode: "wealth-hacks",
  },
  {
    slug: "money-moves-toolkit",
    title: "Money Moves Toolkit: Make Fast Cash with Proven Playbooks",
    price: 16.99,
    blurb: "Templates for flipping/reselling, margin calculators, promo posts, plus AI prompts to scale.",
    payhipCode: "money-moves-toolkit",
  },
  {
    slug: "25-chatgpt-prompts-that-print-money",
    title: "ChatGPT Cash Hacks | 25 Prompts That Print Money",
    price: 6.99,
    blurb: "25 practical money-making prompts for flipping, freelance, and digital products.",
    payhipCode: "25-chatgpt-prompts-that-print-money",
  },
  {
    slug: "all-in-one-toolkit-bundle",
    title: "ALL-IN-ONE TOOLKIT BUNDLE | Every System, Every Key, One Price",
    price: 34.99,
    blurb: "Complete WalkPerro system — all products together for a clean discount. Instant access.",
    payhipCode: "all-in-one-toolkit-bundle",
  },
] as const;
export type Product = typeof products[number];
