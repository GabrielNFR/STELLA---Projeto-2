type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 text-xs uppercase tracking-[0.25em] text-rose-deep">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl md:text-4xl text-ink">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}
