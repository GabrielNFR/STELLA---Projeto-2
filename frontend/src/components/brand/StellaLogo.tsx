export function StellaLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs tracking-[0.2em] text-ink/60 ${className ?? ""}`}>
      <span>powered by</span>
      <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
        <path
          d="M8 1l1.8 4.5L14 7l-3.5 3 1 4.5L8 12l-3.5 2.5 1-4.5L2 7l4.2-1.5z"
          fill="oklch(0.66 0.085 15)"
        />
      </svg>
      <span className="font-display tracking-[0.3em]">STELLA</span>
      <span className="text-[10px]">healthguide</span>
    </div>
  );
}
