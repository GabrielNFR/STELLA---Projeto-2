import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, HeartPulse } from "lucide-react";
import { AmareLogo } from "@/components/brand/AmareLogo";

export const Route = createFileRoute("/convite/$token")({
  head: () => ({
    meta: [
      { title: "Convite Modo Copiloto — STELLA" },
    ],
  }),
  component: ConviteDetalhePage,
});

function ConviteDetalhePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();

  // Neste cenário simulado, o usuário copia ou aceita o acesso
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand p-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-soft text-rose-deep">
          <HeartPulse className="h-8 w-8" />
        </div>

        <div>
          <h1 className="font-display text-2xl text-ink">Convite Recebido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Você foi convidado(a) para acompanhar o tratamento de um paciente na plataforma STELLA.
          </p>
        </div>

        <div className="space-y-3 rounded-xl bg-sand p-4 text-left text-sm">
          <div className="flex items-center gap-2 text-ink">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-emerald-800">Acesso Seguro</span>
          </div>
          <p className="text-muted-foreground">
            Ao aceitar o convite, você criará sua conta vinculada e poderá visualizar as informações compartilhadas conforme as permissões.
          </p>
        </div>

        <button 
          onClick={() => {
            navigate({ to: "/login", search: { inviteToken: token } });
          }}
          className="w-full rounded-full bg-rose-deep px-4 py-3 text-sm font-medium text-white shadow-card transition-all hover:brightness-110"
        >
          Aceitar Convite
        </button>

        <div className="pt-4">
          <Link to="/login" search={{ inviteToken: token }} className="text-xs text-muted-foreground hover:underline">
            Já possui cadastro como copiloto? Entrar
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <AmareLogo className="mx-auto h-6 opacity-40 grayscale" />
      </div>
    </div>
  );
}