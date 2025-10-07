// src/app/products/100-days/page.tsx
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">$100 Days Challenge</h1>
      <p className="mt-3 text-zinc-600">
        A step-by-step system to hit $100+ every single day online — even starting from zero.
      </p>

      <ul className="mt-6 list-disc pl-6 text-zinc-700 space-y-1">
        <li>Proven daily income routines and mini hustles</li>
        <li>AI-assisted templates for faster execution</li>
        <li>Bonus: 7-Day “Momentum Mode” habit tracker</li>
        <li>Instant download • Lifetime access</li>
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Replace with your Lemon Squeezy checkout URL */}
        <a
          href="https://YOURSTORE.lemonsqueezy.com/checkout/buy/XXXXXXXX"
          data-ls-modal="true"
          className="rounded-xl bg-black px-6 py-3 text-white"
        >
          Start the $100 Days Challenge
        </a>

        {/* Optional crypto checkout (Coinbase Commerce) */}
        <a
          href="https://commerce.coinbase.com/checkout/YOUR_CHECKOUT_ID"
          className="rounded-xl border border-black px-6 py-3"
        >
          Pay with Crypto
        </a>
      </div>

      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <p className="mt-2 text-zinc-600">Coming soon</p>
      </section>
    </main>
  );
}
