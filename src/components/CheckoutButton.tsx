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
  // Build URL without template literals to avoid encoding issues
  const href = "https://payhip.com/b/" + encodeURIComponent(payhipCode);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-role="checkout"
      data-slug={slug}
      data-title={title}
      data-price={price}
    >
      {children ?? "Buy now"}
    </a>
  );
}
