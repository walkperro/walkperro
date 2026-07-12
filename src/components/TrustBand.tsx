import SectionHeader from "@/components/SectionHeader";

// Trust band — four plain-english anchor blocks (#security #custom #seo #ai).
// Copy per plan section G; each block is linkable from the tour overlay and
// from outbound campaigns.

const BLOCKS: { id: string; label: string; body: string }[] = [
  {
    id: "security",
    label: "security",
    body: "no passwords in spreadsheets. your admin is locked, your data is yours, backups run nightly.",
  },
  {
    id: "custom",
    label: "customizability",
    body: "higher tiers get the keys. change copy, prices, photos yourself — or text me and it's done same-day.",
  },
  {
    id: "seo",
    label: "seo",
    body: "google finds you because the site is built right, not because of tricks. fast pages, clean structure, real words.",
  },
  {
    id: "ai",
    label: "ai visibility",
    body: "when someone asks chatgpt for a roofer in your town, structured data is how you get named. every site ships with it.",
  },
];

export default function TrustBand() {
  return (
    <section data-reveal id="trust" className="py-20 border-t border-line">
      <SectionHeader label="WHAT EVERY SITE COMES WITH" meta="// STANDARD" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
        {BLOCKS.map((b, i) => (
          <div key={b.id} id={b.id} className="bg-bone p-6 flex flex-col gap-3 min-h-[180px]">
            <p className="label">
              {String(i + 1).padStart(2, "0")} / {b.label}
            </p>
            <p className="text-charcoal/85 leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
