/**
 * SVG placeholder representing the three AMARE doctors.
 * No real photography — abstract silhouettes only.
 */
export function StakeholdersIllustration({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg viewBox="0 0 480 420" className="h-full w-full" aria-label="Equipe médica AMARE (ilustração)">
        <defs>
          <clipPath id="blobClip">
            <path d="M60 40 C 180 -20 380 20 440 120 C 480 240 400 380 240 400 C 80 410 0 280 30 180 C 50 110 30 80 60 40 Z" />
          </clipPath>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.92 0.04 25)" />
            <stop offset="100%" stopColor="oklch(0.78 0.06 20)" />
          </linearGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.86 0.04 40)" />
            <stop offset="100%" stopColor="oklch(0.74 0.06 30)" />
          </linearGradient>
        </defs>

        <g clipPath="url(#blobClip)">
          <rect width="480" height="420" fill="url(#bg)" />

          {/* back figure */}
          <g transform="translate(190 40)">
            <circle cx="50" cy="70" r="44" fill="url(#skin)" />
            <path d="M-10 220 C -10 150 110 150 110 220 L 110 320 L -10 320 Z" fill="oklch(0.78 0.045 200)" />
            <path d="M6 60 C 6 20 94 20 94 60 C 94 100 80 130 50 130 C 20 130 6 100 6 60 Z" fill="oklch(0.32 0.04 30)" opacity="0.55" />
          </g>

          {/* left figure */}
          <g transform="translate(40 130)">
            <circle cx="60" cy="80" r="46" fill="url(#skin)" />
            <path d="M0 240 C 0 170 120 170 120 240 L 120 360 L 0 360 Z" fill="oklch(0.96 0.01 70)" />
            <path d="M14 70 C 14 30 106 30 106 70 C 106 120 90 150 60 150 C 30 150 14 120 14 70 Z" fill="oklch(0.32 0.04 30)" opacity="0.55" />
          </g>

          {/* right figure */}
          <g transform="translate(290 130)">
            <circle cx="60" cy="80" r="46" fill="url(#skin)" />
            <path d="M0 240 C 0 170 120 170 120 240 L 120 360 L 0 360 Z" fill="oklch(0.96 0.01 70)" />
            <path d="M14 70 C 14 30 106 30 106 70 C 106 120 90 150 60 150 C 30 150 14 120 14 70 Z" fill="oklch(0.32 0.04 30)" opacity="0.55" />
          </g>
        </g>
      </svg>
    </div>
  );
}
