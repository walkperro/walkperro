import type { Metadata } from "next";
import IntakeForm from "@/components/landing/IntakeForm";

export const metadata: Metadata = {
  title: "walkperro — we build your digital product. free.",
  description:
    "you've already posted everything your product needs. we read your account, build a digital product in your voice, and set up the checkout. free to start — you keep 80% of every sale.",
};

// Concierge MVP landing. One page, one CTA. The full self-serve SaaS is
// parked on the saas-full-build branch.

const EXAMPLES = [
  {
    kind: "GUIDE",
    title: "the $50 grocery week",
    by: "@prepwithsam",
    niche: "meal prep",
    price: "$19",
  },
  {
    kind: "PROGRAM",
    title: "hit 150g protein without thinking",
    by: "@liftwithmarcus",
    niche: "fitness",
    price: "$29",
  },
  {
    kind: "PLAYBOOK",
    title: "the 90-day reset journal",
    by: "@manifestwithdee",
    niche: "mindset",
    price: "$24",
  },
];

const STEPS = [
  {
    n: "01",
    title: "tell us about your content",
    body: "a 2-minute form. your handle, your niche, the question your followers keep asking.",
    demoLink: false,
  },
  {
    n: "02",
    title: "we build your product",
    body: "",
    demoLink: true,
  },
  {
    n: "03",
    title: "you sell it. you keep 80%.",
    body: "we set up your stripe and hand you a checkout link. money goes straight to your account. we only earn when you do.",
    demoLink: false,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bone text-charcoal">
      {/* header — wordmark only, no nav */}
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="font-mono text-sm tracking-tight">walkperro</span>
        <span className="label hidden sm:block">for the ones who do.</span>
      </header>

      {/* hero */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-24 sm:pt-32">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-block h-2.5 w-2.5 bg-signal" aria-hidden />
          <span className="label">// creators only</span>
        </div>
        <h1 className="max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.03em] sm:text-7xl">
          we build your digital product. free. you keep 80%.
        </h1>
        <p className="mt-8 max-w-prose text-lg leading-relaxed text-smoke">
          you&apos;ve already posted everything your product needs. we read your
          account, write the product in your voice, design it, and set up the
          checkout. you promote it to the audience you already have.
        </p>
        <div className="mt-10">
          <a
            href="#start"
            className="inline-block border border-charcoal bg-charcoal px-8 py-4 font-mono text-xs uppercase tracking-[0.08em] text-bone transition-colors duration-150 hover:bg-signal hover:text-charcoal"
          >
            build my product — free
          </a>
        </div>
      </section>

      {/* examples */}
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <div className="mb-10 flex items-baseline justify-between">
            <span className="label">// 01 — WHAT WE MAKE</span>
            <span className="hidden font-mono text-xs text-smoke sm:block">
              examples — yours will look like you
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {EXAMPLES.map((ex) => (
              <div key={ex.title}>
                {/* TODO(walk): swap these CSS mockups for real product screenshots */}
                <div className="flex aspect-[3/4] flex-col justify-between border border-charcoal bg-charcoal p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone/60">
                      {ex.kind}
                    </span>
                    <span className="font-mono text-[10px] text-bone/60">
                      {ex.price}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight tracking-[-0.01em] text-bone">
                    {ex.title}
                  </h3>
                  <div className="border-t border-line-dark pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-bone/60">
                      {ex.by} · {ex.niche}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <span className="label">// 02 — HOW IT WORKS</span>
          <ol className="mt-10 space-y-12">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-6 sm:gap-10">
                <span className="font-mono text-sm text-smoke">{s.n}</span>
                <div>
                  <h3 className="font-display text-2xl leading-tight tracking-[-0.01em] sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-smoke">
                    {s.demoLink ? (
                      <>
                        we read your whole account — the words, the topics, the
                        way you talk — and turn what you&apos;ve already posted
                        into a product that sounds like you. want proof?{" "}
                        <a
                          href="/demo"
                          className="border-b border-charcoal text-charcoal hover:bg-signal"
                        >
                          watch the engine read a real account
                        </a>
                        .
                      </>
                    ) : (
                      s.body
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* intake */}
      <section id="start" className="border-t border-line">
        <div className="mx-auto w-full max-w-3xl px-6 py-20">
          <span className="label">// 03 — START</span>
          <h2 className="mt-6 font-display text-4xl leading-[1.0] tracking-[-0.02em] sm:text-5xl">
            two minutes. then we get to work.
          </h2>
          <div className="mt-12">
            <IntakeForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-8">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <span className="font-mono text-xs text-smoke">
            walkperro — for the ones who do.
          </span>
          <span className="font-mono text-xs text-smoke">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}
