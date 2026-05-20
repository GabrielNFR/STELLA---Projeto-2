import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/recuperar-codigo")({
  head: () => ({
    meta: [
      { title: "Verificação de código — AMARE × STELLA" },
      { name: "description", content: "Insira o código de 4 dígitos enviado por email." },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  return (
    <AuthLayout>
      <h1 className="font-display text-3xl text-ink">Enviamos um código!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Verifique seu email e insira o código de verificação abaixo.
      </p>
      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/login" });
        }}
      >
        <div>
          <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-ink/70">
            Código (4 dígitos)
          </span>
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                ref={(element) => {
                  refs.current[i] = element;
                }}
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value && i < 3) refs.current[i + 1]?.focus();
                }}
                className="aspect-square w-full max-w-16 rounded-2xl border border-border bg-card text-center font-display text-2xl outline-none transition focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-rose-deep py-3 text-sm text-primary-foreground shadow-card transition hover:brightness-110 active:scale-[0.99]"
        >
          Continuar
        </button>
        <Link to="/recuperar-senha" className="block text-center text-xs text-muted-foreground hover:text-ink">
          Reenviar código
        </Link>
      </form>
    </AuthLayout>
  );
}
