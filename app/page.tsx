"use client";

import Link from "next/link";
import { useState } from "react";
import Carousel3D from "@/components/Carousel3D";
import ReviewMarquee from "@/components/ReviewMarquee";

type Product = {
  slug: string;
  name: string;
  eyebrow: string;
  price: string;
  coverImage: string | null;
  payhipUrl: string;
  payhipProductId: string;
  stripePriceId: string;
  bullets: string[];
  footerLine?: string;
};

const products: Product[] = [
  {
    slug: "10-quick-codes",
    name: "10 Quick Codes for $100 Days",
    eyebrow: "FAST & EASY SIDE INCOME GUIDE",
    price: "$9.99",
    coverImage: "/images/products/10-Quick-Codes.png",
    payhipUrl: "https://payhip.com/b/RpCH3",
    payhipProductId: "RpCH3",
    stripePriceId: "price_1SbjuCCCBLLo4EMcvRTE72Ar",
    bullets: [
      "Ten low-barrier plays to hit your first $100 days fast.",
      "Step-by-step breakdowns for each hustle.",
      "Zero–minimal startup costs.",
      "Bonus: tools, apps & ChatGPT prompts.",
    ],
    footerLine: "Best for getting motion TODAY, not someday.",
  },
  {
    slug: "wealth-hacks",
    name: "WalkPerro Wealth Hacks",
    eyebrow: "FACELESS SOCIAL MEDIA CASHFLOW SECRETS",
    price: "$16.99",
    coverImage: "/images/products/Wealth_hacks.png",
    payhipUrl: "https://payhip.com/b/1Q7gO",
    payhipProductId: "1Q7gO",
    stripePriceId: "price_1Sbm8tCCBLLo4EMcp76vtrtw",
    bullets: [
      "Faceless content systems built for quiet cashflow.",
      "Page layouts, hooks & posting cadences.",
      "How to stack multiple faceless pages into one income web.",
    ],
    footerLine: "Perfect if you want to print cash without being the face.",
  },
  {
    slug: "money-moves",
    name: "Money Moves Toolkit",
    eyebrow: "FLIP, RESELL & STACK QUICKLY",
    price: "$16.99",
    coverImage: null,
    payhipUrl: "https://payhip.com/b/3xYzE",
    payhipProductId: "3xYzE",
    stripePriceId: "price_1SbmBeCCBLLo4EMc9ueTdbkv",
    bullets: [
      "Plays for flipping, reselling & quick-turn cash injections.",
      "Checklists for sourcing, listing & moving product fast.",
      "Built to layer on top of your 9-5 without burnout.",
    ],
    footerLine: "Ideal for people who like deals, arbitrage & stacks.",
  },
  {
    slug: "chatgpt-cash-hacks",
    name: "ChatGPT Cash Hacks",
    eyebrow: "25 PROMPTS THAT PRINT MONEY",
    price: "$6.99",
    coverImage: "/images/products/25-Cash-Prompts.png",
    payhipUrl: "https://payhip.com/b/Ad9zn",
    payhipProductId: "Ad9zn",
    stripePriceId: "price_1SbmDoCCBLLo4EMccp2qIyDo",
    bullets: [
      "25 battle-tested prompts to spin up offers, funnels & content.",
      "Prompts for product ideas, copy, upsells & backend offers.",
      "No prompt-engineering degree needed — just copy, paste, tweak.",
    ],
    footerLine: "Best for turning ChatGPT into a quiet business partner.",
  },
  {
    slug: "all-in-one",
    name: "All-In-One Toolkit Bundle",
    eyebrow: "EVERY SYSTEM, EVERY KEY, ONE PRICE",
    price: "$34.99",
    coverImage: "/images/products/all-in-one-toolkit.png",
    payhipUrl: "https://payhip.com/b/Pgrso",
    payhipProductId: "Pgrso",
    stripePriceId: "price_1SbmGUCCBLLo4EMcI3h2ZHKl",
    bullets: [
      "Includes ALL WalkPerro digital guides + tools.",
      "Cohesive system: hustles + tools + prompts that lock together.",
      "Swipe-ready templates so you don’t start from a blank page.",
    ],
    footerLine: "For the ones who want the full WalkPerro starter stack.",
  },
];

export default function HomePage() {
  const [loadingSku, setLoadingSku] = useState<string | null>(null);

  function buy(priceId: string) {
    setLoadingSku(priceId);
    window.location.href = `/checkout?price=${priceId}&promo=promo_1ScG1aCCBLLo4EMcTXo1qmQN`;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-0">
        {/* Top nav */}
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-lg md:text-base font-semibold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm">W</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#exhibit" className="hover:text-slate-900">Exhibit</a>
            <a href="/blog" className="hover:text-slate-900">Blog</a>
            <a href="/contact" className="hover:text-slate-900">Work with me</a>
          </nav>
        </header>

        {/* Hero */}
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            The WalkPerro Exhibit
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Clean systems for relentless cashflow.
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
            No clutter. No fake guru noise. Just focused digital systems to get you from idea → income with taste.
            Built for the ones who move quiet and hit loud.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => buy("price_1SbmGUCCBLLo4EMcI3h2ZHKl")}
              disabled={loadingSku === "price_1SbmGUCCBLLo4EMcI3h2ZHKl"}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold tracking-[0.15em] text-white transition hover:bg-slate-800 disabled:opacity-60">
              {loadingSku === "price_1SbmGUCCBLLo4EMcI3h2ZHKl" ? "Processing..." : "GET THE BUNDLE"}
            </button>
          </div>
          <ReviewMarquee />
        </section>

        {/* Exhibit */}
        <section id="exhibit" className="mt-10 sm:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">The Exhibit</p>
            <p className="text-xs text-slate-400">5 pieces • instant access • lifetime updates</p>
          </div>
          <div className="mt-8">
            <Carousel3D items={products} />
          </div>
        </section>
      </div>
    </main>
  );
}
