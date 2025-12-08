"use client";

import Link from "next/link";
import { useState } from "react";
import Carousel3D from "@/components/Carousel3D";
import ReviewMarquee from "@/components/ReviewMarquee";
import { products } from "@/lib/products";

type Product = {
  slug: string;
  name: string;
  eyebrow: string;
  price: string;
  coverImage: string | null;
  stripePriceId: string; // NEW
  bullets: string[];
  footerLine?: string;
};

export default function HomePage() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [loadingSku, setLoadingSku] = useState<string | null>(null);

  async function buy(priceId: string) {
    try {
      setLoadingSku(priceId);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceIds: [priceId] }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingSku(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-0">
        {/* Top nav */}
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-lg md:text-base font-semibold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm">
              W
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#exhibit" className="hover:text-slate-900">Exhibit</a>
            <a href="#bundle" className="hover:text-slate-900">Bundle</a>
            <a href="/manifesto" className="hover:text-slate-900">Manifesto</a>
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
            No clutter. No fake guru noise. Just focused digital systems to get
            you from idea → income with taste. Built for the ones who move quiet
            and hit loud.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => buy("price_1SbmGUCCBLLo4EMcI3h2ZHKl")}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold tracking-[0.15em] text-white transition hover:bg-slate-800"
            >
              GET THE BUNDLE
            </button>
          </div>

          <ReviewMarquee />
        </section>

        {/* Exhibit */}
        <section id="exhibit" className="mt-10 sm:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              The Exhibit
            </p>
            <p className="text-xs text-slate-400">
              5 pieces • instant access • lifetime updates
            </p>
          </div>

          <div className="mt-8">
            <Carousel3D items={products} />
          </div>
        </section>

        {/* Bundle anchor */}
        <section id="bundle" className="mt-20" aria-hidden="true" />
      </div>
    </main>
  );
}
