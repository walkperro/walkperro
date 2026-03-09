import Link from "next/link";
import styles from "./shell.module.css";

export default function PublicSiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <strong>WalkPerro</strong>
          <p>Editorial websites, visuals, and AI systems for modern brands and service businesses.</p>
          <p className={styles.footerMeta}>Thoughtful design. Clear structure. Calm execution.</p>
        </div>

        <div className={styles.footerAside}>
          <p className={styles.footerPrompt}>Available for select websites, redesigns, visuals, and custom systems.</p>
          <div className={styles.footerLinks}>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/policy">Privacy & Terms</Link>
          </div>
          <p className={styles.footerMeta}>© {year} WalkPerro</p>
        </div>
      </div>
    </footer>
  );
}
