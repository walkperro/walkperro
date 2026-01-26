"use client";

import Image from "next/image";

export default function PerroPngMark({
  className = "",
  variant = "white",
}: {
  className?: string;
  variant?: "white" | "black";
}) {
  const src =
    variant === "white"
      ? "/perro/white_perro_v2_no_bg.png"
      : "/perro/black_perro_v2.png";

  return (
    <span className={className} aria-hidden="true">
      <Image src={src} alt="" width={56} height={56} priority />
    </span>
  );
}
