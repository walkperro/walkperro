import InquiryForm from "@/components/public/InquiryForm";
import Reveal from "@/components/public/Reveal";
import styles from "@/components/public/site.module.css";
import { STUDIO_OFFERS } from "@/lib/public-site";

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <Reveal className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Services</p>
          <h1 className={styles.heroTitle}>Ways to work together.</h1>
          <p className={styles.lede}>
            WalkPerro offers a small set of focused engagements for brands that want cleaner presentation, stronger visual direction,
            and more intentional digital systems.
          </p>
        </div>
      </Reveal>

      <Reveal className={styles.section}>
        <div className={styles.offerGrid}>
          {STUDIO_OFFERS.map((offer) => (
            <article key={offer.slug} className={styles.offerCard}>
              <div className={styles.offerHead}>
                <div className={styles.offerMeta}>
                  <p className={styles.eyebrow}>Offer</p>
                  <h2 className={styles.offerName}>{offer.name}</h2>
                </div>
                <div className={styles.offerPriceBlock}>
                  <span className={styles.offerPriceLabel}>{offer.price === "Custom" ? "Pricing" : "Investment"}</span>
                  <div className={styles.offerPrice}>{offer.price}</div>
                </div>
              </div>

              <p className={styles.offerSummary}>{offer.summary}</p>

              <ul className={styles.offerList}>
                {offer.includes.map((item) => (
                  <li key={item.text}>
                    <span className={styles.dot} />
                    <span className={styles.listText}>{item}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.offerFoot}>
                <span className={styles.offerLabel}>Built with restraint and clarity</span>
                <a href="#inquiry" className={styles.buttonInline}>
                  Inquire
                </a>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className={styles.section}>
        <div className={styles.positioningGrid}>
          <div className={styles.statementCard}>
            <p className={styles.eyebrow}>How scope is approached</p>
            <h2 className={styles.heading}>Not everything needs a huge system. Not everything should stay small.</h2>
          </div>

          <div className={styles.detailCard}>
            <p className={styles.body}>
              Some clients simply need a site that looks sharper and converts more cleanly. Others need backend support, internal tools,
              or automation layered into the experience. The structure stays lean, but the build can scale when the business requires it.
            </p>
            <ul className={styles.statementList}>
              {[
                "Smaller engagements for visuals and presentation",
                "Core site packages for brands that need a cleaner presence",
                "Custom architecture for businesses with operational complexity",
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

      <Reveal className={styles.section}>
        <div className={styles.sectionHeader} id="inquiry">
          <p className={styles.eyebrow}>Start here</p>
          <h2 className={styles.heading}>Choose the closest fit — we’ll refine it into exactly what you need, with a personally guided process from start to finish.</h2>
          <p className={styles.lede}>If the scope is custom, use the inquiry form anyway. We’ll shape the project from there.</p>
        </div>

        <div className={styles.inquiryShell}>
          <div className={styles.inquiryIntro}>
            <p className={styles.body}>You can inquire about a specific offer, a redesign, or a more custom system. The form routes into the existing review workflow on the backend.</p>
          </div>
          <InquiryForm />
        </div>
      </Reveal>
    </main>
  );
}
