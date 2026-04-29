export interface AdminShot {
  /** Output file at /public/portfolio/admin/<src>.webp */
  src: string;
  /** Project this admin belongs to. */
  project: string;
  /** Short caption (1 line). */
  feature: string;
  /** Longer description (2-3 sentences) — only shown on hover/expand. */
  detail?: string;
  /** Width hint for layout — "wide" gets 2 cols, "tall" gets 1 col + tall aspect. */
  size?: "wide" | "standard" | "tall";
}

export const adminGallery: AdminShot[] = [
  {
    src: "shirt_shop-dashboard",
    project: "Georgia Print Hub",
    feature: "Daily revenue, KPIs, open work",
    detail:
      "Real-time revenue chart, recent orders, open quotes, new subscribers — the whole shop in one pane.",
    size: "wide",
  },
  {
    src: "summer-dashboard",
    project: "Summer Loffler",
    feature: "Editorial admin, four-stage launch checklist",
    detail:
      "Sell & serve, programs, brand — a multi-section admin built around the actual work of running a personal-training business. Stripe-aware launch checklist.",
  },
  {
    src: "fozzies-menu",
    project: "Fozzie's Dining",
    feature: "Live menu editor with on-screen preview",
    detail:
      "Edit copy, sections, items on the left — the public menu re-renders on the right. Mobile + desktop preview toggle.",
  },
  {
    src: "summer-offers",
    project: "Summer Loffler",
    feature: "Service catalog CMS",
    detail:
      "Multi-card editor for the public services grid — slug, title, subtitle, description, bullets, CTA. Reorder, feature, and toggle visibility without code.",
  },
  {
    src: "shirt_shop-products",
    project: "Georgia Print Hub",
    feature: "410-product catalog, faceted",
    detail:
      "Eight categories, 410 SKUs, full search and brand-filter. Built to add product lines without code.",
  },
  {
    src: "fozzies-newsletter",
    project: "Fozzie's Dining",
    feature: "Email blasts to verified subscribers",
    detail:
      "Add subscribers, compose subject + body, send a test, then blast. Skips unsubscribed and suppressed addresses automatically.",
  },
  {
    src: "shirt_shop-orders",
    project: "Georgia Print Hub",
    feature: "Bulk order management",
    detail:
      "Search by email, filter by status, multi-select to bulk-update or email invoices. Real CRUD on real orders.",
  },
  {
    src: "fozzies-activity",
    project: "Fozzie's Dining",
    feature: "Self-hosted site analytics",
    detail:
      "Page views, unique devices, conversions — Supabase-powered, no third-party trackers.",
  },
];
