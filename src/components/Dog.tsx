"use client";

import { motion } from "framer-motion";

export default function Dog({ step }: { step: number }) {
  const y = step * 160;

  return (
    <motion.div
      className="fixed right-6 top-28 z-10 hidden md:block select-none"
      animate={{ y }}
      transition={{ type: "spring", stiffness: 55, damping: 18 }}
    >
      <div className="glass rounded-3xl px-5 py-4">
        <div className="flex items-center gap-3">
          <DogMark />
          <div className="leading-tight">
            <div className="text-sm text-white/85 font-medium">WalkPerro</div>
            <div className="text-xs text-white/45">guide</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DogMark() {
  return (
    <div className="relative">
      <svg
        width="86"
        height="46"
        viewBox="0 0 172 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-85"
      >
        {/* body */}
        <path
          d="M36 58 L70 30 L112 36 L126 68 L70 72 Z"
          fill="white"
          fillOpacity="0.92"
        />
        {/* head */}
        <path
          d="M112 36 L146 20 L162 34 L142 44 L126 68 L112 36 Z"
          fill="white"
          fillOpacity="0.92"
        />
        {/* legs */}
        <path
          d="M52 72 L44 92 L58 92 L66 72 Z"
          fill="white"
          fillOpacity="0.92"
        />
        <path
          d="M84 72 L78 92 L92 92 L98 72 Z"
          fill="white"
          fillOpacity="0.92"
        />
        {/* tail (animated group) */}
        <motion.g
          animate={{ rotate: [0, 10, 0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "32px 54px" }}
        >
          <path
            d="M36 58 L18 48 L22 40 L44 52 Z"
            fill="white"
            fillOpacity="0.92"
          />
        </motion.g>
      </svg>
    </div>
  );
}
