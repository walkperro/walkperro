"use client";

type Props = {
  priceId: string;
  label?: string;
  className?: string;
};

export default function CheckoutButton({ priceId, label = "BUY NOW", className }: Props) {
  const go = () => {
    window.location.href = `/checkout?price=${encodeURIComponent(priceId)}`;
  };
  return (
    <button
      onClick={go}
      className={
        className ??
        "rounded-full bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold tracking-[0.10em] shadow-md active:scale-95"
      }
    >
      {label}
    </button>
  );
}
