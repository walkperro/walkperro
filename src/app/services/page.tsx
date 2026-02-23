"use client";

import { useEffect, useMemo, useState, useRef } from "react";

type Mode = "build" | "convert";

export default function ServicesPage() {
  const [mode, setMode] = useState<Mode>("build");
  const [sub, setSub] = useState(0);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formDetails, setFormDetails] = useState("");
  const [formError, setFormError] = useState("");
  const [formSent, setFormSent] = useState(false);

  const railRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  


  // Prevent onScroll from fighting click-to-scroll
  const progRef = useRef(false);
  const progTimerRef = useRef<number | null>(null);
  const lockScrollSync = (ms = 700) => {
    progRef.current = true;
    if (progTimerRef.current) window.clearTimeout(progTimerRef.current);
    progTimerRef.current = window.setTimeout(() => {
      progRef.current = false;
    }, ms);
  };

  const onTabClick = (i: number) => {
    lockScrollSync(750);
    setSub(i);
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-sub-idx]"));
    const el = cards[i];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };
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
    lockScrollSync(750);
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

const onRailScroll = () => {
  const rail = railRef.current;
  if (!rail) return;
  if (progRef.current) return;

  if (rafRef.current) cancelAnimationFrame(rafRef.current);
  rafRef.current = requestAnimationFrame(() => {
    const rect = rail.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    const els = Array.from(rail.querySelectorAll<HTMLElement>("[data-sub-idx]"));
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (const el of els) {
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - centerX);
      const idxAttr = el.getAttribute("data-sub-idx");
      const idx = idxAttr ? parseInt(idxAttr, 10) : 0
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    }

    if (bestIdx !== sub) setSub(bestIdx);
  });
};

  useEffect(() => {
    const t = setTimeout(() => onRailScroll(), 50);
    return () => clearTimeout(t);
  }, [mode]);

  const submitInquiry = () => {
    setFormError("");
    const name = formName.trim();
    const email = formEmail.trim();
    const details = formDetails.trim();

    if (!name || !email || !details) {
      setFormError("Name, email, and project details are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid email address.");
      return;
    }

    const body = [
      `Page: /services`,
      `Mode: ${mode}`,
      `Category: ${active.tabs[sub] ?? "n/a"}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Company/Project: ${formCompany.trim() || "N/A"}`,
      "",
      details,
    ].join("\n");

    window.location.href = `mailto:hello@walkperro.com?subject=${encodeURIComponent(
      `WalkPerro service inquiry (${mode})`,
    )}&body=${encodeURIComponent(body)}`;
    setFormSent(true);
  };


  return (
    <main className="wpPage" style={{ overflowX: "hidden" }}>
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
              <button key={t} className={sub === i ? "active" : ""} onClick={() => onTabClick(i)} type="button">
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="wpModePane" key={mode}>

        <section className="wpSectionIntro" aria-label="Active category">
          <div className="wpKicker">{active.title}</div>
          <h2 className="wpH2">{active.subtitle}</h2>
        </section>

        <div className="wpRail" aria-label="Service cards" ref={railRef} onScroll={onRailScroll}>
          {active.cards.map((c, idx) => (
            <article key={c.key} id={`card-${mode}-${c.key}`} className="wpCard" data-sub-idx={idx}>
              <div className="wpCardTop">
                <div className="wpCardTitle">{c.name}</div>
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
            <input className="wpInput" placeholder="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <input className="wpInput" type="email" placeholder="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            <input className="wpInput" placeholder="Company / Project" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
            <textarea className="wpInput" rows={4} placeholder="What do you need?" value={formDetails} onChange={(e) => setFormDetails(e.target.value)} />
            {formError ? <p className="wpFormNote wpFormError">{formError}</p> : null}
            {formSent ? <p className="wpFormNote">Your email app was opened with a draft inquiry.</p> : null}
            <button className="wpBtn" type="button" onClick={submitInquiry}>
              Submit <span>→</span>
            </button>
          </form>
        </section>
      </div>
    </div>
    </main>
  );
}
