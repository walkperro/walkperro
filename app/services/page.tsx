import Link from "next/link";

type Service = {
  title: string;
  blurb: string;
  bullets: string[];
  cta: { label: string; href: string };
};

const services: Service[] = [
  {
    title: "Website Creation (Next.js / Shopify)",
    blurb: "Aesthetic, fast, conversion-ready sites. Built to look premium and sell quietly.",
    bullets: [
      "Next.js or Shopify setup",
      "Mobile-first, speed optimized",
      "Clean product/offer pages",
    ],
    cta: { label: "Start build →", href: "#start" },
  },
  {
    title: "SEO + Analytics Setup",
    blurb: "Search visibility + tracking that actually informs your moves.",
    bullets: [
      "Titles, meta, OpenGraph",
      "Product JSON-LD",
      "GA4 + events + dashboards",
    ],
    cta: { label: "Optimize now →", href: "#start" },
  },
  {
    title: "Brand Identity Kit",
    blurb: "Minimal, luxury visual system so everything you ship feels intentional.",
    bullets: [
      "Palette, type, spacing",
      "Logo + social skins",
      "Reusable components",
    ],
    cta: { label: "Get your kit →", href: "#start" },
  },
  {
    title: "AI Chatbot Creation & Integration",
    blurb: "Train a bot on your brand to answer DMs, site chat, FAQs and pre-sell offers.",
    bullets: [
      "Knowledge base ingestion",
      "Tone + guardrails",
      "Embed/site/DM integration",
    ],
    cta: { label: "Add a bot →", href: "#start" },
  },
  {
    title: "Social Media Automation",
    blurb: "Faceless posting systems that recycle content without feeling spammy.",
    bullets: [
      "Auto-post pipelines",
      "Templates & hooks",
      "Metrics that matter",
    ],
    cta: { label: "Automate posts →", href: "#start" },
  },
  {
    title: "WalkPerro Growth Loop (Affiliate Engine)",
    blurb: "Tasteful referral flywheel: content → offers → affiliates → compounding traffic.",
    bullets: [
      "“What I use” hub pages",
      "Link routing + tracking",
      "Email + blog funnel",
    ],
    cta: { label: "Install the loop →", href: "#start" },
  },
];

const tiers = [
  {
    name: "Starter Build",
    price: "$99/mo",
    tagline: "Get the basics right, faceless.",
    features: [
      "Mini site audit or 1-page landing",
      "SEO meta & OpenGraph",
      "GA4 installed + monthly report",
      "1 async DM strategy session",
    ],
    cta: { label: "Choose Starter", href: "#start" },
    best: false,
  },
  {
    name: "Growth Engine",
    price: "$249/mo",
    tagline: "Scale quietly with systems.",
    features: [
      "Full SEO pass + indexing",
      "1 blog post/month (you draft, we polish)",
      "Auto-posting (1–2 platforms)",
      "DM support + monthly optimization",
    ],
    cta: { label: "Choose Growth", href: "#start" },
    best: true,
  },
  {
    name: "Brand Domination",
    price: "$499/mo",
    tagline: "Your stealth digital team.",
    features: [
      "Website build or full rebuild",
      "SEO + analytics dashboards",
      "Daily auto-posting system",
      "Custom AI chatbot",
      "Growth Loop (affiliate engine) setup",
      "Priority DM support",
    ],
    cta: { label: "Choose Domination", href: "#start" },
    best: false,
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-12">
        {/* Hero */}
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            WalkPerro • Solutions
          </p>
          <h1 className="max-w-3xl text-4xl sm:text-5xl font-semibold leading-tight tracking-tight">
            Build your brand. Automate your income. Stay faceless.
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Asynchronous, text-only delivery. No calls. Clean systems that compound quietly.
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold tracking-[0.15em] text-white hover:bg-slate-800"
            >
              SEE PACKAGES
            </a>
            <a
              href="#start"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold tracking-[0.15em] text-slate-700 hover:border-slate-400"
            >
              START YOUR PROJECT
            </a>
          </div>
        </header>

        {/* Services grid */}
        <section className="mt-14">
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Core Services</p>
            <p className="text-xs text-slate-400">Asynchronous • DM-based • High taste</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article key={s.title} className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.blurb}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-emerald-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <a
                      href={s.cta.href}
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-slate-800"
                    >
                      {s.cta.label}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="packages" className="mt-20">
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Subscription Tiers</p>
            <p className="text-xs text-slate-400">Predictable billing • Faceless delivery</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <article
                key={t.name}
                className={`rounded-3xl border bg-white shadow-sm ${
                  t.best ? "border-emerald-400 ring-1 ring-emerald-200" : "border-slate-200"
                }`}
              >
                <div className="p-6 flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">{t.name}</h3>
                    {t.best && (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{t.tagline}</p>
                  <p className="mt-3 text-2xl font-semibold">{t.price}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-emerald-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5">
                    <a
                      href="#start"
                      className="block w-full text-center rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-slate-800"
                    >
                      {t.cta.label}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Process (faceless) */}
        <section className="mt-20">
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Process</p>
            <p className="text-xs text-slate-400">Async • Text-only • Clean handoff</p>
          </div>

          <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              ["Submit brand & goals", "Upload links, screenshots and outcomes you want."],
              ["We build the system", "Heads-down work. You stay faceless. We ship assets + docs."],
              ["Scale quietly", "Reports, tweaks, and compounding loops month after month."],
            ].map(([title, body], i) => (
              <li key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
                    {i + 1}
                  </span>
                  <h4 className="font-semibold tracking-tight">{title}</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA / Start */}
        <section id="start" className="mt-20 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold tracking-tight">Start your project</h3>
          <p className="mt-2 text-sm text-slate-600">
            100% asynchronous. No calls. After checkout you’ll receive a short intake form and a private client portal link.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/#bundle"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold tracking-[0.15em] text-white hover:bg-slate-800"
            >
              VIEW DIGITAL PRODUCTS
            </Link>
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold tracking-[0.15em] text-slate-700 hover:border-slate-400"
            >
              CHOOSE A SUBSCRIPTION
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
