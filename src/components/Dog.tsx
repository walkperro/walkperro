"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Dog({ step }: { step: number }) {
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    // trigger a short “walk” cycle on step changes
    setWalking(true);
    const t = setTimeout(() => setWalking(false), 850);
    return () => clearTimeout(t);
  }, [step]);

  const y = step * 160;
  const opacity = step >= 3 ? 0.18 : 0.88;

  return (
    <motion.div
      className="fixed z-10 select-none right-4 top-32 md:right-6 md:top-28"
      animate={{ y, opacity }}
      transition={{ type: "spring", stiffness: 55, damping: 18 }}
    >
      <div className="glass rounded-3xl px-4 py-3 md:px-5 md:py-4">
        <div className="flex items-center gap-3">
          <DogMark walking={walking} />
          <div className="leading-tight hidden sm:block">
            <div className="text-sm text-white/85 font-medium">WalkPerro</div>
            <div className="text-xs text-white/45">guide</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DogMark({ walking }: { walking: boolean }) {
  return (
    <motion.svg
      width="74"
      height="40"
      viewBox="0 0 172 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-90 md:opacity-85"
      animate={walking ? { y: [0, -1.5, 0, -1.0, 0] } : { y: 0 }}
      transition={walking ? { duration: 0.85, ease: "easeInOut" } : { duration: 0.2 }}
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

      {/* back leg (animated) */}
      <motion.g
        animate={
          walking
            ? { rotate: [0, 12, 0, -10, 0] }
            : { rotate: 0 }
        }
        transition={
          walking
            ? { duration: 0.45, repeat: 2, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        style={{ transformOrigin: "56px 72px" }}
      >
        <path d="M52 72 L44 92 L58 92 L66 72 Z" fill="white" fillOpacity="0.92" />
      </motion.g>

      {/* front leg (animated opposite phase) */}
      <motion.g
        animate={
          walking
            ? { rotate: [0, -10, 0, 12, 0] }
            : { rotate: 0 }
        }
        transition={
          walking
            ? { duration: 0.45, repeat: 2, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        style={{ transformOrigin: "92px 72px" }}
      >
        <path d="M84 72 L78 92 L92 92 L98 72 Z" fill="white" fillOpacity="0.92" />
      </motion.g>

      {/* tail (idle twitch always) */}
      <motion.g
        animate={{ rotate: [0, 10, 0, -6, 0] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "32px 54px" }}
      >
        <path
          d="M36 58 L18 48 L22 40 L44 52 Z"
          fill="white"
          fillOpacity="0.92"
        />
      </motion.g>
    </motion.svg>
  );
}
