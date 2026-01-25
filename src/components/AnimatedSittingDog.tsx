"use client";

import React from "react";

export default function AnimatedSittingDog({
  className = "",
  title = "Sitting dog",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      role="img"
      aria-label={title}
    >
      <defs>
        <style>{`
          /* Uses currentColor so it matches your UI (white on black). */
          .dogFill { fill: currentColor; }

          /* Tail wag (overlay tail) */
          #dogTail {
            transform-origin: 300px 720px;
            animation: wag 1.25s ease-in-out infinite;
          }
          @keyframes wag {
            0%, 100% { transform: rotate(0deg); }
            20% { transform: rotate(14deg); }
            40% { transform: rotate(-12deg); }
            60% { transform: rotate(12deg); }
            80% { transform: rotate(-8deg); }
          }

          /* Tongue lick (overlay tongue) */
          #dogTongue {
            opacity: 0;
            transform-origin: 640px 430px;
            animation: lick 6.2s ease-in-out infinite;
          }
          @keyframes lick {
            0%, 74% { opacity: 0; transform: translateY(0) scaleY(0.6); }
            78% { opacity: 1; transform: translateY(10px) scaleY(1); }
            82% { opacity: 1; transform: translateY(12px) scaleY(1); }
            86% { opacity: 0; transform: translateY(0) scaleY(0.6); }
            100% { opacity: 0; }
          }

          /* Bark lines (overlay) */
          #dogBark {
            opacity: 0;
            animation: bark 4.2s ease-in-out infinite;
            transform-origin: 760px 380px;
          }
          @keyframes bark {
            0%, 58% { opacity: 0; transform: scale(0.92); }
            60% { opacity: 1; transform: scale(1.0); }
            66% { opacity: 1; transform: scale(1.05); }
            72% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 0; }
          }

          @media (prefers-reduced-motion: reduce) {
            #dogTail, #dogTongue, #dogBark { animation: none !important; }
            #dogTongue, #dogBark { opacity: 0 !important; }
          }
        `}</style>
      </defs>

      {/* Base dog silhouette (your SVG, but using currentColor instead of hard black) */}
      <path
        className="dogFill"
        d="M306 366c36-36 78-54 126-54h40c22 0 41-8 56-24 11-11 22-16 34-16 14 0 26 6 36 18l46 56c14 18 31 33 50 45l26 16c32 20 56 49 70 86l8 22c10 27 15 55 15 83v128c0 28-12 52-36 72s-53 30-88 30H514c-21 0-39-6-56-18-17-11-29-26-36-44l-10-26c-5-13-8-27-8-41V676h-18c-29 0-54-10-75-31s-31-46-31-75V448c0-33 9-60 26-82zM516 844h250c18 0 34-5 48-15 14-10 21-23 21-39V680c0-28-5-55-14-80l-8-22c-10-28-28-49-53-65l-26-16c-23-14-43-32-60-54l-26-32c-4 2-8 6-12 10-27 28-60 42-100 42h-40c-26 0-49 9-68 28-13 13-19 32-19 57v122c0 13 4 24 13 33s20 13 33 13h70v78c0 8 2 16 5 23l10 26c3 9 9 16 17 22 8 5 17 8 26 8zM290 676h78V536h-78c-13 0-24-4-33-13s-13-20-13-33V448c0-19 4-35 12-47-23 23-34 53-34 92v77c0 19 7 35 20 48s29 20 48 20z"
      />

      {/* Tail overlay (simple, clean, attached at rear; animated) */}
      <g id="dogTail">
        <path
          className="dogFill"
          d="M312 718
             C260 702, 238 664, 256 636
             C275 606, 326 612, 344 646
             C358 674, 346 706, 312 718
             Z"
          opacity="0.95"
        />
        {/* inner cut to keep it crisp on dark UI */}
        <path
          d="M312 709
             C279 698, 265 672, 276 654
             C289 632, 320 637, 332 658
             C342 678, 334 701, 312 709
             Z"
          fill="#000"
          opacity="0.55"
        />
      </g>

      {/* Tongue overlay (lick) */}
      <g id="dogTongue">
        <path
          d="M640 430
             C626 430, 618 442, 626 454
             C634 466, 646 466, 654 454
             C662 442, 654 430, 640 430
             Z"
          fill="#ff4d6d"
          opacity="0.9"
        />
      </g>

      {/* Bark lines overlay */}
      <g id="dogBark">
        <path className="dogFill" d="M760 360 L812 334 L820 350 L772 374 Z" opacity="0.9" />
        <path className="dogFill" d="M770 392 L832 392 L832 410 L770 410 Z" opacity="0.9" />
        <path className="dogFill" d="M760 430 L812 456 L804 472 L754 446 Z" opacity="0.9" />
      </g>
    </svg>
  );
}
