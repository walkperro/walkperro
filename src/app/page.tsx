import Image from "next/image";
import Link from "next/link";
import InquiryForm from "@/components/public/InquiryForm";
import OfferCards from "@/components/public/OfferCards";
import Reveal from "@/components/public/Reveal";
import styles from "@/components/public/site.module.css";

const processSteps = [
  {
    title: "Discover",
    text: "We align on goals, references, audience, and what the site needs to do.",
  },
  {
    title: "Design",
    text: "We shape the visual direction, structure, and pacing before anything is built.",
  },
  {
    title: "Build",
    text: "We create the website, visuals, or systems with clarity, performance, and clean implementation in mind.",
  },
  {
    title: "Refine",
    text: "We polish the details, improve the flow, and make sure the final result feels intentional.",
  },
] as const;

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/hero-office-landscape.webp"
          alt="Minimal office interior with a designer working at a desk"
          fill
          priority
          quality={98}
          sizes="(max-width: 720px) 100vw, (max-width: 1440px) 96vw, 1240px"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>WalkPerro</p>
          <h1 className={styles.heroTitle}>Websites built with intention.</h1>
          <p className={styles.heroText}>Strategic websites and editorial visuals that elevate how modern businesses present themselves online.</p>
          <div className={styles.ctaRow}>
            <a href="#inquiry" className={styles.buttonPrimary}>
              Start an inquiry
            </a>
            <Link href="/services" className={styles.buttonSecondary}>
              View services
            </Link>
          </div>
        </div>
      </section>

      <Reveal className={`${styles.section} ${styles.sectionPositioning}`}>
        <div className={styles.positioningLead}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Positioning</p>
            <h2 className={styles.heading}>A calmer, sharper web presence for modern brands.</h2>
          </div>

          <div className={styles.statementCard}>
            <p className={styles.display}>WalkPerro creates websites, visuals, and systems that feel polished from first impression to final inquiry.</p>
          </div>
        </div>

        <div className={styles.detailCard}>
          <p className={styles.body}>
            The focus is clear presentation, stronger visual direction, and business-minded structure for brands that want to look more established online.
          </p>
          <ul className={styles.statementList}>
            {[
              "Editorial website design",
              "AI-enhanced visuals and art direction",
              "Inquiry systems and backend-ready thinking",
            ].map((item) => (
              <li key={item}>
                <span className={styles.dot} />
                <span className={styles.listText}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className={`${styles.section} ${styles.sectionPair}`}>
        <div className={`${styles.pairedSection} ${styles.pairedSectionProcess}`}>
          <figure className={`${styles.editorialFrame} ${styles.pairedMediaFrame} ${styles.pairedMediaProcess}`}>
            <Image
              src="/images/editorial/process-designer-side.webp"
              alt="Designer working at a desk on a minimal laptop setup"
              width={1024}
              height={1536}
              sizes="(max-width: 720px) calc(100vw - 28px), (max-width: 1120px) 42vw, 500px"
              className={styles.editorialImageStatic}
            />
          </figure>

          <div className={`${styles.pairedContent} ${styles.pairedContentProcess}`}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>PROCESS</p>
              <h2 className={styles.heading}>A simple structure behind every project.</h2>
              <p className={styles.lede}>Each project moves through four focused stages so the final site feels strategic, polished, and intentional.</p>
            </div>

            <div className={styles.processSteps}>
              {processSteps.map((step, index) => (
                <article key={step.title} className={styles.processCard}>
                  <span className={styles.processNumber}>0{index + 1}</span>
                  <div className={styles.copyStack}>
                    <p className={styles.processTitle}>{step.title}</p>
                    <p className={styles.body}>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className={`${styles.section} ${styles.sectionPair} ${styles.sectionOffers}`}>
        <div className={`${styles.pairedSection} ${styles.pairedSectionOffers}`}>
          <figure className={`${styles.editorialFrame} ${styles.pairedMediaFrame} ${styles.pairedMediaOffer}`}>
            <Image
              src="/images/editorial/close_up.webp"
              alt="Close-up editorial portrait with premium styling"
              width={1400}
              height={1875}
              sizes="(max-width: 720px) calc(100vw - 28px), (max-width: 1120px) 34vw, 420px"
              className={styles.editorialImageStatic}
            />
          </figure>

          <div className={`${styles.pairedContent} ${styles.pairedContentOfferIntro}`}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Ways to work together</p>
              <h2 className={styles.heading}>Choose the level of support that fits the stage you’re in.</h2>
            </div>
          </div>

          <div className={styles.pairedOfferCards}>
            <OfferCards />
          </div>
        </div>
      </Reveal>

      <Reveal className={`${styles.section} ${styles.sectionInquiry}`}>
        <div className={styles.sectionHeader} id="inquiry">
          <p className={styles.eyebrow}>Inquiry</p>
          <h2 className={styles.heading}>Tell us what you’re building or refining.</h2>
        </div>

        <div className={styles.inquiryShell}>
          <div className={styles.inquiryIntro}>
            <p className={styles.lede}>Start here for a new website, a redesign, AI visuals, or a more custom build.</p>
            <div className={styles.metaRow}>
              <span className={styles.metaPill}>Response within 1–2 business days</span>
              <span className={styles.metaPill}>No HIPAA / PHI through this form</span>
            </div>
          </div>

          <InquiryForm />
        </div>
      </Reveal>
    </main>
  );
}
