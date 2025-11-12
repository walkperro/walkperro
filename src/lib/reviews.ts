export type Review = {
  product: string; // slug
  author: string;
  rating: 1|2|3|4|5;
  headline: string;
  body: string;
};

export const reviews: Review[] = [
  // 10 Quick Codes
  { product: "10-quick-codes-for-100-dollar-days", author: "Mia R.", rating: 5, headline: "Made $112 day one", body: "Followed 2 of the codes after work. The tracker kept me consistent." },
  { product: "10-quick-codes-for-100-dollar-days", author: "Daniel K.", rating: 5, headline: "Low friction, clear steps", body: "Zero fluff. Picked a gig and executed. Clean writing and layout." },
  { product: "10-quick-codes-for-100-dollar-days", author: "Alex G.", rating: 4, headline: "Good starter playbook", body: "Perfect for quick cash while I build my main brand." },

  // Wealth Hacks
  { product: "wealth-hacks", author: "Nora P.", rating: 5, headline: "Faceless content finally clicked", body: "Used the format suggestions and the growth loop. Followers + sales up." },
  { product: "wealth-hacks", author: "Ray S.", rating: 5, headline: "Aesthetic + aggressive", body: "Loved the examples. Systems are simple enough to repeat daily." },
  { product: "wealth-hacks", author: "Iván L.", rating: 4, headline: "Clean strategies", body: "Fast to implement. Would love more hashtag sets in the next update." },

  // Money Moves Toolkit
  { product: "money-moves-toolkit", author: "Kayla T.", rating: 5, headline: "Margins dialed in", body: "The calculators alone paid for this. Sold 3 items profitably week one." },
  { product: "money-moves-toolkit", author: "Omar D.", rating: 5, headline: "Templates that sell", body: "Posted the promo cards, got DMs same day. Easy wins." },
  { product: "money-moves-toolkit", author: "Bree J.", rating: 4, headline: "Solid starter pack", body: "Good for flipping. Nice to have everything in one place." },

  // 25 ChatGPT Prompts
  { product: "25-chatgpt-prompts-that-print-money", author: "Chris H.", rating: 5, headline: "Printed a quick $140", body: "Used 3 prompts to list + price items. Time saver." },
  { product: "25-chatgpt-prompts-that-print-money", author: "Janelle W.", rating: 5, headline: "Great add-on", body: "Pairs perfectly with Money Moves. Keeps ideas flowing." },
  { product: "25-chatgpt-prompts-that-print-money", author: "Marco F.", rating: 4, headline: "Straightforward", body: "Good curation. Plugged into my workflow immediately." },

  // Bundle
  { product: "all-in-one-toolkit-bundle", author: "Sasha V.", rating: 5, headline: "The full arsenal", body: "Bundle discount is crazy. Clear path from 0 → consistent cash." },
  { product: "all-in-one-toolkit-bundle", author: "Dee C.", rating: 5, headline: "Everything connects", body: "The systems complement each other. Best value if you’re serious." },
  { product: "all-in-one-toolkit-bundle", author: "Luis R.", rating: 5, headline: "Worth it", body: "Went bundle to avoid FOMO. Already using 3/4 products." },
];

export function getReviewsFor(slug: string) {
  return reviews.filter(r => r.product === slug);
}
