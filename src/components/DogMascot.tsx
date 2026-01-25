"use client";

import React from "react";

export default function DogMascot({
  say,
  className = "",
  size = 84,
}: {
  say?: string;
  className?: string;
  size?: number;
}) {
  return (
    <div className={`dogWrap ${className}`.trim()}>
      <div
        className="dogSvg"
        style={{
          width: size,
          height: size,
        }}
        aria-hidden={say ? undefined : true}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          role="img"
          aria-label="Sitting dog logo with wagging tail, lick, and bark animations"
        >
          <defs>
            <style>{`
              /* Inherit from parent text color */
              .fg { fill: currentColor; }
              .bg { fill: transparent; }

              /* ---------- Tail wag ---------- */
              #tail {
                transform-origin: 145px 346px; /* tail base pivot in viewBox coords */
                animation: wag 1.25s ease-in-out infinite;
              }
              @keyframes wag {
                0%, 100% { transform: rotate(0deg); }
                20% { transform: rotate(18deg); }
                40% { transform: rotate(-14deg); }
                60% { transform: rotate(16deg); }
                80% { transform: rotate(-10deg); }
              }

              /* ---------- Lick animation ---------- */
              #tongue {
                opacity: 0;
                transform-origin: 256px 192px;
                animation: lick 6.5s ease-in-out infinite;
              }
              @keyframes lick {
                0%, 75% { opacity: 0; transform: translateY(0) scaleY(0.6); }
                78% { opacity: 1; transform: translateY(6px) scaleY(1); }
                82% { opacity: 1; transform: translateY(8px) scaleY(1); }
                86% { opacity: 0; transform: translateY(0) scaleY(0.6); }
                100% { opacity: 0; }
              }

              /* ---------- Bark animation ---------- */
              #bark {
                opacity: 0;
                animation: bark 4.2s ease-in-out infinite;
              }
              @keyframes bark {
                0%, 58% { opacity: 0; transform: scale(0.9); }
                60% { opacity: 1; transform: scale(1.0); }
                66% { opacity: 1; transform: scale(1.03); }
                72% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 0; }
              }

              /* Respect reduced motion */
              @media (prefers-reduced-motion: reduce) {
                #tail, #tongue, #bark { animation: none !important; }
                #tongue, #bark { opacity: 0 !important; }
              }
            `}</style>
          </defs>

          {/* ===== DOG LOGO (simple geometric) ===== */}
          {/* Head */}
          <path
            className="fg"
            d="M256 82
              L198 130
              L214 206
              L256 224
              L298 206
              L314 130
              Z"
          />

          {/* Ears */}
          <path className="fg" d="M198 130 L165 86 L215 110 Z" />
          <path className="fg" d="M314 130 L347 86 L297 110 Z" />

          {/* Muzzle cut / nose */}
          <path
            className="bg"
            d="M256 160
              L235 170
              L256 198
              L277 170
              Z"
          />

          {/* Neck / chest V */}
          <path className="bg" d="M256 238 L220 270 L256 306 L292 270 Z" />

          {/* Torso outer */}
          <path
            className="fg"
            d="M190 242
              L322 242
              L364 410
              L148 410
              Z"
          />

          {/* Inner torso “M” negative space */}
          <path
            className="bg"
            d="M256 270
              L228 298
              L228 410
              L256 410
              L256 330
              L284 298
              L284 410
              L312 410
              L312 298
              Z"
          />

          {/* Legs (front) */}
          <path className="fg" d="M210 298 L242 298 L242 430 L210 430 Z" />
          <path className="fg" d="M270 298 L302 298 L302 430 L270 430 Z" />

          {/* Feet */}
          <path className="fg" d="M190 430 L262 430 L262 454 L190 454 Z" />
          <path className="fg" d="M250 430 L322 430 L322 454 L250 454 Z" />

          {/* Back legs (side pieces) */}
          <path className="fg" d="M170 330 L206 330 L168 454 L128 454 Z" />
          <path className="fg" d="M342 330 L306 330 L344 454 L384 454 Z" />

          {/* ===== TAIL (animated) ===== */}
          <g id="tail">
            <path
              className="fg"
              d="M150 346
                C112 332, 98 300, 114 276
                C130 252, 166 258, 178 286
                C188 310, 176 336, 150 346
                Z"
            />
            <path
              className="bg"
              d="M154 336
                C132 326, 124 308, 134 294
                C144 280, 166 284, 172 300
                C178 314, 170 332, 154 336
                Z"
            />
          </g>

          {/* ===== TONGUE (lick) ===== */}
          <g id="tongue">
            <path
              fill="#ff4d6d"
              d="M256 196
                C244 196, 238 206, 244 214
                C250 222, 262 222, 268 214
                C274 206, 268 196, 256 196
                Z"
            />
          </g>

          {/* ===== BARK LINES (periodic) ===== */}
          <g id="bark" transform="translate(0,0)">
            <path className="fg" d="M326 170 L356 152 L360 162 L332 178 Z" />
            <path className="fg" d="M334 192 L370 192 L370 204 L334 204 Z" />
            <path className="fg" d="M326 226 L356 244 L350 254 L322 236 Z" />
          </g>
        </svg>
      </div>

      {say ? <div className="dogSay">{say}</div> : null}
    </div>
  );
}
