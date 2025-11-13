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
  // Fallback slug if one isn’t passed
  const safeSlug =
    slug ??
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return (
    <article
      className={`flex flex-col justify-between rounded-3xl border border-bone/12 bg-bone/5 px-5 py-5 backdrop-blur-sm ${
        featured ? "border-emerald/60 bg-emerald/5" : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-bone">{title}</h3>
            {tag && (
              <p className="text-[0.75rem] uppercase tracking-[0.2em] text-bone/55">
                {tag}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-bone/60">
            <div className="font-semibold text-bone">
              ${price.toFixed(2)}
              {featured && (
                <span className="ml-1 rounded-full bg-emerald/10 px-2 py-[1px] text-[0.6rem] uppercase tracking-[0.16em] text-emerald">
                  Best value
                </span>
              )}
            </div>
          </div>
        </div>

        {blurb && <p className="text-xs text-bone/70">{blurb}</p>}

        {bullets && bullets.length > 0 && (
          <ul className="space-y-1.5 text-[0.7rem] text-bone/55">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-[0.25rem] h-[3px] w-[3px] rounded-full bg-emerald/70" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <CheckoutButton
          payhipCode={payhipCode}
          slug={safeSlug}
          title={title}
          price={price}
        >
          Get {title.split("|")[0].trim()} →
        </CheckoutButton>
        <span className="text-[0.65rem] text-bone/45">
          Secure checkout via Payhip • instant download
        </span>
      </div>
    </article>
  );
}
