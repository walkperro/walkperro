"use client";
import React from "react";

type Props = {
  payhipCode: string;
  slug: string;
  title: string;
  price: number;
  className?: string;
  children?: React.ReactNode;
};

export default function CheckoutButton({
  payhipCode,
  slug,
  title,
  price,
  className,
  children,
}: Props) {
  const href = `https://payhip.com/b/${payhipCode}`;

  // If children is missing or is just "GET →", fall back to full title
  let childText =
    typeof children === "string" ? children.trim() : "";
  if (!childText || /^GET\s*→$/i.test(childText)) {
    childText = `GET ${title} →`;
  }

  const base =
    "inline-block text-center rounded-full bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-[0.10em] whitespace-normal leading-tight shadow-md active:scale-95";
  const combined = className ? `${base} ${className}` : base;

  childText = childText.toUpperCase();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={combined}
      aria-label={`Buy ${title}`}
      data-slug={slug}
      data-price={price}
    >
      {childText}
    </a>
  );
}
