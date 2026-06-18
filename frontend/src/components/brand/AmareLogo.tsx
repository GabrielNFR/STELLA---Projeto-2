type Props = {
  className?: string;
};

export function AmareLogo({ className }: Props) {
  return (
    <img
      src="/logo-amare.png"
      alt="AMARE"
      className={`h-30 w-auto ${className ?? ""}`}
    />
  );
}