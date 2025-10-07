// src/app/products/bundle/page.tsx
export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header>
        <p className="text-xs tracking-widest text-zinc-500 uppercase">WalkPerro</p>
        <h1 className="mt-2 text-4xl font-bold">ALL-IN-ONE BUNDLE</h1>
        <p className="mt-3 text-zinc-600">
          Every system. Every key. One price. Instant access to all WalkPerro digital products +
          lifetime updates.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm">
          <span className="font-medium">Launch Offer</span> <span>–30%</span>
        </div>
      </header>

      {/* What you get */}
      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Included Products</h2>
          <ul className="mt-4 space-y-3 text-zinc-700">
            <li>• <strong>$100 Days</strong> — daily action system + trackers</li>
            <li>• <strong>Wealth Hacks (F.A.C.E.)</strong> — faceless growth to $5–9k/mo</li>
            <li>• <strong>25 ChatGPT Cash Prompts</strong> — copy, paste, profit</li>
            <li>• <strong>Money Moves Toolkit</strong> — Canva templates, scripts, trackers</li>
          </ul>
          <p className="mt-4 text-sm text-zinc-500">All files + any future updates included.</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Why the Bundle</h2>
          <ul className="mt-4 space-y-3 text-zinc-700">
            <li>• One checkout → everything unlocked</li>
            <li>• Cohesive workflow from idea → content → cashflow</li>
            <li>• Best value vs buying individually</li>
            <li>• License for personal business use</li>
          </ul>

          {/* Price block */}
          <div className="mt-6 rounded-xl bg-zinc-50 p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-500 line-through">$XX.XX</span>
              <span className="text-3xl font-bold">$YY.YY</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">Limited launch pricing.</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {/* Replace with your real Lemon Squeezy bundle checkout URL */}
              <a
                href="https://YOURSTORE.lemonsqueezy.com/checkout/buy/BUNDLE_CHECKOUT_ID"
                data-ls-modal="true"
                className="rounded-xl bg-black px-6 py-3 text-white"
              >
                Unlock the Vault
              </a>

              {/* Optional crypto checkout */}
              <a
                href="https://commerce.coinbase.com/checkout/YOUR_CHECKOUT_ID"
                className="rounded-xl border border-black px-6 py-3"
              >
                Pay with Crypto
              </a>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              Secured checkout • Instant download • Lifetime updates
            </p>
          </div>
        </div>
      </section>

      {/* What’s inside details */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold">What’s Inside (Highlights)</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <ul className="space-y-2 text-zinc-700">
            <li>• 90-day planners & trackers</li>
            <li>• Content hooks, scripts, and CTAs</li>
            <li>• AI workflows for research, writing, posting</li>
          </ul>
          <ul className="space-y-2 text-zinc-700">
            <li>• Ready-to-edit Canva ads & flyers</li>
            <li>• Sales pages + product descriptions</li>
            <li>• Outreach scripts for affiliates & clients</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-4 space-y-6 text-zinc-700">
          <div>
            <p className="font-medium">How do I access files?</p>
            <p className="text-zinc-600">Right after checkout you’ll get instant download links + future update access.</p>
          </div>
          <div>
            <p className="font-medium">Commercial use?</p>
            <p className="text-zinc-600">Yes, for your own business and client work. Redistribution/resale of source files is not allowed.</p>
          </div>
          <div>
            <p className="font-medium">Refunds?</p>
            <p className="text-zinc-600">
              Digital products are non-refundable, but we stand behind the bundle—reach out if you need help.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews (placeholder) */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <p className="mt-2 text-zinc-600">Coming soon.</p>
      </section>
    </main>
  );
}
