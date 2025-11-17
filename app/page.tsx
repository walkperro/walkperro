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
    image: "/images/logos/10-Quick-Codes.png",
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
    image: "/images/logos/Wealth_hacks.png",
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
    // Add cover art when ready
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
    image: "/images/logos/25-Cash-Prompts.png",
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
    image: "/images/logos/all-in-one-toolkit.png",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#f6f5f3] text-slate-900">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="flex items-center justify-between pb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Image
                src="/images/logos/Icon-black-bg.png"
                alt="WalkPerro"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div className="leading-tight">
              <div className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-slate-900">
                WalkPerro
              </div>
              <div className="text-[0.65rem] text-slate-500">
                Tools for people who actually move.
              </div>
              <div className="text-[0.6rem] text-slate-400">
                Grind today, win forever.
              </div>
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

            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/walkperro"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-colors"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">WalkPerro on Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@walkperro"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-colors"
              >
                <Music2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">WalkPerro on TikTok</span>
              </a>
            </div>
          </nav>
        </header>

        {/* Hero banner */}
        <section className="relative w-full overflow-hidden rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
          <Image
            src="/images/logos/banner-white-bg.png"
            alt="WalkPerro Banner"
            width={2000}
            height={800}
            priority
            className="w-full h-[260px] sm:h-[320px] md:h-[380px] object-cover"
          />
        </section>

        {/* Supporting hero copy */}
        <section className="mt-10">
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

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#bundle"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold tracking-[0.2em] uppercase text-slate-50 hover:bg-emerald-700 transition-colors"
              >
                View the bundle
              </a>
              <p className="text-xs text-slate-500">
                PayPal + card checkout via Payhip. Files delivered instantly.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-3xl border-t border-slate-200 pt-4 text-[0.7rem] text-slate-500">
            Curated for builders, ghosts & quiet killers who want clean tools, not
            chaos.
          </div>
        </section>

        {/* Exhibit */}
        <section id="exhibit" className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
              The Exhibit
            </h2>
            <span className="text-[0.7rem] text-slate-500">
              {products.length} pieces • instant access • lifetime updates
            </span>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            {products.map((p) => (
              <article
                key={p.slug}
                className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] border-slate-200 ${
                  p.featured
                    ? "border-emerald-500 shadow-[0_24px_80px_rgba(16,185,129,0.25)]"
                    : ""
                }`}
              >
                {p.image && (
                  <div className="relative w-full bg-slate-100 px-4 pt-4">
                    <div className="relative mx-auto h-64 w-full max-w-xs">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-contain"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-3 px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {p.title}
                      </h3>
                      <p className="text-[0.75rem] uppercase tracking-[0.2em] text-slate-500">
                        {p.tag}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-600">
                      <div className="font-semibold text-slate-900">
                        ${p.price.toFixed(2)}
                        {p.featured && (
                          <span className="ml-1 rounded-full bg-emerald-100 px-2 py-[1px] text-[0.6rem] uppercase tracking-[0.16em] text-emerald-700">
                            Best value
                          </span>
                        )}
                      </div>
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

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <CheckoutButton
                      payhipCode={p.payhipCode}
                      slug={p.slug}
                      title={p.title}
                      price={p.price}
                    >
                      Get {p.title.split("|")[0].trim()} →
                    </CheckoutButton>
                    <span className="text-[0.65rem] text-slate-500">
                      Secure checkout via Payhip • instant download
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bundle anchor (scroll target) */}
        <section id="bundle" className="mt-16" />

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between border-t border-slate-200 pt-4 text-[0.65rem] text-slate-500">
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
