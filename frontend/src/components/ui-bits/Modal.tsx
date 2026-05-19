import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft animate-in fade-in zoom-in-95">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-rose-soft/50"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const fieldClass =
  "w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30";

export const labelClass = "mb-1 block text-xs font-medium text-ink/80";

export const submitBtnClass =
  "w-full rounded-full bg-rose-deep px-6 py-3 text-sm text-primary-foreground shadow-card transition hover:brightness-110 active:scale-[0.99]";
