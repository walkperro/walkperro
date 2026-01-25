"use client";

import { motion } from "framer-motion";

export default function Dog({ step }: { step: number }) {
  // Moves down as the user progresses section-by-section
  const y = step * 140;

  return (
    <motion.div
      className="fixed right-6 top-28 z-10 hidden md:block"
      animate={{ y }}
      transition={{ type: "spring", stiffness: 55, damping: 18 }}
    >
      <div className="glass rounded-2xl p-4 opacity-85">
        {/* placeholder block (swap with SVG dog next) */}
        <div className="h-10 w-24 rounded-xl bg-white/20" />
      </div>
    </motion.div>
  );
}
