import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar conta — AMARE × STELLA" },
      { name: "description", content: "Recupere o acesso à sua conta." },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <h1 className="font-display text-3xl text-ink">Recupere sua conta!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Insira seu endereço de email
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/recuperar-codigo" });
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink/70">
            E-mail
          </span>
          <input
            type="email"
            required
            placeholder="voce@email.com"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-rose-deep py-3 text-sm text-primary-foreground shadow-card transition hover:brightness-110 active:scale-[0.99]"
        >
          Continuar
        </button>
        <Link to="/login" search={{ inviteToken: undefined }} className="block text-center text-xs text-muted-foreground hover:text-ink">
          ← Voltar ao login
        </Link>
      </form>
    </AuthLayout>
  );
}
