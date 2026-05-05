import Link from "next/link";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";
import Badge from "@/components/Badge";
import PortfolioMarquee from "@/components/PortfolioMarquee";

const TODAY = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

const LOG_ENTRIES = [
  {
    date: "2026.05.05",
    label: "BUILD LOG",
    title: "The pricing mistake that almost killed my freelance year.",
    href: "/blog",
  },
  {
    date: "2026.04.22",
    label: "FIELD NOTE",
    title: "Cursor, Claude, and the new shape of a one-person team.",
    href: "/blog",
  },
  {
    date: "2026.04.10",
    label: "TOOL",
    title: "The 12-line script that replaced my CMS.",
    href: "/blog",
  },
];

const SERVICES = [
  "Operator-grade websites",
  "AI workflows & automations",
  "Funnel + checkout systems",
  "Database & schema design",
  "Brand systems for builders",
];

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      {/* Top bar */}
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label">
            walkperro
          </Link>
          <nav className="flex items-center gap-6 label">
            <Link href="#log" className="hover:text-charcoal">Log</Link>
            <Link href="#tools" className="hover:text-charcoal">Tools</Link>
            <Link href="#services" className="hover:text-charcoal">Services</Link>
            <Link href="#contact" className="hover:text-charcoal">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Hero — asymmetric */}
        <section data-reveal className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-20 pb-28">
          <div className="md:col-span-8">
            <Badge tone="live" className="mb-8">
              <span className="mr-2 inline-block h-1.5 w-1.5 bg-charcoal"></span>
              ONLINE — V1
            </Badge>
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.03em] max-w-3xl">
              The operator's hub for the AI era. Read, build, steal.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-charcoal/80">
              Tools, opinions, and field notes from one person doing what used
              to take a team. No hype. No fluff. Specific over clever.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#log" variant="primary">
                Read the log
              </Button>
              <Button href="#contact" variant="ghost">
                Hire the operator
              </Button>
            </div>
          </div>
          <aside className="md:col-span-4 md:pl-8 md:border-l md:border-line flex flex-col gap-2">
            <p className="label">// {TODAY}</p>
            <p className="label">STATUS / SHIPPING</p>
            <p className="label">RIG / SOLO</p>
            <p className="label">SIGNAL / OPEN</p>
          </aside>
        </section>

        {/* Portfolio */}
        <section data-reveal id="portfolio" className="py-16">
          <SectionHeader
            index="01"
            label="PORTFOLIO"
            title="Work in motion."
            meta="LIVE FEED"
          />
          <div className="mt-10">
            <PortfolioMarquee />
          </div>
        </section>

        {/* Build log */}
        <section data-reveal id="log" className="py-16">
          <SectionHeader
            index="02"
            label="BUILD LOG"
            title="What I'm shipping, breaking, and learning."
            meta={`${LOG_ENTRIES.length} ENTRIES`}
          />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {LOG_ENTRIES.map((e) => (
              <li key={e.title}>
                <Link
                  href={e.href}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 transition-colors duration-snap ease-snap hover:bg-line/40"
                >
                  <div className="md:col-span-3 label">
                    {`// ${e.date}`}
                    <span className="ml-3">{e.label}</span>
                  </div>
                  <div className="md:col-span-8">
                    <p className="font-display text-2xl leading-snug">
                      {e.title}
                    </p>
                  </div>
                  <div className="md:col-span-1 md:text-right label group-hover:text-charcoal">
                    READ →
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/blog" variant="ghost">All entries</Button>
          </div>
        </section>

        {/* Tools */}
        <section data-reveal id="tools" className="py-16">
          <SectionHeader
            index="03"
            label="TOOLS"
            title="Things I built and use daily."
            meta="OPEN SHELF"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            {[
              { name: "Stack snippets", desc: "Copy-paste blocks for Next, Supabase, Stripe wiring.", state: "DRAFT" },
              { name: "Prompt deck", desc: "Operator prompts for Claude + Cursor — versioned.", state: "DRAFT" },
              { name: "Brand kit", desc: "Bone / charcoal / signal — the system on this site.", state: "PUBLIC" },
              { name: "Field notes archive", desc: "Long-form posts, cross-linked, no SEO bait.", state: "LIVE" },
            ].map((t) => (
              <div key={t.name} className="bg-bone p-6 flex flex-col justify-between min-h-[180px]">
                <div>
                  <p className="label">{t.state}</p>
                  <h3 className="font-display text-2xl mt-2">{t.name}</h3>
                  <p className="mt-3 text-charcoal/80">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section data-reveal id="services" className="py-16">
          <SectionHeader
            index="04"
            label="SERVICES"
            title="What I build for clients."
          />
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {SERVICES.map((s) => (
              <li key={s} className="hairline first:border-0 md:[&:nth-child(2)]:border-0 py-5 flex items-baseline gap-4">
                <span className="label">→</span>
                <span className="font-display text-xl">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section data-reveal id="contact" className="py-16">
          <SectionHeader
            index="05"
            label="CONTACT"
            title="Direct line."
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 max-w-xl">
              <p className="text-lg leading-relaxed">
                If you're building something and want a second pair of hands —
                or a second opinion — write me. I read everything. I reply to
                most.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="mailto:walkperro@proton.me" external>
                  Email — walkperro@proton.me
                </Button>
                <Button href="https://instagram.com/walkperro" external variant="ghost">
                  Instagram
                </Button>
              </div>
            </div>
            <div className="md:col-span-5 md:pl-8 md:border-l md:border-line">
              <p className="label">RESPONSE / 24–48H</p>
              <p className="label mt-2">RATES / ON REQUEST</p>
              <p className="label mt-2">AVAILABILITY / ON REQUEST</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="hairline mt-12 mb-12 pt-8 flex flex-wrap items-baseline justify-between gap-3">
          <p className="label">— walkperro</p>
          <p className="label">© {new Date().getFullYear()} / FACELESS / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
