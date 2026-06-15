import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AmareLogo } from "@/components/brand/AmareLogo";
import { StellaLogo } from "@/components/brand/StellaLogo";
import { Bell, Eye, EyeOff } from "lucide-react";
import { useUserProfile } from "@/lib/userProfileContext";

// Validate search params (se estamos vindo de um convite de copiloto)
export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      inviteToken: (search.inviteToken as string) || undefined,
    }
  },
  head: () => ({
    meta: [
      { title: "Entrar — AMARE × STELLA" },
      { name: "description", content: "Acesse sua jornada de tratamento na plataforma AMARE." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { refreshUser } = useUserProfile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Não foi possível entrar.");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      await refreshUser();
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {searchParams.inviteToken ? (
        <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-ink/80 flex gap-3">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <strong>Convite Vinculado</strong>
            <p className="mt-1">
              Faça login (ou crie seu acesso de Copiloto) para ativar o convite.
            </p>
            <span className="text-xs text-muted-foreground mt-2 block break-all">
              Token: {searchParams.inviteToken}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-rose-soft/40 p-4 text-sm text-ink/80 flex gap-3">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-rose-deep" />
          <div>
            <strong>Primeira vez aqui?</strong>
            <p className="mt-1">
              Seu acesso será criado pela Clínica AMARE após sua primeira
              consulta. Entre em contato se não recebeu suas credenciais.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h1 className="font-display text-3xl text-ink">Seja bem-vinda!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entre para acessar sua jornada de tratamento
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Field label="E-mail">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
          />
        </Field>

        <Field
          label="Senha"
          right={
            <Link
              to="/recuperar-senha"
              className="text-xs text-rose-deep underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          }
        >
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-11 text-sm outline-none transition focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-ink"
              aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {error ? <p className="text-sm text-rose-deep">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-rose-deep py-3 text-sm font-medium text-primary-foreground shadow-card transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        <Link
          to="/"
          className="block text-center text-xs text-muted-foreground hover:text-ink"
        >
          ← Voltar para a página inicial
        </Link>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
        <Link to="/" className="self-center">
          <AmareLogo />
        </Link>
        <div className="my-auto py-10">{children}</div>
        <div className="self-center">
          <StellaLogo />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ink/70">
          {label}
        </span>
        {right}
      </div>
      {children}
    </label>
  );
}
