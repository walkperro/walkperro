// src/app/products/money-moves/page.tsx
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold">Money Moves Toolkit</h1>
      <p className="mt-3 text-zinc-600">
        Ready-to-use templates and tools for flipping, reselling, and small AI gigs — built to get you paid faster.
      </p>

      <ul className="mt-6 list-disc pl-6 text-zinc-700 space-y-1">
        <li>Editable Canva templates for service flyers, marketplace ads, and social posts</li>
        <li>Copy-paste outreach messages and cashflow trackers</li>
        <li>Plug-and-play workflows to launch quick income streams in minutes</li>
        <li>Bonus: “AI Hustle Workflows” for faceless income automation</li>
        <li>Instant download • Lifetime updates</li>
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Replace with your Lemon Squeezy checkout URL */}
        <a
          href="https://YOURSTORE.lemonsqueezy.com/checkout/buy/XXXXXXXX"
          data-ls-modal="true"
          className="rounded-xl bg-black px-6 py-3 text-white"
        >
          Download the Money Moves Toolkit
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
        <h2 className="text-2xl font-semibold">What’s Inside</h2>
        <ul className="mt-4 list-disc pl-6 text-zinc-700 space-y-1">
          <li>DM scripts, tracking sheets, Canva templates</li>
          <li>Visuals for product ads, service flyers, and faceless growth posts</li>
          <li>Step-by-step “AI Hustle Workflows” to automate ideas into income</li>
        </ul>
      </section>

      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <p className="mt-2 text-zinc-600">Coming soon</p>
      </section>
    </main>
  );
}
