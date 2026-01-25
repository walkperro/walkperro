export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-16">
        {/* HERO */}
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">WalkPerro</h1>
            <div className="mt-5 h-px w-28 bg-white/12" />
            <p className="mt-4 muted max-w-sm">
              Digital systems for modern businesses.
            </p>
          </div>

          <a
            href="#inquiry"
            className="pill text-sm text-white/80 hover:text-white transition"
          >
            Request an Audit <span className="text-white/50">→</span>
          </a>
        </header>

        {/* CARDS */}
        <div className="mt-12 grid gap-10">
          {/* BUILD CARD */}
          <section id="build" className="relative card card-hover p-8">
            <div className="card-inner">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold">Build</h2>
                  <p className="mt-2 muted">
                    Website creation, dashboards, and web apps.
                  </p>
                </div>
                <div className="hidden sm:block text-xs muted2">
                  from simple to scalable
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="pill">
                  <div className="text-white/90 font-medium">Basic Site</div>
                  <div className="muted2 text-sm">$</div>
                </div>
                <div className="pill">
                  <div className="text-white/90 font-medium">Site + Admin Dashboard</div>
                  <div className="muted2 text-sm">$$</div>
                </div>
                <div className="pill">
                  <div className="text-white/90 font-medium">Full Web App</div>
                  <div className="muted2 text-sm">$$$</div>
                </div>
              </div>
            </div>
          </section>

          {/* CONVERT CARD */}
          <section id="convert" className="relative card card-hover p-8">
            <div className="card-inner">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold">Convert</h2>
                  <p className="mt-2 muted">
                    SEO, GA4 tracking, and Google Ads campaigns.
                  </p>
                </div>
                <div className="hidden sm:block text-xs muted2">
                  measurable growth
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="pill">
                  <div className="text-white/90 font-medium">SEO</div>
                  <div className="muted2 text-sm">$</div>
                </div>
                <div className="pill">
                  <div className="text-white/90 font-medium">GA4 Analytics</div>
                  <div className="muted2 text-sm">$</div>
                </div>
                <div className="pill">
                  <div className="text-white/90 font-medium">Google Ads</div>
                  <div className="muted2 text-sm">$$</div>
                </div>
              </div>
            </div>
          </section>

          {/* INQUIRY CARD */}
          <section id="inquiry" className="relative card p-8">
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
                  Submit <span className="text-white/50">→</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
