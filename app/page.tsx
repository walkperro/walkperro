import Link from "next/link";

const products = [
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

function BuyButton({ payhipCode, label }: { payhipCode: string; label: string }) {
  const href = `https://payhip.com${payhipCode}`;
  return (
    <a
      href={href}
      className="payhip-buy-button inline-flex items-center justify-center rounded-full border border-emerald px-5 py-2 text-sm font-medium tracking-wide text-emerald hover:bg-emerald hover:text-ink transition-colors"
    >
      {label}
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-dvh bg-ink text-bone">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between pb-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-bone/20 text-xs tracking-[0.25em] uppercase">
              WP
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-bone/70">
                WalkPerro
              </span>
              <span className="text-[0.7rem] text-bone/40">For those who lead the pack.</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-xs text-bone/60">
            <a href="#exhibit" className="hover:text-bone transition-colors">
              Exhibit
            </a>
            <a href="#bundle" className="hover:text-bone transition-colors">
              Bundle
            </a>
            <a
              href="https://instagram.com/walkperro"
              className="hover:text-bone transition-colors"
              target="_blank"
            >
              IG
            </a>
            <a
              href="https://tiktok.com/@walkperro"
              className="hover:text-bone transition-colors"
              target="_blank"
            >
              TikTok
            </a>
          </nav>
        </header>

        <section className="flex flex-1 flex-col justify-center gap-10">
          <div className="space-y-6 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald/80">
              The WalkPerro Exhibit
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl leading-tight text-bone">
              Luxury-minimal tools
              <br />
              for relentless cashflow.
            </h1>
            <p className="text-sm sm:text-base text-bone/70">
              No clutter. No fake guru noise. Just focused digital systems to get you from idea →
              income with taste. Built for the ones who move quiet and hit loud.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#bundle"
                className="inline-flex items-center justify-center rounded-full bg-bone px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-ink hover:bg-emerald hover:text-ink transition-colors"
              >
                View the bundle
              </a>
              <p className="text-[0.7rem] text-bone/50">
                PayPal + card checkout via Payhip.
                <br />
                Files delivered instantly.
              </p>
            </div>
          </div>

          <div className="border-t border-bone/10 pt-4 text-[0.7rem] text-bone/45">
            Curated for: builders, ghosts, side-hustlers and quiet killers who want clean tools, not
            chaos.
          </div>
        </section>

        <section id="exhibit" className="mt-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-bone/60">
              The Exhibit
            </h2>
            <span className="text-[0.7rem] text-bone/50">
              {products.length} pieces • instant access • lifetime updates
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p) => (
              <article
                key={p.slug}
                className={`flex flex-col justify-between rounded-3xl border border-bone/12 bg-bone/2.5 px-5 py-5 backdrop-blur-sm ${
                  p.featured ? "border-emerald/60 bg-emerald/4" : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-bone">{p.title}</h3>
                      <p className="text-[0.75rem] uppercase tracking-[0.2em] text-bone/55">
                        {p.tag}
                      </p>
                    </div>
                    <div className="text-right text-xs text-bone/60">
                      <div className="font-semibold text-bone">
                        ${p.price.toFixed(2)}{" "}
                        {p.featured && (
                          <span className="ml-1 rounded-full bg-emerald/10 px-2 py-[1px] text-[0.6rem] uppercase tracking-[0.2em] text-emerald">
                            Best value
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-bone/70">{p.blurb}</p>

                  <ul className="space-y-1.5 text-[0.7rem] text-bone/55">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-[0.25rem] h-[3px] w-[3px] rounded-full bg-emerald/70" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <BuyButton payhipCode={p.payhipCode} label="Get it →" />
                  <span className="text-[0.65rem] text-bone/45">
                    Secure checkout via Payhip • instant download
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-10 flex items-center justify-between border-t border-bone/10 pt-4 text-[0.65rem] text-bone/45">
          <span>© {new Date().getFullYear()} WalkPerro. All rights reserved.</span>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/walkperro"
              target="_blank"
              className="hover:text-bone/80 transition-colors"
            >
              IG @walkperro
            </a>
            <a
              href="https://tiktok.com/@walkperro"
              target="_blank"
              className="hover:text-bone/80 transition-colors"
            >
              TikTok @walkperro
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
