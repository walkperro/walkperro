"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { Instagram, Music2 } from "lucide-react";

type Product = {
  slug: string;
  title: string;
  tag: string;
  price: number;
  blurb: string;
  bullets: string[];
  payhipCode: string;
  featured?: boolean;
  image?: string;
};

const products: Product[] = [
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
    image: "/images/products/10-Quick-Codes.png",
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
      "Built for recurring daily cash, not virality",
      "Bonus tracking tool to keep you consistent",
    ],
    payhipCode: "/b/wealth-hacks",
    image: "/images/products/Wealth_hacks.png",
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
    // no cover yet – this card will render without an image
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
    image: "/images/products/25-Cash-Prompts.png",
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
    image: "/images/products/all-in-one-toolkit.png",
  },
];

export default function Home() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <main className="min-h-dvh bg-white text-slate-900">
      <div className="mx-auto flex min-h-dvh max-w-4xl sm:max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="flex items-center justify-between pb-6">
          <Link href="/" className="flex flex-1 items-center">
            <div className="relative h-10 sm:h-12 w-[60px] overflow-hidden flex items-center">
              <Image
                src="/images/logos/W-white-bg.png"
                alt="WalkPerro Icon"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-[0.7rem] text-slate-500">
            <a href="#exhibit" className="hover:text-slate-900 transition-colors">
              Exhibit
            </a>
            <a href="#bundle" className="hover:text-slate-900 transition-colors">
              Bundle
            </a>
            <a
              href="/manifesto"
              className="hover:text-slate-900 transition-colors"
            >
              Manifesto
            </a>

            <div className="flex items-center gap-3 pl-1">
              <a
                href="https://instagram.com/walkperro"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">WalkPerro on Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@walkperro"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Music2 className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">WalkPerro on TikTok</span>
              </a>
            </div>
          </nav>
        </header>

        {/* Hero copy */}
        <section className="mt-4">
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-700">
              The WalkPerro Exhibit
            </p>

            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-slate-900 leading-tight">
              Clean systems for relentless cashflow.
            </h1>

            <p className="text-[0.98rem] leading-7 text-slate-600">
              No clutter. No fake guru noise. Just focused digital systems to get
              you from idea → income with taste. Built for the ones who move quiet
              and hit loud.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#bundle"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold tracking-[0.2em] uppercase text-slate-50 hover:bg-emerald-700 transition-colors"
              >
                Get the bundle
              </a>
            </div>
          </div>
        </section>

        {/* Exhibit with click-to-flip cards */}
        <section id="exhibit" className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
              The Exhibit
            </h2>
            <span className="text-[0.7rem] text-slate-500">
              {products.length} pieces • instant access • lifetime updates
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {products.map((p) => {
              const isOpen = openSlug === p.slug;

              return (
                <article
                  key={p.slug}
                  className={`relative min-h-[360px] md:min-h-[380px] overflow-hidden rounded-3xl border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] border-slate-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] ${
                    p.featured
                      ? "border-emerald-500 shadow-[0_24px_80px_rgba(16,185,129,0.25)]"
                      : ""
                  } [perspective:1200px]`}
                >
                  <div
                    className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                      isOpen ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    {/* FRONT: cover + minimal info */}
                    <div className="absolute inset-0 flex flex-col px-5 py-5 [backface-visibility:hidden]">
                      <div className="flex-1 flex flex-col items-center justify-start">
                          )}
                        </div>

                        <div className="mt-4 w-full text-center space-y-1">
                          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-slate-500">
                            {p.tag}
                          </p>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {p.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1">
                            ${p.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenSlug(isOpen ? null : p.slug)}
                        className="mt-4 self-center inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-50 hover:bg-emerald-700 transition-colors"
                      >
                        View details
                      </button>
                    </div>

                    {/* BACK: full description + CTA */}
                    <div className="absolute inset-0 flex flex-col justify-between px-5 py-5 rounded-3xl bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              {p.title}
                            </h3>
                            <p className="text-[0.75rem] uppercase tracking-[0.2em] text-slate-500">
                              {p.tag}
                            </p>
                          </div>
                          <div className="text-right text-xs text-slate-600">
                            <span className="font-semibold text-slate-900">
                              ${p.price.toFixed(2)}
                            </span>
                            {p.featured && (
                              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-[1px] text-[0.6rem] uppercase tracking-[0.16em] text-emerald-700">
                                Best value
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600">{p.blurb}</p>

                        <ul className="space-y-1.5 text-[0.7rem] text-slate-600">
                          {p.bullets.map((b) => (
                            <li key={b} className="flex gap-2">
                              <span className="mt-[0.25rem] h-[3px] w-[3px] rounded-full bg-emerald-500" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <CheckoutButton
                            payhipCode={p.payhipCode}
                            slug={p.slug}
                            title={p.title}
                            price={p.price}
                          >
                            Get {p.title.split("|")[0].trim()} →
                          </CheckoutButton>
                          <span className="text-[0.65rem] text-slate-500">
                            PayPal + card checkout via Payhip • instant download
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOpenSlug(null)}
                          className="self-start text-[0.65rem] uppercase tracking-[0.18em] text-slate-500 hover:text-slate-900"
                        >
                          ← Back
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Bundle anchor (scroll target for hero CTA) */}
        <section id="bundle" className="mt-16" />

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-[0.65rem] text-slate-500">
          <span>© {new Date().getFullYear()} WalkPerro. All rights reserved.</span>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/walkperro"
              target="_blank"
              className="hover:text-slate-900 transition-colors"
            >
              IG @walkperro
            </a>
            <a
              href="https://tiktok.com/@walkperro"
              target="_blank"
              className="hover:text-slate-900 transition-colors"
            >
              TikTok @walkperro
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
