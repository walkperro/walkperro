import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import InquiryForm from "@/components/InquiryForm";
import { getAllGuides } from "@/lib/guides";

// /guides — free plain-english guides + the course/guide-making service.
// Plan section E.

export const revalidate = 60;

export const metadata = {
  title: "guides",
  description:
    "plain-english guides on buying a website, seo, and running your admin — plus the service: i turn what you know into a course or guide people pay for.",
  alternates: { canonical: "https://www.walkperro.com/guides" },
};

export default function GuidesIndex() {
  const guides = getAllGuides();

  return (
    <main className="min-h-dvh bg-bone text-charcoal">
      <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-label lowercase">
            walkperro
          </Link>
          <Link href="/" className="label hover:text-charcoal">← BACK</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <section data-reveal className="pt-20 pb-12">
          <p className="label">// guides — free, plain english</p>
          <div className="hairline mt-3" />
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] mt-8 max-w-3xl">
            read before you buy anything.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/80">
            the stuff agencies hope you never learn, written straight. read
            these and you'll buy better — from me or anyone.
          </p>
        </section>

        <section data-reveal className="pb-20">
          <SectionHeader index="01" label="THE GUIDES" meta={`${guides.length} FREE`} />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-8 transition-colors duration-snap ease-snap hover:bg-line/40"
                >
                  <div className="md:col-span-3 label">
                    // {g.readMinutes} MIN READ
                  </div>
                  <div className="md:col-span-8">
                    <p className="font-display text-2xl md:text-3xl leading-snug">
                      {g.title}
                    </p>
                    <p className="mt-2 text-charcoal/80 max-w-prose">{g.excerpt}</p>
                  </div>
                  <div className="md:col-span-1 md:text-right label group-hover:text-charcoal">
                    READ →
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* The service */}
        <section data-reveal className="pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <SectionHeader index="02" label="THE SERVICE" />
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight mt-6">
              know something worth teaching? i'll package it.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/80 max-w-md">
              you bring the knowledge — a trade, a system, a skill people ask
              you about. i turn it into a course or guide with a sales page,
              checkout, and delivery, built like the guides above.
            </p>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm
              topic="course"
              templateSlug="guide"
              templateTitle="course / guide"
            />
          </div>
        </section>

        <footer className="hairline mt-12 mb-12 pt-8 flex flex-col gap-2">
          <p className="label">— walkperro / for the ones who do</p>
          <p className="label">© 2026 walkperro / ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </main>
  );
}
