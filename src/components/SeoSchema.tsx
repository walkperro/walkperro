import Script from "next/script";

export default function SeoSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WalkPerro",
    url: "https://walkperro.com",
    logo: "https://walkperro.com/favicon.svg",
    sameAs: [
      "https://instagram.com/walkperro",
      "https://tiktok.com/@walkperro",
    ],
    description:
      "Luxury minimal digital systems and guides for those who lead the pack.",
  };
  return (
    <Script
      id="ld-json"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
