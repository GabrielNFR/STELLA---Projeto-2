type Props = { className?: string; tagline?: boolean };

export function AmareLogo({ className, tagline = true }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <svg viewBox="0 0 64 80" className="h-10 w-auto" aria-hidden>
        {/* stylized rose tree */}
        <g fill="oklch(0.66 0.085 15)">
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const r = 18 + (i % 3) * 4;
            const cx = 28 + Math.cos(angle) * r * 0.6;
            const cy = 24 + Math.sin(angle) * r * 0.55;
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx="4.5"
                ry="3"
                transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
                opacity={0.85}
              />
            );
          })}
          <path d="M28 38 C 26 50, 30 60, 28 78" stroke="oklch(0.66 0.085 15)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <div className="leading-tight">
        <div className="font-display text-2xl tracking-[0.18em] text-ink">AMARE</div>
        {tagline && (
          <div className="text-[9px] tracking-[0.22em] text-ink/70 uppercase">
            Ginecologia e Reprodução Humana
          </div>
        )}
      </div>
    </div>
  );
}
