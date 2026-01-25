"use client";

import { motion } from "framer-motion";

export default function Spotlight({ step }: { step: number }) {
  // smaller movement so the light feels continuous
  const y = step * 120;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      animate={{ backgroundPosition: `0px ${y}px` }}
      transition={{ type: "spring", stiffness: 30, damping: 24 }}
      style={{
        backgroundImage: [
          // big soft spotlight (oversized so you never see edges)
          "radial-gradient(1200px 700px at 55% 25%, rgba(255,255,255,0.10), transparent 70%)",
          // secondary faint bloom for depth
          "radial-gradient(1000px 600px at 80% 10%, rgba(255,255,255,0.05), transparent 72%)",
          // subtle vignette to hide banding / edges
          "radial-gradient(1600px 1200px at 50% 50%, rgba(0,0,0,0.0), rgba(0,0,0,0.65))",
        ].join(", "),
      }}
    />
  );
}
