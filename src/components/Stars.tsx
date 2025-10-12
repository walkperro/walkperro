type Props = { value: number, className?: string }
export default function Stars({ value, className }: Props) {
  const v = Math.max(0, Math.min(5, value))
  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`} aria-label={`${v} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(v)
        return (
          <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${filled ? "fill-yellow-500" : "fill-zinc-300"}`}>
            <path d="M10 1.8 12.6 7l5.7.6-4.2 3.6 1.2 5.6L10 14.6 4.7 16.8l1.2-5.6L1.7 7.6 7.4 7 10 1.8z" />
          </svg>
        )
      })}
    </div>
  )
}
