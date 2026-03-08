import type { Metadata } from "next";
import InquiryForm from "@/components/public/InquiryForm";
import Reveal from "@/components/public/Reveal";
import styles from "@/components/public/site.module.css";
import { normalizeIntentQuery, type InquiryHelpOption } from "@/lib/public-site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a WalkPerro inquiry for websites, editorial visuals, creative direction, and AI systems.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const defaultIntent = normalizeIntentQuery(params.intent) as InquiryHelpOption | "";

  return (
    <main className={styles.page}>
      <Reveal className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.heroTitle}>A clearer starting point for the next version of your brand online.</h1>
          <p className={styles.lede}>
            Use this form for websites, redesigns, visuals, automations, or custom inquiries. The more context you can share, the better the response can be.
          </p>
        </div>
      </Reveal>

      <Reveal className={styles.section}>
        <div className={styles.inquiryShell}>
          <div className={styles.contactPanel}>
            <p className={styles.eyebrow}>What to expect</p>
            <h2 className={styles.heading}>Thoughtful replies, not rushed sales language.</h2>
            <ul className={styles.contactList}>
              <li>
                <strong>Best for:</strong> new websites, refined redesigns, visuals, AI workflows, internal tools, and custom builds.
              </li>
              <li>
                <strong>Response time:</strong> usually within 1–2 business days.
              </li>
              <li>
                <strong>Helpful context:</strong> your current site or social link, the kind of presence you want, and where the current experience falls short.
              </li>
              <li>
                <strong>Privacy note:</strong> please do not send HIPAA, PHI, or other sensitive personal information.
              </li>
            </ul>
          </div>

          <InquiryForm defaultIntent={defaultIntent} />
        </div>
      </Reveal>
    </main>
  );
}
