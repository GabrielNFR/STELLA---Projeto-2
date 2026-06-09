export function StellaLogo({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-end gap-1 ${className ?? ""}`}>
      <span className="text-[10px] font-medium lowercase leading-none tracking-[0.18em] text-rose-deep/70">
        powered by
      </span>
      <img src="/logo-stella.png" alt="STELLA" className="h-8 w-auto object-contain" />
    </div>
  );
}
