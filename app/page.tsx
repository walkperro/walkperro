import Link from "next/link";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";
import Badge from "@/components/Badge";
import PortfolioMarquee from "@/components/PortfolioMarquee";
import EmailCapture from "@/components/EmailCapture";
import { getPublishedPosts, getPublicTools, getSiteStats, formatDate } from "@/lib/posts-db";

export const revalidate = 60;

const TODAY = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

const SERVICES = [
  "Custom websites",
  "AI workflows & automations",
  "Funnel + checkout systems",
  "Database & schema design",
  "Brand systems",
];

export default async function HomePage() {
  const [posts, tools, stats] = await Promise.all([
    getPublishedPosts({ limit: 3 }),
    getPublicTools(), // DB filter: status != 'DRAFT' → only Painmine returns
    getSiteStats(),
  ]);

  // DROPS is dynamic (posts + non-DRAFT tools). DEPLOYS + PROMPTS are
  // operator-tracked counters bumped manually — adjust here when they tick over.
  const STATS = [
    { label: "DROPS",   value: String(stats.drops) },
    { label: "DEPLOYS", value: "40+" },
    { label: "VISION", value: "1" },
  ];

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      {/* Sticky hairline nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
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
        <section data-reveal className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-20 pb-24">
          <div className="md:col-span-8">
            <Badge tone="live" className="mb-8">
              <span className="mr-2 inline-block h-1.5 w-1.5 bg-charcoal"></span>
              // ONLINE — V1
            </Badge>
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.04em] max-w-3xl">
              For the ones who do.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-charcoal/80">
              Tools, opinions, and field notes from someone building with AI
              from the ground up. No degree. No gatekeepers. Just the work.
            </p>
            <div className="mt-10">
              <p className="label mb-3">// FIELD NOTES — WEEKLY</p>
              <EmailCapture source="hero" cta="Subscribe" />
            </div>
            <p className="mt-6 label">
              <Link href="#contact" className="border-b border-charcoal text-charcoal hover:text-charcoal/70">
                OR HIRE ME →
              </Link>
            </p>
          </div>
          <aside className="md:col-span-4 md:pl-8 md:border-l md:border-line flex flex-col gap-2">
            <p className="label">// {TODAY}</p>
            <p className="label">BUILD / DAILY</p>
            <p className="label">WRITE / WEEKLY</p>
            <p className="label">IG / @WALKPERRO</p>
          </aside>
        </section>

        {/* Portfolio */}
        <section data-reveal id="portfolio" className="py-20 border-t border-line">
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

        {/* Stats strip */}
        <section data-reveal className="border-y border-line py-6">
          <div className="grid grid-cols-3 divide-x divide-line">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-3 px-6 first:pl-0">
                <p className="label">{s.label} /</p>
                <p className="font-display text-2xl">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured product — CloseHound */}
        <section data-reveal className="py-20">
          <div className="bg-charcoal text-bone p-10 md:p-14 grid grid-cols-1 md:grid-cols-12 gap-10 border border-charcoal">
            <div className="md:col-span-7">
              <p className="label text-smoke">// FEATURED — PRODUCT</p>
              <div className="hairline-dark mt-3" />
              <p className="label text-smoke mt-6">CLOSEHOUND / V0</p>
              <h3 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.0] tracking-[-0.02em] mt-3 max-w-xl">
                Invite-only seller waitlist for the AI era of sales.
              </h3>
              <p className="mt-6 text-bone/80 max-w-md leading-relaxed">
                We provide the product. We provide the leads. You make the
                sale. Join the waitlist to get vetted for when CloseHound
                launches.
              </p>
              <div className="mt-8">
                <p className="label text-smoke mb-3">// JOIN THE WAITLIST</p>
                <EmailCapture source="closehound" cta="Get in" variant="dark" />
              </div>
            </div>
            <div className="md:col-span-5 md:pl-8 md:border-l md:border-line-dark flex flex-col gap-2">
              <p className="label text-smoke">STATE / PRE-LAUNCH</p>
              <p className="label text-smoke">ACCESS / VETTED</p>
              <p className="label text-smoke">FEE / NONE</p>
            </div>
          </div>
        </section>

        {/* Build log */}
        <section data-reveal id="log" className="py-20">
          <SectionHeader
            index="02"
            label="BUILD LOG"
            meta={`${posts.length} ${posts.length === 1 ? "ENTRY" : "ENTRIES"}`}
          />
          {posts.length > 0 ? (
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {posts.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/log/${e.slug}`}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 transition-colors duration-snap ease-snap hover:bg-line/40"
                  >
                    <div className="md:col-span-3 label">
                      {`// ${formatDate(e.published_at)}`}
                      <span className="ml-3">{e.category}</span>
                    </div>
                    <div className="md:col-span-8">
                      <p className="font-display text-2xl leading-snug">{e.title}</p>
                    </div>
                    <div className="md:col-span-1 md:text-right label group-hover:text-charcoal">
                      READ →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8">
            <Button href="/log" variant="ghost">All entries</Button>
          </div>
        </section>

        {/* Tools */}
        <section data-reveal id="tools" className="py-20">
          <SectionHeader
            index="03"
            label="TOOLS"
            title="What I use."
            meta="OPEN SHELF"
          />
          {tools.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
              {tools.map((t, i) => {
                const card = (
                  <div className="bg-bone p-6 flex flex-col justify-between min-h-[180px] h-full">
                    <div className="flex items-center justify-between">
                      <p className="label">{t.status}</p>
                      <p className="label text-charcoal/30">// {`0${i + 1}`}</p>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl mt-2">{t.title}</h3>
                      <p className="mt-3 text-charcoal/80">{t.description}</p>
                    </div>
                  </div>
                );
                return t.slug ? (
                  <Link key={`${t.slug}-${i}`} href={`/tools/${t.slug}`} className="block hover:bg-line/40 transition-colors">
                    {card}
                  </Link>
                ) : (
                  <div key={`tool-${i}`}>{card}</div>
                );
              })}
            </div>
          ) : (
            <p className="mt-10 label text-smoke">// MORE TOOLS COMING SOON.</p>
          )}
        </section>

        {/* Services */}
        <section data-reveal id="services" className="py-20">
          <SectionHeader
            index="04"
            label="SERVICES"
            title="What I build for clients."
          />
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {SERVICES.map((s) => (
              <li
                key={s}
                className="py-5 flex items-baseline gap-4 border-t border-line first:border-t-0 md:[&:nth-child(2)]:border-t-0"
              >
                <span className="label">→</span>
                <span className="font-display text-xl">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section data-reveal id="contact" className="py-20">
          <SectionHeader
            index="05"
            label="CONTACT"
            title="Direct line."
          />
          <div className="mt-10 max-w-xl">
            <p className="text-lg leading-relaxed">
              If you're building something and want a second pair of hands —
              or a second opinion — write me. I read everything. I reply to
              most.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="mailto:walkperro@proton.me" external>
                EMAIL →
              </Button>
              <Button href="https://instagram.com/walkperro" external variant="ghost">
                INSTAGRAM →
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="hairline mt-12 mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 walkperro / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
