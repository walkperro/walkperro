import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact WalkPerro about websites, dashboards, SEO, analytics, and Google Ads support.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="pageWrap">
      <h1 className="pageTitle">Contact WalkPerro</h1>
      <p className="pageMuted">
        Start with the homepage or services inquiry form for scoped requests, or email{" "}
        <a href="mailto:hello@walkperro.com">hello@walkperro.com</a>.
      </p>
      <section className="policySection">
        <h2 className="policyH2">Best first message</h2>
        <p className="pageMuted">
          Include what you need, your timeline, and whether you need a website, dashboard, SEO, GA4, or Google Ads.
        </p>
      </section>
    </main>
  );
}
