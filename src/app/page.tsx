export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">WalkPerro</h1>
            <p className="mt-2 text-white/60">
              Digital systems for modern businesses.
            </p>
          </div>

          <a
            href="#inquiry"
            className="glass rounded-2xl px-4 py-2 text-sm text-white/80 hover:text-white transition"
          >
            Request an Audit →
          </a>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <h2 className="text-xl font-medium">Build</h2>
            <p className="mt-2 text-white/60">
              Website creation, dashboards, and web apps.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="soft-border rounded-2xl p-4">
                <div className="text-white/90">Basic Site</div>
                <div className="text-white/50 text-sm">$</div>
              </div>
              <div className="soft-border rounded-2xl p-4">
                <div className="text-white/90">Site + Admin Dashboard</div>
                <div className="text-white/50 text-sm">$$</div>
              </div>
              <div className="soft-border rounded-2xl p-4">
                <div className="text-white/90">Full Web App</div>
                <div className="text-white/50 text-sm">$$$</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <h2 className="text-xl font-medium">Convert</h2>
            <p className="mt-2 text-white/60">
              SEO, GA4 tracking, and Google Ads campaigns.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="soft-border rounded-2xl p-4">
                <div className="text-white/90">SEO</div>
                <div className="text-white/50 text-sm">$</div>
              </div>
              <div className="soft-border rounded-2xl p-4">
                <div className="text-white/90">GA4 Analytics</div>
                <div className="text-white/50 text-sm">$</div>
              </div>
              <div className="soft-border rounded-2xl p-4">
                <div className="text-white/90">Google Ads</div>
                <div className="text-white/50 text-sm">$$</div>
              </div>
            </div>
          </div>
        </section>

        <section id="inquiry" className="mt-10 glass rounded-3xl p-8">
          <h3 className="text-xl font-medium">Inquiry</h3>
          <p className="mt-2 text-white/60">
            Tell us what you're building. We’ll reply with next steps.
          </p>

          <form className="mt-6 grid gap-3 md:grid-cols-2">
            <input className="glass rounded-2xl px-4 py-3 text-sm outline-none" placeholder="Name" />
            <input className="glass rounded-2xl px-4 py-3 text-sm outline-none" placeholder="Email" />
            <input className="glass rounded-2xl px-4 py-3 text-sm outline-none md:col-span-2" placeholder="Company / Project" />
            <textarea className="glass rounded-2xl px-4 py-3 text-sm outline-none md:col-span-2" rows={4} placeholder="What do you need?"></textarea>
            <button className="glass rounded-2xl px-4 py-3 text-sm text-white/90 hover:text-white transition md:col-span-2">
              Submit →
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
