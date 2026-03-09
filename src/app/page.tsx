import Image from "next/image";
import Link from "next/link";
import InquiryForm from "@/components/public/InquiryForm";
import Reveal from "@/components/public/Reveal";
import styles from "@/components/public/site.module.css";
import { STUDIO_OFFERS } from "@/lib/public-site";

const processSteps = [
  {
    title: "Discover",
    text: "We align on goals, references, audience, and what the site or system needs to accomplish.",
  },
  {
    title: "Design",
    text: "We shape the visual direction, page structure, and editorial rhythm before building anything noisy or unnecessary.",
  },
  {
    title: "Build",
    text: "We produce the website, visuals, or automation layer with a focus on clarity, performance, and clean implementation.",
  },
  {
    title: "Refine",
    text: "We polish the details, tighten the inquiry flow, and make sure the final experience feels intentional end to end.",
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
          <p className={styles.heroText}>Design, automation, and AI systems that turn visitors into clients.</p>
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

      <Reveal className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Positioning</p>
          <h2 className={styles.heading}>A modern creative studio for brands that want a calmer, sharper web presence.</h2>
        </div>

        <div className={styles.positioningGrid}>
          <div className={styles.statementCard}>
            <p className={styles.display}>WalkPerro creates websites, visuals, systems, and AI-enhanced experiences that feel polished from the first impression to the final inquiry.</p>
          </div>

          <div className={styles.detailCard}>
            <p className={styles.body}>
              The focus is simple: clear presentation, elevated visual direction, and business-minded structure for service brands,
              studios, consultants, and modern operators who want to look more established online.
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
        </div>
      </Reveal>

      <Reveal className={`${styles.section} ${styles.sectionShowcase}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Selected work</p>
          <h2 className={styles.heading}>Designed to present quality clearly, even when the build is doing serious work underneath.</h2>
          <p className={styles.lede}>WalkPerro can create brand-led websites, refined digital visuals, and structured systems that feel elevated without feeling overdesigned.</p>
        </div>

        <div className={styles.workGrid}>
          <div className={styles.mediaWrap}>
            <Image
              src="/images/editorial/portfolio-laptop-dark.webp"
              alt="Laptop displaying a refined editorial-style website interface"
              fill
              quality={100}
              sizes="(max-width: 720px) 100vw, (max-width: 1120px) 94vw, 720px"
              className={styles.mediaImage}
            />
          </div>

          <div className={styles.detailCard}>
            <div className={styles.copyStack}>
              <p className={styles.eyebrow}>Capability focus</p>
              <p className={styles.body}>
                A premium surface matters more when the build underneath is structured to support inquiry, visibility, and future operational depth.
              </p>
            </div>
            <ul className={styles.featureList}>
              {[
                {
                  title: "Editorial presentation",
                  text: "Quiet layouts, intentional imagery, and elegant pacing that make a business feel more credible.",
                },
                {
                  title: "Practical capability",
                  text: "Inquiry systems, backend-ready builds, and automation-minded architecture when the business needs more than brochure pages.",
                },
                {
                  title: "AI-assisted execution",
                  text: "Visual enhancement, art direction support, and workflow thinking that helps a smaller team look more established.",
                },
              ].map((item) => (
                <li key={item.title}>
                  <span className={styles.dot} />
                  <div>
                    <p className={styles.featureTitle}>{item.title}</p>
                    <p className={styles.body}>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal className={`${styles.section} ${styles.sectionAuthority}`}>
        <div className={styles.authorityGrid}>
          <div className={styles.detailCard}>
            <div className={styles.copyStack}>
              <p className={styles.eyebrow}>Brand authority</p>
              <h2 className={styles.heading}>Thoughtful, design-led, and quietly systems-minded.</h2>
            </div>
            <div className={styles.authorityText}>
              <p className={styles.body}>
                WalkPerro approaches web design with taste and structure in equal measure. The goal is not to make something louder.
              </p>
              <p className={styles.body}>
                It is to make a brand feel more considered, more credible, and more aligned with the kind of clients it wants to attract.
              </p>
            </div>
            <ul className={styles.miniList}>
              {[
                "Strong visual judgment without unnecessary ornament",
                "Conversion awareness without turning the site into a funnel template",
                "Technical thinking that supports growth when the business is ready",
              ].map((item) => (
                <li key={item}>
                  <span className={styles.dot} />
                  <span className={styles.listText}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.mediaWrap}>
            <Image
              src="/images/editorial/brand-male-window.webp"
              alt="Well-dressed creative standing thoughtfully beside a tall architectural window"
              fill
              quality={98}
              sizes="(max-width: 720px) 100vw, (max-width: 1120px) 94vw, 560px"
              className={styles.mediaImage}
            />
          </div>
        </div>
      </Reveal>

      <Reveal className={`${styles.section} ${styles.sectionOffers}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Ways to work together</p>
          <h2 className={styles.heading}>Clear offers, presented with enough detail to make the next step easy.</h2>
        </div>

        <div className={styles.offerGrid}>
          {STUDIO_OFFERS.map((offer) => (
            <article key={offer.slug} className={styles.offerCard}>
              <div className={styles.offerHead}>
                <div className={styles.offerMeta}>
                  <h3 className={styles.offerName}>{offer.name}</h3>
                </div>
                <div className={styles.offerPriceBlock}>
                  <span className={styles.offerPriceLabel}>{offer.price === "Custom" ? "Pricing" : "Investment"}</span>
                  <div className={styles.offerPrice}>{offer.price}</div>
                </div>
              </div>
              <p className={styles.offerSummary}>{offer.summary}</p>
              <ul className={styles.offerList}>
                {offer.includes.map((item) => (
                  <li key={item}>
                    <span className={styles.dot} />
                    <span className={styles.listText}>{item}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.offerFoot}>
                <span className={styles.offerLabel}>Premium scope</span>
                <Link href="/services" className={styles.buttonInline}>
                  Learn more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Process</p>
          <h2 className={styles.heading}>A simple engagement model that keeps the work focused and the outcome polished.</h2>
        </div>

        <div className={styles.processGrid}>
          <div className={styles.mediaWrap}>
            <Image
              src="/images/editorial/process-designer-side.webp"
              alt="Designer working quietly at a desk on a minimal laptop setup"
              fill
              quality={98}
              sizes="(max-width: 720px) 100vw, (max-width: 1120px) 94vw, 560px"
              className={styles.mediaImage}
            />
          </div>

          <div className={styles.processSteps}>
            {processSteps.map((step, index) => (
              <div key={step.title} className={styles.processCard}>
                <span className={styles.processNumber}>0{index + 1}</span>
                <div>
                  <p className={styles.processTitle}>{step.title}</p>
                  <p className={styles.body}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <section className={styles.dividerSection} aria-hidden="true">
        <div className={styles.dividerWrap}>
          <Image
            src="/images/editorial/divider-texture-shadow.webp"
            alt=""
            fill
            quality={96}
            sizes="100vw"
            className={styles.dividerImage}
          />
        </div>
      </section>

      <Reveal className={`${styles.section} ${styles.sectionInquiry}`}>
        <div className={styles.sectionHeader} id="inquiry">
          <p className={styles.eyebrow}>Inquiry</p>
          <h2 className={styles.heading}>Tell us what you’re building, refining, or rethinking.</h2>
        </div>

        <div className={styles.inquiryShell}>
          <div className={styles.inquiryIntro}>
            <p className={styles.lede}>
              This is the best place to start if you need a new website, a redesign, AI-assisted visuals, or a more custom build.
            </p>
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
