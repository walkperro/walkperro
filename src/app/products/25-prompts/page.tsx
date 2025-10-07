// src/app/products/25-prompts/page.tsx
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">25 ChatGPT Money Hacks</h1>
      <p className="mt-3 text-zinc-600">
        25 plug-and-play ChatGPT prompts to turn ideas into income — fast.
      </p>

      <ul className="mt-6 list-disc pl-6 text-zinc-700 space-y-1">
        <li>Make cash with AI — content, freelancing, and passive income tricks</li>
        <li>Each prompt includes instructions for monetization and scaling</li>
        <li>Bonus: “Prompt Engineering 101” quick-start guide</li>
        <li>Instant access • Lifetime updates</li>
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Replace with your Lemon Squeezy checkout URL */}
        <a
          href="https://YOURSTORE.lemonsqueezy.com/checkout/buy/XXXXXXXX"
          data-ls-modal="true"
          className="rounded-xl bg-black px-6 py-3 text-white"
        >
          Get the 25 ChatGPT Money Hacks
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
