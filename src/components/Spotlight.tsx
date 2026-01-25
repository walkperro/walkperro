"use client";

import { motion } from "framer-motion";

export default function Spotlight({ step }: { step: number }) {
  // Each step moves the hotspot down the page slightly
  const y = step * 140;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      animate={{ backgroundPosition: `0px ${y}px` }}
      transition={{ type: "spring", stiffness: 40, damping: 20 }}
      style={{
        backgroundImage:
          "radial-gradient(650px 340px at 78% 18%, rgba(255,255,255,0.10), transparent 60%)",
      }}
    />
  );
}
