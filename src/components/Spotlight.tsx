"use client";

import { motion } from "framer-motion";

export default function Spotlight({ step }: { step: number }) {
  const y = step * 160;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      animate={{ backgroundPosition: `0px ${y}px` }}
      transition={{ type: "spring", stiffness: 35, damping: 22 }}
      style={{
        backgroundImage: [
          "radial-gradient(700px 360px at 78% 22%, rgba(255,255,255,0.11), transparent 60%)",
          "radial-gradient(900px 520px at 50% 0%, rgba(255,255,255,0.04), transparent 55%)",
        ].join(", "),
      }}
    />
  );
}
