import CheckoutButton from "@/components/CheckoutButton";

type ProductCardProps = {
  title: string;
  tag?: string;
  price: number;
  blurb?: string;
  bullets?: string[];
  payhipCode: string;
  slug?: string;
  featured?: boolean;
};

export default function ProductCard({
  title,
  tag,
  price,
  blurb,
  bullets,
  payhipCode,
  slug,
  featured,
}: ProductCardProps) {
  const safeSlug =
    slug ??
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return (
    <article
      className={`flex flex-col justify-between rounded-3xl border px-5 py-6 backdrop-blur-sm shadow-[0_18px_40px_rgba(0,0,0,0.45)] ${
        featured
          ? "border-emerald-300/40 bg-slate-900/80"
          : "border-slate-800/80 bg-slate-900/60"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
            {tag && (
              <p className="text-[0.75rem] uppercase tracking-[0.22em] text-slate-400">
                {tag}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-slate-300">
            <div className="font-semibold text-slate-50">
              ${price.toFixed(2)}
              {featured && (
                <span className="ml-1 rounded-full bg-emerald-300/10 px-2 py-[1px] text-[0.6rem] uppercase tracking-[0.16em] text-emerald-300">
                  Best value
                </span>
              )}
            </div>
          </div>
        </div>

        {blurb && <p className="text-xs text-slate-300">{blurb}</p>}

        {bullets && bullets.length > 0 && (
          <ul className="space-y-1.5 text-[0.7rem] text-slate-400">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-[0.25rem] h-[3px] w-[3px] rounded-full bg-emerald-300/80" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <CheckoutButton
          payhipCode={payhipCode}
          slug={safeSlug}
          title={title}
          price={price}
        >
          Get {title.split("|")[0].trim()} →
        </CheckoutButton>
        <span className="text-[0.65rem] text-slate-500">
          Secure checkout via Payhip • instant download
        </span>
      </div>
    </article>
  );
}
