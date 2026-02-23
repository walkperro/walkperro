export default function FAQPage() {
  return (
    <main className="pageWrap">
      <h1 className="pageTitle">FAQ</h1>
      <p className="pageMuted">Common questions before starting a project with WalkPerro.</p>

      <section className="policySection">
        <h2 className="policyH2">What do you build?</h2>
        <p className="pageMuted">
          Websites, landing pages, admin dashboards, and conversion systems including SEO, analytics, and Google Ads setup.
        </p>
      </section>

      <section className="policySection">
        <h2 className="policyH2">How do projects start?</h2>
        <p className="pageMuted">
          Submit an inquiry with your goals and current situation. WalkPerro replies with next steps and a scoped proposal.
        </p>
      </section>

      <section className="policySection">
        <h2 className="policyH2">Do I need to share sensitive data?</h2>
        <p className="pageMuted">
          No. Do not send HIPAA/PHI or other sensitive personal information through this website or inquiry form.
        </p>
      </section>
    </main>
  );
}
