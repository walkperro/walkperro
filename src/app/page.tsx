"use client";

import { useMemo, useRef, useState } from "react";

type BuildNeed = "card" | "more";
type BoolPick = "yes" | "no";

export default function LandingTour() {
  const [interest, setInterest] = useState<"build" | "convert" | "both" | null>(null);
  const [buildNeed, setBuildNeed] = useState<BuildNeed | null>(null);
  const [dashboard, setDashboard] = useState<BoolPick | null>(null);
  const [seo, setSeo] = useState<BoolPick | null>(null);
  const [ga4, setGa4] = useState<BoolPick | null>(null);
  const [ads, setAds] = useState<BoolPick | null>(null);

  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const refs = useRef<Array<HTMLElement | null>>([]);

  const go = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const summary = useMemo(() => {
    const picks: string[] = [];
    if (interest) picks.push(`Interest: ${interest}`);
    if (buildNeed) picks.push(`Website: ${buildNeed === "card" ? "simple" : "more than simple"}`);
    if (dashboard) picks.push(`Dashboard/Admin: ${dashboard}`);
    if (seo) picks.push(`SEO: ${seo}`);
    if (ga4) picks.push(`GA4: ${ga4}`);
    if (ads) picks.push(`Ads: ${ads}`);
    return picks.join(" • ");
  }, [interest, buildNeed, dashboard, seo, ga4, ads]);

  return (
    <main className="tour">
      <section className="tourSection" ref={(el) => { refs.current[0] = el; }}>
        <div className="tourInner">
          <div className="tourTop">
            <div>
              <h1 className="tourTitle">WalkPerro</h1>
              <p className="tourSub">Digital systems for modern businesses.</p>
            </div>
          </div>

          <button className="tourPrimary" type="button" onClick={() => go(1)}>
            Start <span>→</span>
          </button>

          
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[1] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">What are you most interested in today?</h2>
          <div className="tourGrid2">
            <button className="tourChoice" onClick={() => { setInterest("build"); go(2); }} type="button">Building</button>
            <button className="tourChoice" onClick={() => { setInterest("convert"); go(4); }} type="button">Conversions</button>
            <button className="tourChoice" onClick={() => { setInterest("both"); go(2); }} type="button">Both</button>
          </div>
          <p className="tourHint">You can change this later. Services are always in the menu.</p>
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[2] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">What do you need your website to do?</h2>
          <div className="tourGrid">
            <button
              className="tourChoice"
              type="button"
              onClick={() => { setBuildNeed("card"); go(4); }}
            >
              Simple landing / “virtual business card”
              <span className="tourChoiceSub">Contact info, photos, and clean pages.</span>
            </button>

            <button
              className="tourChoice"
              type="button"
              onClick={() => { setBuildNeed("more"); go(3); }}
            >
              That — and more
              <span className="tourChoiceSub">Dashboards, portals, automation, logins.</span>
            </button>
          </div>
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[3] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">Interested in an admin portal / internal dashboard?</h2>
          <p className="tourP">
            This lets you manage leads, customers, content, inventory, and operations — and scale past local competition.
          </p>
          <div className="tourGrid2">
            <button className="tourChoice" onClick={() => { setDashboard("yes"); go(4); }} type="button">Yes</button>
            <button className="tourChoice" onClick={() => { setDashboard("no"); go(4); }} type="button">Not right now</button>
          </div>
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[4] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">Do you want your website searchable on Google?</h2>
          <div className="tourGrid2">
            <button className="tourChoice" onClick={() => { setSeo("yes"); go(5); }} type="button">Yes</button>
            <button className="tourChoice" onClick={() => { setSeo("no"); go(5); }} type="button">Not interested</button>
          </div>
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[5] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">Do you want to track your website traffic and actions?</h2>
          <div className="tourGrid2">
            <button className="tourChoice" onClick={() => { setGa4("yes"); go(6); }} type="button">Yes</button>
            <button className="tourChoice" onClick={() => { setGa4("no"); go(6); }} type="button">Not interested</button>
          </div>
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[6] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">Want to increase exposure with Google Ads?</h2>
          <p className="tourP">Conversion-focused campaigns with clean measurement.</p>
          <div className="tourGrid2">
            <button className="tourChoice" onClick={() => { setAds("yes"); go(7); }} type="button">Yes</button>
            <button className="tourChoice" onClick={() => { setAds("no"); go(7); }} type="button">Not interested</button>
          </div>
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[7] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">Tell us what you’re looking for</h2>

          <div className="tourCard">
            <div className="tourCardInner">
              <div className="tourMini">Your selections</div>
              <div className="tourSummary">{summary || "No selections yet."}</div>
            </div>
          </div>

          <div className="tourForm">
            <textarea
              className="tourInput"
              rows={4}
              placeholder="Explain what you want built..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <input className="tourInput" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="tourInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="tourInput" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />

            <button className="tourPrimary" type="button" onClick={() => go(8)}>
              Submit <span>→</span>
            </button>

            <p className="tourHint">
              (Next: we’ll wire this to your real inquiry endpoint / email.)
            </p>
          </div>
        </div>
      </section>

      <section className="tourSection" ref={(el) => { refs.current[8] = el; }}>
        <div className="tourInner">
          <h2 className="tourQ">Thank you.</h2>
          <p className="tourP">We’ll contact you shortly with next steps.</p>
          
          <a className="tourLink" href="/services">View services <span>→</span></a>
        </div>
      </section>
    </main>
  );
}
