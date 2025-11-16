import Link from "next/link";
import ProductCard from "@/components/ProductCard";

type Product = {
  slug: string;
  title: string;
  tag: string;
  price: number;
  blurb: string;
  bullets: string[];
  payhipCode: string;
  featured?: boolean;
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

const testimonials = [
  {
    quote:
      "Grabbed the bundle on a Sunday, had my first $120 day by Thursday. Clean, no fluff.",
    name: "J. Rivera",
    label: "Quiet builder",
  },
  {
    quote:
      "Wealth Hacks alone paid for itself in a week. Finally a system that matches my aesthetic.",
    name: "A. Martinez",
    label: "Faceless creator",
  },
  {
    quote:
      "The Money Moves templates removed all the overthinking. Just plug, run, collect.",
    name: "D. Carter",
    label: "Side-hustler",
  },
  {
    quote:
      "Everything feels curated. It’s not loud, just precise. WalkPerro is for people who actually move.",
    name: "M. Lopez",
    label: "Digital minimalist",
  },
];

export default function Home() {
  const bundle = products.find((p) => p.slug === "all-in-one-toolkit")!;

  return (
    <main className="min-h-dvh bg-transparent">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-10">
        {/* Top bar */}
        <header className="flex items-center justify-between pb-4 text-xs text-slate-300">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-[0.7rem] font-semibold tracking-[0.25em] uppercase">
              WP
            </span>
            <div className="leading-tight">
              <div className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase">
                WalkPerro
              </div>
              <div className="text-[0.65rem] text-slate-500">
                For those who lead the pack.
              </div>
            </div>
          </Link>

          <nav className="hidden gap-6 text-[0.7rem] text-slate-400 sm:flex">
            <a href="#exhibit" className="hover:text-slate-100 transition-colors">
              Exhibit
            </a>
            <a href="#bundle" className="hover:text-slate-100 transition-colors">
              Bundle
            </a>
            <a
              href="#field-notes"
              className="hover:text-slate-100 transition-colors"
            >
              Field notes
            </a>
            <a
              href="https://instagram.com/walkperro"
              target="_blank"
              className="hover:text-slate-100 transition-colors"
            >
              IG
            </a>
            <a
              href="https://tiktok.com/@walkperro"
              target="_blank"
              className="hover:text-slate-100 transition-colors"
            >
              TikTok
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="wp-fade mt-6 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-start">
          <div className="space-y-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
              The WalkPerro Exhibit
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-medium leading-tight">
              Luxury-minimal tools
              <br />
              for relentless cashflow.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-slate-300">
              No clutter. No fake guru noise. Just focused digital systems to
              get you from idea → income with taste. Built for the ones who
              move quiet and hit loud.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#bundle"
                className="inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-950 hover:bg-emerald-400 hover:text-slate-950 transition-colors"
              >
                View the bundle
              </a>
              <p className="text-[0.65rem] text-slate-500">
                PayPal + card checkout via Payhip.
                <br />
                Files delivered instantly.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[0.65rem] text-slate-400">
              <span className="rounded-full border border-slate-700/80 px-3 py-1">
                $100 days starter codes
              </span>
              <span className="rounded-full border border-slate-700/80 px-3 py-1">
                Faceless social cashflow
              </span>
              <span className="rounded-full border border-slate-700/80 px-3 py-1">
                Flip & resell templates
              </span>
            </div>
          </div>

          {/* Bundle highlight card */}
          <aside className="rounded-3xl border border-emerald-400/40 bg-slate-900/40 p-5 shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-sm">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Starter stack
            </p>
            <h2 className="mt-2 text-sm font-semibold text-slate-50">
              {bundle.title}
            </h2>
            <p className="mt-1 text-[0.75rem] uppercase tracking-[0.2em] text-slate-400">
              {bundle.tag}
            </p>

            <p className="mt-4 text-xs text-slate-300">{bundle.blurb}</p>

            <ul className="mt-4 space-y-1.5 text-[0.7rem] text-slate-400">
              {bundle.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-[0.25rem] h-[3px] w-[3px] rounded-full bg-emerald-300/80" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-slate-50">
                ${bundle.price.toFixed(2)}{" "}
                <span className="ml-1 rounded-full bg-emerald-400/10 px-2 py-[2px] text-[0.6rem] uppercase tracking-[0.18em] text-emerald-300">
                  Best value
                </span>
              </span>
              <span className="text-[0.65rem] text-slate-500">
                4 systems • lifetime updates
              </span>
            </div>
          </aside>
        </section>

        {/* Exhibit */}
        <section id="exhibit" className="wp-fade mt-16 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              The Exhibit
            </h2>
            <span className="text-[0.7rem] text-slate-500">
              {products.length} pieces • instant access • lifetime updates
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>
        </section>

        {/* Bundle anchor scroll target */}
        <section id="bundle" className="mt-16" />

        {/* Field notes */}
        <section
          id="field-notes"
          className="wp-fade mt-4 border-t border-slate-800 pt-10 space-y-6"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-[0.3em] uppercase text-slate-100">
                Field notes
              </h2>
              <p className="mt-1 text-[0.75rem] text-slate-500">
                Screenshots & receipts stay private. Just words here.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 text-sm leading-relaxed text-slate-200 backdrop-blur-sm"
              >
                <blockquote className="text-[0.9rem]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-3 flex items-center justify-between text-[0.75rem] text-slate-400">
                  <span>{t.name}</span>
                  <span>{t.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-col gap-3 border-t border-slate-900/80 py-6 text-[0.7rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} WalkPerro. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://tiktok.com/@walkperro"
              target="_blank"
              className="hover:text-slate-200 transition-colors"
            >
              TikTok @walkperro
            </a>
            <a
              href="https://instagram.com/walkperro"
              target="_blank"
              className="hover:text-slate-200 transition-colors"
            >
              IG @walkperro
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
