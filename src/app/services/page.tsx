"use client";

import NavMenu from "@/components/NavMenu";
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
            desc: "Clean, fast, modern. Built to look premium and convert.",
            bullets: ["1–5 pages", "Mobile-first", "Modern UI", "Launch-ready"],
          },
          {
            key: "dash",
            name: "Site + Admin Dashboard",
            price: "$$",
            desc: "Website + database + internal dashboard to manage leads, content, or operations.",
            bullets: ["Database", "Admin portal", "Auth", "Automation-ready"],
          },
          {
            key: "webapp",
            name: "Full Web App",
            price: "$$$",
            desc: "A real product: subscriptions, workflows, dashboards, automation, integrations.",
            bullets: ["Custom features", "Payments", "Integrations", "Production build"],
          },
        ],
      },
      convert: {
        title: "Convert",
        subtitle: "Search, tracking, and paid growth.",
        tabs: ["SEO", "GA4", "Ads"],
        cards: [
          {
            key: "seo",
            name: "SEO",
            price: "$",
            desc: "Structure + technical fixes so you show up for what matters.",
            bullets: ["On-page", "Indexing", "Local-ready", "Technical audit"],
          },
          {
            key: "ga4",
            name: "GA4 Analytics",
            price: "$",
            desc: "Track key actions so you know what works and what doesn’t.",
            bullets: ["GA4 setup", "Key events", "Funnels", "Reports"],
          },
          {
            key: "ads",
            name: "Google Ads",
            price: "$$",
            desc: "Conversion-focused campaigns with clean measurement and iteration.",
            bullets: ["Conversion setup", "Search campaigns", "Optimization", "Reporting"],
          },
        ],
      },
    } as const;
  }, []);

  const active = data[mode];

  useEffect(() => {
    setSub(0);
    requestAnimationFrame(() => {
      const first = active.cards[0];
      document.getElementById(`card-${mode}-${first.key}`)?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    const c = active.cards[sub];
    if (!c) return;
    document.getElementById(`card-${mode}-${c.key}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [sub, mode, active.cards]);

  return (
    <main className="wpPage" style={{ overflowX: "hidden" }}>
      <NavMenu />

      <div className="wpWrap">
        <header className="wpHeader">
          <h1 className="wpH1">Services</h1>
          <p className="wpLead">Pick what you want. We’ll scope it and reply with next steps.</p>
        </header>

        <div className="wpControls">
          <div className="wpSegment">
            <button className={mode === "build" ? "active" : ""} onClick={() => setMode("build")} type="button">
              Build
            </button>
            <button className={mode === "convert" ? "active" : ""} onClick={() => setMode("convert")} type="button">
              Convert
            </button>
          </div>

          <div className="wpTabs">
            {active.tabs.map((t, i) => (
              <button key={t} className={sub === i ? "active" : ""} onClick={() => setSub(i)} type="button">
                {t}
              </button>
            ))}
          </div>
        </div>

        <section className="wpSectionIntro" aria-label="Active category">
          <div className="wpKicker">{active.title}</div>
          <h2 className="wpH2">{active.subtitle}</h2>
        </section>

        <div className="wpRail" aria-label="Service cards">
          {active.cards.map((c) => (
            <article key={c.key} id={`card-${mode}-${c.key}`} className="wpCard">
              <div className="wpCardTop">
                <div className="wpCardTitle">{c.name}</div>
                <div className="wpPrice">{c.price}</div>
              </div>

              <p className="wpDesc">{c.desc}</p>

              <ul className="wpBullets">
                {c.bullets.map((b) => (
                  <li key={b}>
                    <span className="wpDot" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <a href="#inquiry" className="wpCta">
                Request this <span>→</span>
              </a>
            </article>
          ))}
        </div>

        <section id="inquiry" className="wpInquiry">
          <h3 className="wpH3">Inquiry</h3>
          <p className="wpLead2">Tell us what you want built. We’ll reply with next steps.</p>

          <form className="wpForm">
            <input className="wpInput" placeholder="Name" />
            <input className="wpInput" placeholder="Email" />
            <input className="wpInput" placeholder="Company / Project" />
            <textarea className="wpInput" rows={4} placeholder="What do you need?" />
            <button className="wpBtn" type="button">
              Submit <span>→</span>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
