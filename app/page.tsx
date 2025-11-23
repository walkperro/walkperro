"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Product = {
  slug: string;
  name: string;
  eyebrow: string;
  price: string;
  coverImage: string | null;
  payhipUrl: string;
  payhipProductId: string;
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
    bullets: [
      "Ten low-barrier plays to hit your first $100 days fast.",
      "Step-by-step breakdowns for each hustle.",
      "Zero–minimal startup costs.",
      "Beginner-friendly but scalable.",
      "Bonus: tools, apps & ChatGPT prompts.",
    ],
    footerLine: "Best for getting motion this week, not someday.",
  },
  {
    slug: "wealth-hacks",
    name: "WalkPerro Wealth Hacks",
    eyebrow: "FACELESS SOCIAL MEDIA CASHFLOW SECRETS",
    price: "$16.99",
    coverImage: "/images/products/Wealth_hacks.png",
    payhipUrl: "https://payhip.com/b/1Q7gO",
    payhipProductId: "1Q7gO",
    bullets: [
      "Faceless content systems built for quiet cashflow.",
      "Page layouts, hooks & posting cadences.",
      "How to stack multiple faceless pages into one income web.",
      "Includes plug-and-play prompt frameworks.",
      "Optimized for people who’d rather move than talk.",
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
    bullets: [
      "Plays for flipping, reselling & quick-turn cash injections.",
      "Checklists for sourcing, listing & moving product fast.",
      "Simple tracking sheets so every move has a purpose.",
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
    bullets: [
      "25 battle-tested prompts to spin up offers, funnels & content.",
      "Prompts for product ideas, copy, upsells & backend offers.",
      "Structured so you can reuse them across multiple hustles.",
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
    bullets: [
      "Includes 10 Quick Codes, Wealth Hacks, Money Moves & ChatGPT Cash Hacks.",
      "Cohesive system: hustles + tools + prompts that lock together.",
      "Swipe-ready templates so you don’t start from a blank page.",
      "Lifetime updates as the Exhibit grows.",
      "Best value if you’re serious about daily motion, not one-off hype.",
    ],
    footerLine: "For the ones who want the full WalkPerro starter stack.",
  },
];

export default function HomePage() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-0">
        {/* Top nav */}
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm">
              W
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#exhibit" className="hover:text-slate-900">
              Exhibit
            </a>
            <a href="#bundle" className="hover:text-slate-900">
              Bundle
            </a>
            <a href="/manifesto" className="hover:text-slate-900">
              Manifesto
            </a>
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
            No clutter. No fake guru noise. Just focused digital systems to get
            you from idea → income with taste. Built for the ones who move
            quiet and hit loud.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href="#bundle"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold tracking-[0.15em] text-white transition hover:bg-slate-800"
            >
              GET THE BUNDLE
            </a>
          </div>
        </section>

        {/* Exhibit */}
        <section id="exhibit" className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              The Exhibit
            </p>
            <p className="text-xs text-slate-400">
              5 pieces • instant access • lifetime updates
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 [perspective:1600px] sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isOpen = openSlug === product.slug;

              return (
                <article key={product.slug} className="rounded-[32px]">
                  {/* flip card */}
                  <div
                    className="relative w-full min-h-[560px] sm:min-h-[520px] md:min-h-[520px] lg:min-h-[520px] md:min-h-[500px] lg:min-h-[480px] rounded-[32px] shadow-md transition-transform duration-500 [transform-style:preserve-3d]"
                    style={{
                      transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* FRONT: full cover */}
                    <div className="absolute inset-0 overflow-hidden rounded-[32px] [backface-visibility:hidden]">
                      {product.coverImage ? (
                        <Image
                          src={product.coverImage}
                          alt={product.name}
                          width={960}
                          height={1280}
                          priority={product.slug === "10-quick-codes"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-400">
                          Cover coming soon
                        </div>
                      )}
                    </div>

                    {/* BACK: mirrored blurred cover + mist */}
                    <div
                      className="absolute inset-0 overflow-hidden rounded-[32px] [backface-visibility:hidden]"
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      {product.coverImage && (
                        <div
                          className="absolute inset-0 bg-cover bg-center scale-x-[-1]"
                          style={{
                            backgroundImage: `url(${product.coverImage})`,
                          }}
                        />
                      )}

                      {/* overlay for readability */}
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-[32px]" />

                      <div className="relative z-10 flex h-full flex-col pt-5 pb-4">
                        <div className="px-4 text-center">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                            {product.eyebrow}
                          </p>
                          <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                            {product.name}
                          </h2>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {product.price}
                          </p>
                        </div>

                        <div className="mt-5 flex-1 space-y-5 px-4 text-sm text-slate-800">
                          <ul className="space-y-2">
                            {product.bullets.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-emerald-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          {product.footerLine && (
                            <p className="text-xs text-slate-600">
                              {product.footerLine}
                            </p>
                          )}

                          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                            PayPal + card checkout via Payhip · instant download
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 px-4 pb-1">
                          {/* PAYHIP OVERLAY BUTTON */}
                          <a
                            href={product.payhipUrl}
                            data-product={product.payhipProductId}
                            data-theme="none"
                            className="payhip-buy-button inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-slate-800"
                          >
                            {product.slug === "all-in-one"
                              ? "Get All-In-One Bundle"
                              : product.slug === "10-quick-codes"
                              ? "Get 10 Quick Codes"
                              : `Get ${product.name}`}
                          </a>

                          <button
                            type="button"
                            onClick={() => setOpenSlug(null)}
                            className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:border-slate-400 hover:text-slate-800"
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA bar under the card */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSlug((current) =>
                          current === product.slug ? null : product.slug
                        )
                      }
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-slate-800"
                    >
                      View details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Bundle anchor */}
        <section id="bundle" className="mt-20" aria-hidden="true" />
      </div>
    </main>
  );
}
