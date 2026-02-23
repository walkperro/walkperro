export default function PolicyPage() {
  return (
    <main className="pageWrap">
      <h1 className="pageTitle">Privacy & Terms</h1>
      <p className="pageMuted">
        WalkPerro provides website and digital systems services. This page summarizes how inquiries are handled and the
        basic terms for using this site.
      </p>

      <section className="policySection">
        <h2 className="policyH2">Privacy</h2>
        <p className="pageMuted">
          If you contact WalkPerro using the inquiry form or email, the information you share is used only to respond
          to your request and discuss project scope. Do not submit sensitive medical or protected health information.
        </p>
        <p className="pageMuted">
          WalkPerro does not request HIPAA/PHI data through this website. Analytics may be added in a privacy-conscious
          way for basic website measurement.
        </p>
      </section>

      <section className="policySection">
        <h2 className="policyH2">Website Use</h2>
        <p className="pageMuted">
          Content on this site is provided for general information. Project scope, timelines, deliverables, and pricing
          are finalized only after direct agreement.
        </p>
      </section>

      <section className="policySection">
        <h2 className="policyH2">Contact</h2>
        <p className="pageMuted">
          For project inquiries, use the site inquiry form or email <a href="mailto:hello@walkperro.com">hello@walkperro.com</a>.
        </p>
      </section>
    </main>
  );
}
