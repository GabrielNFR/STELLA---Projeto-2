export function StakeholdersIllustration({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <img
        src="/equipe-vetor-home.png"
        alt="Equipe médica AMARE"
        className="block h-full w-full object-contain object-left"
      />
    </div>
  );
}
