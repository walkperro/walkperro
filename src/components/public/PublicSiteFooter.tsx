import Link from "next/link";
import styles from "./shell.module.css";

export default function PublicSiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <strong>WalkPerro</strong>
          <p>Editorial websites, visuals, and AI systems for modern brands and service businesses.</p>
          <p className={styles.footerMeta}>Thoughtful design. Clear structure. Calm execution.</p>
        </div>

        <div className={styles.footerLinks}>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/policy">Privacy & Terms</Link>
        </div>
      </div>
    </footer>
  );
}
