"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Dog({ step }: { step: number }) {
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    setWalking(true);
    const t = setTimeout(() => setWalking(false), 700);
    return () => clearTimeout(t);
  }, [step]);

  const y = step * 150 + (step === 0 ? 40 : 0);
  const opacity = step >= 3 ? 0.22 : 0.9;

  return (
    <motion.div
      className="fixed z-10 select-none right-4 md:right-6 md:top-28"
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
      width="76"
      height="44"
      viewBox="0 0 180 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-90 md:opacity-85"
      animate={
        walking
          ? { x: [0, 3, 0, 2, 0], y: [0, -1.5, 0, -1, 0] }
          : { x: 0, y: 0 }
      }
      transition={walking ? { duration: 0.7, ease: "easeInOut" } : { duration: 0.2 }}
    >
      {/* BODY (clean canine silhouette) */}
      <path
        d="M40 62 L78 36 L120 40 L138 70 L86 78 L52 76 Z"
        fill="white"
        fillOpacity="0.92"
      />
      {/* HEAD */}
      <path
        d="M120 40 L150 26 L166 40 L146 50 L138 70 L120 40 Z"
        fill="white"
        fillOpacity="0.92"
      />
      {/* EAR (subtle dog ear) */}
      <path
        d="M146 50 L154 38 L166 40 Z"
        fill="white"
        fillOpacity="0.92"
      />

      {/* LEGS (bigger + readable) */}
      <motion.g
        animate={walking ? { rotate: [0, 14, 0, -10, 0] } : { rotate: 0 }}
        transition={walking ? { duration: 0.35, repeat: 2, ease: "easeInOut" } : { duration: 0.2 }}
        style={{ transformOrigin: "70px 78px" }}
      >
        <path d="M66 78 L56 104 L76 104 L86 80 Z" fill="white" fillOpacity="0.92" />
      </motion.g>

      <motion.g
        animate={walking ? { rotate: [0, -12, 0, 14, 0] } : { rotate: 0 }}
        transition={walking ? { duration: 0.35, repeat: 2, ease: "easeInOut" } : { duration: 0.2 }}
        style={{ transformOrigin: "104px 78px" }}
      >
        <path d="M102 78 L92 104 L112 104 L120 82 Z" fill="white" fillOpacity="0.92" />
      </motion.g>

      {/* TAIL (idle twitch always, more dog-like) */}
      <motion.g
        animate={{ rotate: [0, 10, 0, -6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "40px 60px" }}
      >
        <path
          d="M40 62 L20 54 L26 44 L48 56 Z"
          fill="white"
          fillOpacity="0.92"
        />
      </motion.g>
    </motion.svg>
  );
}
