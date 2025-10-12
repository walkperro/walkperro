export type Review = {
  id: string
  name: string
  rating: 1|2|3|4|5
  date: string           // ISO, e.g. "2025-10-09"
  comment: string
  verified?: boolean
}
