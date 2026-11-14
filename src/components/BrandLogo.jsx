import React, { useId } from 'react';

export default function BrandLogo({ className = 'w-10 h-10' }) {
  const rawId = useId();
  const clipId = `sea-b3-clip-${rawId.replace(/:/g, '')}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="55 48 390 390"
      className={className}
      aria-label="旅遊筆記 Logo"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="250" cy="245" r="185" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Warm Cream Sky */}
        <circle cx="250" cy="245" r="185" fill="#FEF3C7" />

        {/* Sunny Amber Sun */}
        <circle cx="233" cy="220" r="68" fill="#FFB800" />

        {/* Wave Layer 1 (Coral Red) */}
        <path
          d="M 60 272 C 125 240, 195 298, 265 268 C 330 240, 385 282, 445 260 L 445 445 L 60 445 Z"
          fill="#FF5A5F"
        />

        {/* White Foam Divider 1 */}
        <path
          d="M 60 314 C 135 344, 210 290, 285 318 C 350 342, 400 300, 445 316 L 445 445 L 60 445 Z"
          fill="#FFFFFF"
        />

        {/* Wave Layer 2 (Deep Slate Navy) */}
        <path
          d="M 60 328 C 135 358, 210 304, 285 332 C 350 356, 400 314, 445 330 L 445 445 L 60 445 Z"
          fill="#1E293B"
        />

        {/* White Foam Divider 2 */}
        <path
          d="M 60 374 C 150 350, 230 398, 315 370 C 375 350, 415 378, 445 368 L 445 445 L 60 445 Z"
          fill="#FFFFFF"
        />

        {/* Wave Layer 3 (Sunny Amber) */}
        <path
          d="M 60 386 C 150 362, 230 410, 315 382 C 375 362, 415 390, 445 380 L 445 445 L 60 445 Z"
          fill="#FFB800"
        />
      </g>

      {/* Three Flying Seagulls */}
      <path
        d="M 0 20 C 12 15, 22 18, 30 24 C 40 10, 52 -2, 66 -12 C 60 4, 50 18, 40 28 C 45 30, 48 32, 46 34 C 37 34, 30 32, 24 28 C 15 24, 8 22, 0 20 Z"
        transform="translate(298, 68) rotate(-2) scale(0.86)"
        fill="#1E293B"
      />
      <path
        d="M 0 20 C 12 15, 22 18, 30 24 C 40 10, 52 -2, 66 -12 C 60 4, 50 18, 40 28 C 45 30, 48 32, 46 34 C 37 34, 30 32, 24 28 C 15 24, 8 22, 0 20 Z"
        transform="translate(132, 132) rotate(-4) scale(0.80)"
        fill="#1E293B"
      />
      <path
        d="M 0 20 C 12 15, 22 18, 30 24 C 40 10, 52 -2, 66 -12 C 60 4, 50 18, 40 28 C 45 30, 48 32, 46 34 C 37 34, 30 32, 24 28 C 15 24, 8 22, 0 20 Z"
        transform="translate(302, 148) rotate(3) scale(0.68)"
        fill="#1E293B"
      />
    </svg>
  );
}
