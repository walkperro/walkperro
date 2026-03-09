"use client";

import Image from "next/image";

export default function PerroPngMark({
  className = "",
  variant = "white",
  size = 56,
}: {
  className?: string;
  variant?: "white" | "black";
  size?: number;
}) {
  const src =
    variant === "white"
      ? "/perro/white_perro_v2_no_bg.png"
      : "/perro/black_perro_v2_no_bg.png";

  return (
    <span className={className} aria-hidden="true">
      <Image src={src} alt="" width={size} height={size} priority style={{ width: size, height: size }} />
    </span>
  );
}
