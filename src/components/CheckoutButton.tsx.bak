"use client";

import React from "react";

type Props = {
  payhipCode: string;
  slug?: string;
  title?: string;
  price?: number;
  className?: string;
  children?: React.ReactNode;
};

export default function CheckoutButton({
  payhipCode,
  slug,
  title,
  className,
  children,
}: Props) {
  // Build the label: prefer our forced text, fallback to children if needed
  let base =
    slug === "all-in-one-toolkit-bundle"
      ? "GET ALL-IN-ONE-BUNDLE"
      : title
      ? `GET ${title}`
      : typeof children === "string"
      ? children
      : "GET";

  const label = String(base).toUpperCase().trim();
  const href = `https://payhip.com/b/${payhipCode}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className ?? ""} uppercase`}
    >
      {label}
    </a>
  );
}
