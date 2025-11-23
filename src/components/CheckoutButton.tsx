"use client";

type Props = {
  payhipCode: string;            // e.g. "Pgrso"
  slug?: string;
  title?: string;
  price?: number;
  className?: string;            // let callers style it (Tailwind, etc.)
  children: React.ReactNode;     // e.g. "GET ALL-IN-ONE BUNDLE"
};

export default function CheckoutButton({
  payhipCode,
  className = "",
  children,
}: Props) {
  // Payhip wants <a href="https://payhip.com/b/CODE" class="payhip-buy-button" data-product="CODE">
  const href = `https://payhip.com/b/${payhipCode}`;

  return (
    <a
      href={href}
      className={`payhip-buy-button ${className}`}
      data-product={payhipCode}
      data-theme="none"          // keep our styling; Payhip won’t skin it
      aria-label="Secure checkout via Payhip"
      rel="noopener"
    >
      {children}
    </a>
  );
}
