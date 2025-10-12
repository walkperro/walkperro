import { Review } from "@/types/review"

type ProductSlug = "100-days" | "chatgpt-cash-hacks" | "wealth-hacks" | "money-moves" | "bundle"

export const reviews: Record<ProductSlug, Review[]> = {
  "100-days": [
    { id:"r1", name:"Alex G.", rating:5, date:"2025-10-01", verified:true,
      comment:"Simple system, real momentum. Hit $100 on day 6." },
    { id:"r2", name:"Nina P.", rating:5, date:"2025-10-03",
      comment:"Exactly what I needed—daily focus + weekly review. Clean layout." },
  ],
  "chatgpt-cash-hacks": [
    { id:"r3", name:"Marco V.", rating:5, date:"2025-10-04", verified:true,
      comment:"Copy → paste → sell. The prompts print pages, for real." },
  ],
  "wealth-hacks": [
    { id:"r4", name:"T.", rating:4, date:"2025-10-05",
      comment:"FACE framework clicked. Clear steps to scale faceless." },
  ],
  "money-moves": [
    { id:"r5", name:"Jess", rating:5, date:"2025-10-06",
      comment:"Templates saved hours. Listed my digital in 20 minutes." },
  ],
  "bundle": [
    { id:"r6", name:"R.", rating:5, date:"2025-10-07", verified:true,
      comment:"All-in and worth it. Cohesive toolkit." },
  ],
}
