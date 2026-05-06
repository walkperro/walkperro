export type PortfolioItem = {
  src: string;
  alt: string;
  project: "ecommerce" | "fitness" | "restaurant" | "group_home" | "trading_bot";
};

export const PORTFOLIO: PortfolioItem[] = [
  // ecommerce
  { src: "/portfolio/ecommerce_add_to_cart.webp", alt: "E-commerce — add to cart", project: "ecommerce" },
  { src: "/portfolio/ecommerce_apparel_subcategories.webp", alt: "E-commerce — apparel subcategories", project: "ecommerce" },
  { src: "/portfolio/ecommerce_nav_selection.webp", alt: "E-commerce — nav selection", project: "ecommerce" },
  { src: "/portfolio/ecommerce_store_category_display.webp", alt: "E-commerce — category display", project: "ecommerce" },
  { src: "/portfolio/ecommerce_store_product_listings.webp", alt: "E-commerce — product listings", project: "ecommerce" },
  { src: "/portfolio/ecommerce_store_request_a_quote.webp", alt: "E-commerce — request a quote", project: "ecommerce" },

  // fitness
  { src: "/portfolio/fitness_hero.webp", alt: "Fitness studio — hero", project: "fitness" },
  { src: "/portfolio/fitness_hero2.webp", alt: "Fitness studio — hero alt", project: "fitness" },
  { src: "/portfolio/fitness_classes.webp", alt: "Fitness studio — classes", project: "fitness" },

  // restaurant
  { src: "/portfolio/restaurant_hero.webp", alt: "Restaurant — hero", project: "restaurant" },
  { src: "/portfolio/restaurant_food.webp", alt: "Restaurant — food menu", project: "restaurant" },
  { src: "/portfolio/restaurant_admin.webp", alt: "Restaurant — admin dashboard", project: "restaurant" },

  // group_home
  { src: "/portfolio/group_home_hero.webp", alt: "Group home — hero", project: "group_home" },
  { src: "/portfolio/group_home_tour_form.webp", alt: "Group home — tour form", project: "group_home" },

  // trading_bot
  { src: "/portfolio/trading_bot.webp", alt: "Trading bot — dashboard", project: "trading_bot" },
  { src: "/portfolio/trading_bot_journal.webp", alt: "Trading bot — journal", project: "trading_bot" },
];

export const TOP_ROW: PortfolioItem[] = PORTFOLIO.filter(
  (p) => p.project === "ecommerce" || p.project === "fitness"
);

export const BOTTOM_ROW: PortfolioItem[] = PORTFOLIO.filter(
  (p) =>
    p.project === "restaurant" ||
    p.project === "group_home" ||
    p.project === "trading_bot"
);
