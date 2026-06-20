import SectionHeader from "@/components/SectionHeader";
import EmailCapture from "@/components/EmailCapture";

// Course / PDF tease block. One inline EmailCapture with source="course" so
// the admin can break out course interest from hero subscribers and re-study
// waitlisters. Topic line stays soft — Walk picks the final topic before
// slice 4 ships.

export default function CourseTease() {
  return (
    <section data-reveal id="course" className="py-20 border-t border-line">
      <SectionHeader index="03" label="COURSE" meta="// COMING SOON" />
      <div className="mt-10 max-w-2xl">
        <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-tight tracking-[-0.02em]">
          the ai-first solo-build playbook.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-charcoal/80 max-w-prose">
          everything i learned shipping closehound, asere, 1k2rich, and the
          walkperro stack — from a mac mini and a phone. no degree. no team. just
          the moves that worked.
        </p>
        <div className="mt-8">
          <p className="label mb-3">// drop your email. you'll be first to know.</p>
          <EmailCapture source="course" cta="NOTIFY ME" />
        </div>
      </div>
    </section>
  );
}
