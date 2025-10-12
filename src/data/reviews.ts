import { Review } from "@/types/review"

export const reviews: Record<string, Review[]> = {
  "100-days": [
    { id:"r1", name:"Alex G.", rating:5, date:"2025-10-01", verified:true, comment:"Hit $100 on day 6. Clear, simple system." },
    { id:"r2", name:"Nina P.", rating:5, date:"2025-10-03", comment:"Weekly prompts keep me consistent." }
  ],
  "chatgpt-cash-hacks": [
    { id:"r3", name:"Marco V.", rating:5, date:"2025-10-04", verified:true, comment:"Closed 2 gigs in 48 hours. Paste → tweak → sell." }
  ],
  "wealth-hacks": [
    { id:"r4", name:"T.", rating:4, date:"2025-10-05", comment:"FACE framework finally clicked." }
  ],
  "money-moves-toolkit": [
    { id:"r5", name:"Jess", rating:5, date:"2025-10-06", comment:"Templates saved hours. First flip same day." }
  ],
  "all-in-one-bundle": [
    { id:"r6", name:"R.", rating:5, date:"2025-10-07", verified:true, comment:"Cohesive toolkit. Worth it." }
  ],
}
