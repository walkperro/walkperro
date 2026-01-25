"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "build" | "convert";

export default function ServicesPage() {
  const [mode, setMode] = useState<Mode>("build");
  const [sub, setSub] = useState(0);

  const data = useMemo(() => {
    return {
      build: {
        title: "Build",
        subtitle: "Websites, dashboards, and web apps.",
        tabs: ["Basic", "Dashboard", "Webapp"],
        cards: [
          {
            key: "basic",
            name: "Basic Site",
            price: "$",
            desc: "Clean, fast, modern site. Built to convert.",
            bullets: ["1–5 pages", "Fast load", "Modern UI", "Launch-ready"],
            cta: "Request this",
          },
          {
            key: "dash",
            name: "Site + Admin Dashboard",
            price: "$$",
            desc: "Website + database + admin portal for updates, leads, content, or inventory.",
            bullets: ["Database", "Admin portal", "Auth", "Analytics-ready"],
            cta: "Request this",
          },
          {
            key: "webapp",
            name: "Full Web App",
            price: "$$$",
            desc: "A real product: subscriptions, workflows, dashboards, automation.",
            bullets: ["Custom features", "Scales", "Integrations", "Production build"],
            cta: "Request this",
          },
        ],
      },
      convert: {
        title: "Convert",
        subtitle: "Traffic, tracking, and paid growth.",
        tabs: ["SEO", "GA4", "Ads"],
        cards: [
          {
            key: "seo",
            name: "SEO",
            price: "$",
            desc: "Structure + content + technical fixes so you show up for what matters.",
            bullets: ["On-page SEO", "Indexing", "Local-ready", "Technical audit"],
            cta: "Request this",
          },
          {
            key: "ga4",
            name: "GA4 Analytics",
            price: "$",
            desc: "Track every important action so you know what works and what doesn’t.",
            bullets: ["GA4 setup", "Events", "Funnels", "Reports"],
            cta: "Request this",
          },
          {
            key: "ads",
            name: "Google Ads",
            price: "$$",
            desc: "Conversion-focused campaigns with clean measurement and iteration.",
            bullets: ["Conversion setup", "Search campaigns", "Optimization", "Reporting"],
            cta: "Request this",
          },
        ],
      },
    } as const;
  }, []);

  const active = data[mode];

  useEffect(() => {
    setSub(0);
    requestAnimationFrame(() => {
      const el = document.getElementById(`card-${mode}-${active.cards[0].key}`);
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    const card = active.cards[sub];
    if (!card) return;
    const el = document.getElementById(`card-${mode}-${card.key}`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [sub, mode, active.cards]);

  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        {/* Header */}
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Services</h1>
            <div className="mt-5 h-px w-28 bg-white/12" />
            <p className="mt-4 muted max-w-sm">
              Pick a lane. We’ll build it clean, track it properly, and scale it.
            </p>
          </div>

          <a
            href="#inquiry"
            className="pill text-sm text-white/80 hover:text-white transition"
          >
            Request an Audit <span className="text-white/50">→</span>
          </a>
        </header>

        {/* Build / Convert segmented toggle */}
        <div className="mt-10 flex items-center justify-center">
          <div className="segment">
            <button
              className={mode === "build" ? "active" : ""}
              onClick={() => setMode("build")}
              type="button"
            >
              Build
            </button>
            <button
              className={mode === "convert" ? "active" : ""}
              onClick={() => setMode("convert")}
              type="button"
            >
              Convert
            </button>
          </div>
        </div>

        {/* Mini tabs */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="minitabs">
            {active.tabs.map((t, i) => (
              <button
                key={t}
                type="button"
                className={sub === i ? "active" : ""}
                onClick={() => setSub(i)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Section title */}
        <div className="mt-10 text-center">
          <span className="text-xs text-white/55 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
            Services
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">{active.title}</h2>
          <p className="mt-2 muted">{active.subtitle}</p>
        </div>

        {/* Horizontal slider */}
        <div className="mt-10 hscroll">
          {active.cards.map((c) => (
            <div
              key={c.key}
              id={`card-${mode}-${c.key}`}
              className="snap-card relative card card-hover p-7"
            >
              <div className="card-inner">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/55">Plan</div>
                    <div className="mt-1 text-2xl font-semibold">{c.name}</div>
                  </div>
                  <div className="text-lg text-white/75 font-semibold">{c.price}</div>
                </div>

                <p className="mt-4 muted text-sm leading-relaxed">{c.desc}</p>

                {/* SLICK BULLETS (no pills) */}
                <ul className="mt-6 grid gap-2 text-sm text-white/70">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/30" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#inquiry"
                  className="mt-6 inline-flex items-center justify-center pill text-sm text-white/90 hover:text-white transition"
                >
                  {c.cta} <span className="text-white/50 ml-2">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Inquiry */}
        <section id="inquiry" className="mt-14 relative card p-8">
          <div className="card-inner">
            <h3 className="text-2xl font-semibold">Inquiry</h3>
            <p className="mt-2 muted">
              Tell us what you're building. We’ll reply with next steps.
            </p>

            <form className="mt-6 grid gap-3">
              <input className="pill text-sm outline-none bg-transparent" placeholder="Name" />
              <input className="pill text-sm outline-none bg-transparent" placeholder="Email" />
              <input className="pill text-sm outline-none bg-transparent" placeholder="Company / Project" />
              <textarea className="pill text-sm outline-none bg-transparent" rows={4} placeholder="What do you need?" />
              <button
                type="button"
                className="pill text-sm text-white/90 hover:text-white transition"
              >
                Submit <span className="text-white/50 ml-2">→</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
