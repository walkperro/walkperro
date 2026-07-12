import SectionHeader from "@/components/SectionHeader";
import ShowroomGrid from "@/components/showroom/ShowroomGrid";
import { getShowroomItems } from "@/content/showroom";

// Server wrapper for the showroom: heading + JSON-LD + crawlable grid.
// Slice 2 mounts the WebGL corridor (ShowroomTour, dynamic ssr:false) above
// the grid; the grid then collapses under a "browse as a list" toggle but
// stays in the DOM. JSON-LD lives here so the structured data and the visible
// catalog can never drift apart.

const SITE = "https://www.walkperro.com";

export default function ShowroomSection() {
  const items = getShowroomItems();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "the walkperro showroom",
    description:
      "websites and web apps walkperro has shipped — walk through live demos or get one built.",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "WebSite",
        name: item.title,
        url: item.demoUrl || `${SITE}/websites/${item.inquireSlug || item.slug}`,
        description: item.tourLine,
        image: `${SITE}${item.image}`,
      },
    })),
  };

  return (
    <section data-reveal id="showroom" className="py-20 border-t border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionHeader
        index="01"
        label="THE SHOWROOM"
        title="walk through the work."
        meta={`${items.length} BUILDS`}
      />
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/80">
        every card is a real build. view it live, walk through the demo, or
        tap "get this built" and it's yours in a week.
      </p>
      <div className="mt-10">
        <ShowroomGrid items={items} />
      </div>
    </section>
  );
}
