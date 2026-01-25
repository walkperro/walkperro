"use client";

import { useEffect, useMemo, useState } from "react";
import Spotlight from "@/components/Spotlight";

export default function Home() {
  const [step, setStep] = useState(0);

  const sections = useMemo(
    () => [
      { id: "hero", step: 0 },
      { id: "build", step: 1 },
      { id: "convert", step: 2 },
      { id: "inquiry", step: 3 },
    ],
    []
  );

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible?.target?.id) return;

        const found = sections.find((s) => s.id === visible.target.id);
        if (found) setStep(found.step);
      },
      { threshold: [0.35, 0.5, 0.65] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <main className="min-h-screen bg-black relative">
      <Spotlight step={step} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* HERO */}
        <section id="hero" className="pt-16 pb-10">
          <header className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">WalkPerro</h1>
              <div className="mt-5 h-px w-28 bg-white/15" />
              <p className="mt-4 text-white/60 max-w-sm">
                Digital systems for modern businesses.
              </p>
            </div>

            <a
              href="#inquiry"
              className="glass rounded-2xl px-5 py-3 text-sm text-white/80 hover:text-white transition"
            >
              Request an Audit <span className="text-white/50">→</span>
            </a>
          </header>
        </section>

        {/* STACK */}
        <div className="pb-16 space-y-10">
          {/* BUILD */}
          <section id="build" className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-semibold">Build</h2>
            <p className="mt-2 text-white/60">
              Website creation, dashboards, and web apps.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="soft-border rounded-2xl p-5">
                <div className="text-white/90 font-medium">Basic Site</div>
                <div className="text-white/50 text-sm">$</div>
              </div>

              <div className="soft-border rounded-2xl p-5">
                <div className="text-white/90 font-medium">Site + Admin Dashboard</div>
                <div className="text-white/50 text-sm">$$</div>
              </div>

              <div className="soft-border rounded-2xl p-5">
                <div className="text-white/90 font-medium">Full Web App</div>
                <div className="text-white/50 text-sm">$$$</div>
              </div>
            </div>
          </section>

          {/* CONVERT */}
          <section id="convert" className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-semibold">Convert</h2>
            <p className="mt-2 text-white/60">
              SEO, GA4 tracking, and Google Ads campaigns.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="soft-border rounded-2xl p-5">
                <div className="text-white/90 font-medium">SEO</div>
                <div className="text-white/50 text-sm">$</div>
              </div>

              <div className="soft-border rounded-2xl p-5">
                <div className="text-white/90 font-medium">GA4 Analytics</div>
                <div className="text-white/50 text-sm">$</div>
              </div>

              <div className="soft-border rounded-2xl p-5">
                <div className="text-white/90 font-medium">Google Ads</div>
                <div className="text-white/50 text-sm">$$</div>
              </div>
            </div>
          </section>

          {/* INQUIRY */}
          <section id="inquiry" className="glass rounded-3xl p-8">
            <h3 className="text-2xl font-semibold">Inquiry</h3>
            <p className="mt-2 text-white/60">
              Tell us what you're building. We’ll reply with next steps.
            </p>

            <form className="mt-6 grid gap-3">
              <input
                className="glass rounded-2xl px-4 py-3 text-sm outline-none"
                placeholder="Name"
              />
              <input
                className="glass rounded-2xl px-4 py-3 text-sm outline-none"
                placeholder="Email"
              />
              <input
                className="glass rounded-2xl px-4 py-3 text-sm outline-none"
                placeholder="Company / Project"
              />
              <textarea
                className="glass rounded-2xl px-4 py-3 text-sm outline-none"
                rows={4}
                placeholder="What do you need?"
              />
              <button
                type="button"
                className="glass rounded-2xl px-4 py-3 text-sm text-white/90 hover:text-white transition"
              >
                Submit <span className="text-white/50">→</span>
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
