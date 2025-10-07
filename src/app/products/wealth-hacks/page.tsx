// src/app/products/wealth-hacks/page.tsx
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">Wealth Hacks (FACE Framework)</h1>
      <p className="mt-3 text-zinc-600">Faceless growth systems to scale $5–9k/mo.</p>

      <ul className="mt-6 list-disc pl-6 text-zinc-700 space-y-1">
        <li>FACE: Find → Automate → Cashflow → Explode</li>
        <li>Prompts, hooks, and a 30-day action plan</li>
        <li>Instant download • Lifetime updates</li>
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Replace with your Lemon Squeezy checkout URL */}
        <a
          href="https://YOURSTORE.lemonsqueezy.com/checkout/buy/XXXXXXXX"
          data-ls-modal="true"
          className="rounded-xl bg-black px-6 py-3 text-white"
        >
          Get Instant Access
        </a>

        {/* Optional crypto checkout (Coinbase Commerce) */}
        <a
          href="https://commerce.coinbase.com/checkout/YOUR_CHECKOUT_ID"
          className="rounded-xl border border-black px-6 py-3"
        >
          Pay with Crypto
        </a>
      </div>
    </main>
  );
}
