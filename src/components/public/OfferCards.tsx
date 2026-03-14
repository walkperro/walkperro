import Link from "next/link";
import styles from "./site.module.css";
import { STUDIO_OFFERS } from "@/lib/public-site";

function renderOfferText(text: string, accent?: string) {
  if (!accent || !text.includes(accent)) return text;

  const [before, after] = text.split(accent);

  return (
    <>
      {before}
      <span className={styles.offerIncludeAccent}>{accent}</span>
      {after}
    </>
  );
}

export default function OfferCards({ ctaHref = "#inquiry" }: { ctaHref?: string }) {
  return (
    <div className={styles.offerGrid}>
      {STUDIO_OFFERS.map((offer) => (
        <article
          key={offer.slug}
          className={`${styles.offerCard} ${offer.featured ? styles.offerCardFeatured : ""}`.trim()}
        >
          <div className={styles.offerHead}>
            <div className={styles.offerMeta}>
              {offer.badge ? <span className={styles.offerBadge}>{offer.badge}</span> : null}
              <h3 className={styles.offerName}>{offer.name}</h3>
            </div>

            <div className={styles.offerPriceBlock}>
              <span className={styles.offerPriceLabel}>{offer.price === "Custom" ? "Custom pricing" : "Investment from"}</span>
              <div className={styles.offerPrice}>{offer.price}</div>
            </div>
          </div>

          <p className={styles.offerSummary}>{offer.summary}</p>

          <ul className={styles.offerList}>
            {offer.includes.map((item) => (
              <li key={item.text} className={item.emphasis ? styles.offerListItemEmphasis : undefined}>
                <span className={styles.dot} />
                <span className={styles.listText}>{renderOfferText(item.text, item.accent)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.offerFoot}>
            <span className={styles.offerLabel}>{offer.footLabel}</span>
            <Link href={ctaHref} className={offer.featured ? styles.buttonPrimary : styles.buttonInline}>
              {offer.ctaLabel}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
