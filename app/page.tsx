import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { products, reviews } from "@/lib/products";

export default function Home() {
  const featured = products.find((p) => p.featured) ?? products[0];

  return (
    <main className="noise-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="flex items-center justify-between pb-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline border-bone/40 text-[0.55rem] smallcaps">
              WP
            </span>
            <div className="flex flex-col leading-tight">
              <span className="smallcaps text-bone/70">WalkPerro</span>
              <span className="text-[0.7rem] text-bone/40">
                For those who lead the pack.
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-5 text-[0.7rem] text-bone/60">
            <a href="#exhibit" className="hover:text-bone transition-colors">
              Exhibit
            </a>
            <a href="#bundle" className="hover:text-bone transition-colors">
              Bundle
            </a>
            <Link
              href="/manifesto"
              className="hover:text-bone transition-colors"
            >
              Manifesto
            </Link>
            <a
              href="https://instagram.com/walkperro"
              target="_blank"
              className="hover:text-bone transition-colors"
            >
              IG
            </a>
            <a
              href="https://tiktok.com/@walkperro"
              target="_blank"
              className="hover:text-bone transition-colors"
            >
              TikTok
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col justify-center gap-10 border-y border-bone/10 py-10">
          <div className="space-y-6 max-w-xl">
            <p className="smallcaps text-emerald/80">The WalkPerro Exhibit</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight text-bone">
              Luxury-minimal tools
              <br />
              for relentless cashflow.
            </h1>
            <p className="text-sm sm:text-base text-bone/70">
              No clutter. No fake guru noise. Just focused digital systems to
              get you from idea → income with taste. Built for the ones who move
              quiet and hit loud.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#bundle"
                className="inline-flex items-center justify-center rounded-full bg-bone px-6 py-2 text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-ink hover:bg-emerald hover:text-ink transition-colors"
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

          {/* Social proof strip */}
          <div className="flex flex-wrap items-center gap-6 text-[0.7rem] text-bone/50">
            <span className="smallcaps text-bone/60">
              Curated for builders, ghosts & quiet killers.
            </span>
            <div className="flex flex-wrap gap-2 text-bone/45">
              <span className="rounded-full border border-bone/20 px-3 py-1">
                $100 days starter codes
              </span>
              <span className="rounded-full border border-bone/20 px-3 py-1">
                Faceless social cashflow
              </span>
              <span className="rounded-full border border-bone/20 px-3 py-1">
                Flip & resell templates
              </span>
            </div>
          </div>
        </section>

        {/* Exhibit */}
        <section id="exhibit" className="mt-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="smallcaps text-bone/60">The Exhibit</h2>
            <span className="text-[0.7rem] text-bone/50">
              {products.length} pieces • instant access • lifetime updates
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p) => (
              <article
                key={p.slug}
                id={p.featured ? "bundle" : undefined}
                className={`flex flex-col justify-between rounded-3xl border border-hairline border-bone/18 bg-bone/5 px-5 py-5 backdrop-blur-sm ${
                  p.featured ? "border-emerald/70 bg-emerald/6" : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-bone">
                        {p.title}
                      </h3>
                      <p className="text-[0.7rem] smallcaps tracking-[0.24em] text-bone/55">
                        {p.tag}
                      </p>
                    </div>
                    <div className="text-right text-xs text-bone/60">
                      <div className="font-semibold text-bone">
                        ${p.price.toFixed(2)}
                        {p.featured && (
                          <span className="ml-1 rounded-full bg-emerald/15 px-2 py-[1px] text-[0.6rem] uppercase tracking-[0.16em] text-emerald">
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
                  <CheckoutButton
                    payhipCode={p.payhipCode}
                    slug={p.slug}
                    title={p.title}
                    price={p.price}
                  >
                    Get it →
                  </CheckoutButton>
                  <span className="text-[0.65rem] text-bone/45">
                    Secure checkout via Payhip • instant download
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-12 space-y-4 border-t border-bone/10 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="smallcaps text-bone/60">Field notes</h2>
            <span className="text-[0.7rem] text-bone/45">
              Screenshots & receipts stay private. Just words here.
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <figure
                key={r.name}
                className="rounded-2xl border border-hairline border-bone/20 bg-ink/40 px-4 py-4 text-[0.8rem] text-bone/80"
              >
                <blockquote className="text-sm leading-relaxed">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-3 flex items-center justify-between text-[0.7rem] text-bone/55">
                  <span>{r.name}</span>
                  <span className="text-bone/40">{r.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-bone/10 pt-4 text-[0.65rem] text-bone/45">
          <span>© {new Date().getFullYear()} WalkPerro. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
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
            <Link
              href="/manifesto"
              className="hover:text-bone/80 transition-colors"
            >
              Manifesto
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
