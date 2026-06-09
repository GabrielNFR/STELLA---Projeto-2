export function StakeholdersIllustration({ className }: { className?: string }) {
  return (
    <div
      style={{ borderRadius: "34% 0 0 34% / 52% 0 0 52%" }}
      className={`relative overflow-hidden border border-white/55 bg-gradient-to-br from-rose-soft/30 via-card/30 to-transparent shadow-[0_30px_90px_rgba(117,72,72,0.16)] ring-1 ring-rose-soft/20 ${className ?? ""}`}
    >
      <img
        src="/equipe-vetor-home.png"
        alt="Equipe médica AMARE"
        className="block h-full w-full object-cover object-[50%_50%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent" />
    </div>
  );
}
