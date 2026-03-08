"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PerroPngMark from "@/components/PerroPngMark";
import styles from "@/components/public/shell.module.css";

const links = [
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.navShell}>
      <div className={styles.navBar}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandMark} aria-hidden="true">
            <PerroPngMark variant="black" size={28} />
          </span>
          <span className={styles.brandWordmark}>
            <strong>WalkPerro</strong>
            <span>Websites • Visuals • AI</span>
          </span>
        </Link>

        <nav className={styles.links} aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className={styles.cta}>
          Start inquiry
        </Link>

        <button type="button" className={styles.menuButton} onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className={styles.mobilePanel}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className={styles.cta} onClick={() => setOpen(false)}>
              Start inquiry
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
