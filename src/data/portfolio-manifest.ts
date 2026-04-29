export interface PortfolioEntry {
  slug: string;
  rank: number;
  title: string;
  category: string;
  year: string;
  url: string | null;
  blurb: string;
  stack: string[];
  /** If true, render generated /public/brand/<slug>.webp instead of a Vercel screenshot. */
  generatedAsset?: boolean;
}

export const portfolio: PortfolioEntry[] = [
  {
    slug: "summer",
    rank: 1,
    title: "Summer Loffler",
    category: "Personal brand",
    year: "2026",
    url: "https://summerloffler.com",
    blurb:
      "Editorial brand site for a Los Angeles private trainer. Oversized display serif, Roman-numeral volume marks, intake forms wired through. Closer to a fashion lookbook than a fitness website — by design.",
    stack: ["Next.js", "Tailwind", "Identity"],
  },
  {
    slug: "shirt_shop",
    rank: 2,
    title: "Georgia Print Hub",
    category: "E-commerce",
    year: "2026",
    url: "https://gaprinthub.vercel.app",
    blurb:
      "Eight storefronts under one roof — printing, apparel, drinkware, awards, blanks. In-browser product designer, invoice-based checkout, full admin. Built to move volume without a Shopify tax.",
    stack: ["Next.js", "Supabase", "Fabric.js", "Resend"],
  },
  {
    slug: "fozzies",
    rank: 3,
    title: "Fozzie's Dining",
    category: "Restaurant",
    year: "2026",
    url: "https://fozziesdining.com",
    blurb:
      "Chef-driven dining room in Cookeville. Calligraphic mark, atmospheric bokeh photography, reservation flow. The kind of restaurant site that makes a small-town listing feel like a Michelin write-up.",
    stack: ["Next.js", "Tailwind", "Identity"],
  },
  {
    slug: "countime",
    rank: 4,
    title: "Countime",
    category: "Public-interest tool",
    year: "2026",
    url: "https://countime.vercel.app",
    blurb:
      "A quiet companion for families navigating federal sentencing. Map every camp, medical center, and holding facility; download the handbook for the place you need. Editorial, restrained, useful.",
    stack: ["Next.js", "TypeScript", "Mapbox"],
  },
  {
    slug: "process-service",
    rank: 5,
    title: "Boutin's Private Process Service",
    category: "Service business",
    year: "2026",
    url: "https://process-service.vercel.app",
    blurb:
      "A burgundy-and-cream landing for a Lafayette legal-services firm. Owner-led, conversion-tuned, no SaaS theme energy. Real local business, real lead capture.",
    stack: ["Next.js", "Tailwind"],
  },
  {
    slug: "group-home",
    rank: 6,
    title: "At Home Family Services",
    category: "Care services",
    year: "2026",
    url: "https://athomefamilyservices.com",
    blurb:
      "Supportive-living provider for adults with developmental disabilities in North Chesterfield, Virginia. Warm photography, three-track CTA (placement, tour, call), the values laid plain.",
    stack: ["Next.js", "Tailwind"],
  },
  {
    slug: "v-techinc",
    rank: 7,
    title: "V-Tech Inc.",
    category: "Service business",
    year: "2026",
    url: "https://v-techinc.vercel.app",
    blurb:
      "Stark industrial site for an underground utility contractor working telecom, power, gas, and water across the Southeast. Built for credibility — licensed, insured, field-proven.",
    stack: ["Next.js", "Tailwind"],
  },
  {
    slug: "spy-paper-bot",
    rank: 8,
    title: "SPY/QQQ ICT Options Bot",
    category: "Algorithmic trading",
    year: "2026",
    url: null,
    blurb:
      "An automated paper-trading bot reading institutional-flow signals on SPY and QQQ options. Live equity curve, per-trade P&L, win rate, hold-time analytics — generated nightly to a static dashboard.",
    stack: ["Python", "Pandas", "Chart.js", "Cron"],
  },
];
