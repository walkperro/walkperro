import Link from "next/link";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";
import Badge from "@/components/Badge";
import EmailCapture from "@/components/EmailCapture";
import LinkCard from "@/components/LinkCard";
import ProjectStage from "@/components/ProjectStage";
import ServicesGrid from "@/components/ServicesGrid";
import CourseTease from "@/components/CourseTease";
import { getAllStageItems, getFlagshipProjects, type Project } from "@/lib/projects";
import { getPublishedPosts, formatDate } from "@/lib/posts-db";

// Maps each flagship project to a schema.org applicationCategory so Google's
// Rich Results renders the right product class. The url falls back to the
// in-page #re-study-waitlist anchor when a flagship has no public URL yet.
const APP_CATEGORY: Record<string, string> = {
  closehound: "BusinessApplication",
  asere: "EducationApplication",
  "1k2rich": "FinanceApplication",
  "re-study": "EducationApplication",
};

function projectsJsonLd(flagships: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "walkperro projects",
    description:
      "live products and projects shipped by walkperro — sec8 housing ai, spanish for miami, trading bot, ga/fl real estate study app.",
    url: "https://www.walkperro.com/",
    isPartOf: { "@id": "https://www.walkperro.com/#site" },
    mainEntity: {
      "@type": "ItemList",
      name: "flagship products",
      numberOfItems: flagships.length,
      itemListElement: flagships.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: p.title,
          applicationCategory: APP_CATEGORY[p.slug] || "BusinessApplication",
          operatingSystem: "Web",
          url:
            p.externalUrl ||
            `https://www.walkperro.com/#${p.slug}-waitlist`,
          description: p.blurb,
          image: `https://www.walkperro.com${p.image}`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability:
              p.status === "live"
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
          },
        },
      })),
    },
  };
}

// Homepage v2 — linktree + cinematic stage. Mobile single column, desktop
// theater split via CSS grid placement. Metadata inherits from app/layout.tsx
// (no per-page override). Plan:
//   /Users/ironclaw/.claude/plans/walkperro-admin-declarative-giraffe.md

export const revalidate = 60;

const TODAY = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

export default async function HomePage() {
  const [posts, stageItems] = await Promise.all([
    getPublishedPosts({ limit: 3 }),
    Promise.resolve(getAllStageItems()),
  ]);
  const flagships = getFlagshipProjects();
  const jsonLd = projectsJsonLd(flagships);

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Sticky hairline nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <nav className="hidden md:flex items-center gap-6 label">
            <Link href="#projects" className="hover:text-charcoal">Projects</Link>
            <Link href="#log" className="hover:text-charcoal">Log</Link>
            <Link href="#services" className="hover:text-charcoal">Services</Link>
            <Link href="#contact" className="hover:text-charcoal">Contact</Link>
          </nav>
          <Link href="#contact" className="md:hidden label">CONTACT →</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">

        {/* THEATER — mobile single column, desktop split via grid placement */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12">

          {/* HERO (left rail) */}
          <section
            data-reveal
            className="lg:col-span-5 lg:row-start-1 pt-12 lg:pt-20"
          >
            {/* Prominent /websites entry — Walk's #1 ask is that this is the
                first thing you see. It owns the signal-yellow accent in VP1
                on mobile (replacing the live badge's fill), so the brand
                rule "one yellow per viewport" still holds. On desktop the
                ProjectStage's active-dot carries the yellow instead. */}
            <Link
              href="/websites"
              className="group mb-6 flex w-full max-w-md items-center justify-between gap-4 border border-charcoal bg-signal text-charcoal px-5 py-4 transition-colors duration-snap ease-snap hover:bg-charcoal hover:text-bone lg:!bg-bone lg:hover:!bg-charcoal lg:hover:!text-bone"
            >
              <span className="flex flex-col gap-1 min-w-0">
                <span className="font-mono uppercase tracking-label text-[0.65rem] text-charcoal/70 group-hover:text-bone/70 lg:text-charcoal/60">
                  // i build websites
                </span>
                <span className="font-display text-lg leading-tight">
                  see what i can build for you
                </span>
              </span>
              <span className="font-mono uppercase tracking-label text-[0.75rem] shrink-0 transition-transform duration-snap ease-snap group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Badge
              tone="live"
              // outline-only at all breakpoints now that the /websites CTA
              // above carries the signal-yellow accent on mobile. Stage dot
              // still carries it on desktop.
              className="mb-8 !bg-transparent"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 bg-charcoal"></span>
              // ONLINE
            </Badge>
            <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] max-w-3xl">
              for the ones who do.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-charcoal/80">
              tools, products, and field notes from a builder shipping with
              ai from the ground floor. no degree. no gatekeepers. just the work.
            </p>
            <div className="mt-8">
              <p className="label mb-3">// field notes — weekly</p>
              <EmailCapture source="hero" cta="Subscribe" />
            </div>
            <p className="mt-6 label">
              <Link
                href="#contact"
                className="border-b border-charcoal text-charcoal hover:text-charcoal/70"
              >
                OR HIRE ME →
              </Link>
            </p>
          </section>

          {/* STAGE — between hero and linkcards on mobile, sticky right rail on desktop */}
          <section
            id="projects"
            data-reveal
            className="lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-5 lg:sticky lg:top-20 lg:self-start lg:h-[calc(100vh-6rem)] lg:pt-20"
          >
            <SectionHeader index="01" label="PROJECTS" meta="// LIVE FEED" />
            <div className="mt-6 lg:h-full lg:mt-8">
              <ProjectStage items={stageItems} accentDot fillHeight={false} className="lg:!h-full lg:!aspect-auto" />
            </div>
          </section>

          {/* LINKCARDS — the four big CTAs */}
          <section
            data-reveal
            id="build-with-me"
            className="lg:col-span-5 lg:row-start-2"
          >
            <SectionHeader index="02" label="BUILD WITH ME" meta="// 04 LIVE" />
            <div className="mt-8 flex flex-col gap-3">
              <LinkCard
                label="make money with sec8 housing using ai"
                sublabel="// closehound — live"
                href="https://closehound.com"
                external
                accentMobileOnly
              />
              <LinkCard
                label="learn the language of miami"
                sublabel="// asere — live"
                href="https://asere.vercel.app"
                external
              />
              <LinkCard
                label="follow the trading bot in real time"
                sublabel="// 1k2rich — live"
                href="https://1k2rich.vercel.app"
                external
              />
              <div id="re-study-waitlist">
                <LinkCard
                  label="learn the ga/fl real estate edge"
                  sublabel="// re-study"
                >
                  <EmailCapture source="re-study" cta="Notify me" />
                </LinkCard>
              </div>
            </div>
          </section>

          {/* COURSE TEASE */}
          <div className="lg:col-span-5 lg:row-start-3">
            <CourseTease />
          </div>

          {/* CONTACT (left rail tail) */}
          <section
            data-reveal
            id="contact"
            className="lg:col-span-5 lg:row-start-4 py-12 lg:pb-20"
          >
            <SectionHeader index="06" label="CONTACT" />
            <div className="mt-8 max-w-xl">
              <p className="text-lg leading-relaxed">
                building something? want a second pair of hands or a second opinion?
                write me. i read everything. i reply to most.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="mailto:walkperro@proton.me" external>
                  EMAIL →
                </Button>
                <Button
                  href="https://instagram.com/walkperro"
                  external
                  variant="ghost"
                >
                  INSTAGRAM →
                </Button>
              </div>
            </div>
          </section>
        </div>
        {/* /THEATER */}

        {/* BELOW-FOLD — full width, single column */}

        {/* BUILD LOG */}
        <section
          data-reveal
          id="log"
          className="py-20 border-t border-line"
        >
          <SectionHeader
            index="04"
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
          ) : null}
          <div className="mt-8">
            <Button href="/log" variant="ghost">
              ALL ENTRIES →
            </Button>
          </div>
        </section>

        {/* SERVICES */}
        <section
          data-reveal
          id="services"
          className="py-20 border-t border-line"
        >
          <SectionHeader
            index="05"
            label="SERVICES"
            title="what i build for clients."
          />
          <ServicesGrid />
        </section>

        {/* FOOTER */}
        <footer className="hairline mt-12 mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 walkperro / ALL RIGHTS RESERVED</p>
          <p className="label text-smoke">// {TODAY}</p>
        </footer>
      </div>
    </main>
  );
}
