import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Eye, Share2 } from "lucide-react";

export const Route = createFileRoute("/_app/copiloto")({
  head: () => ({ meta: [{ title: "Modo Copiloto — STELLA" }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Parceiro"
        title="Modo Copiloto"
        description="Permita que seu(sua) parceiro(a) acompanhe sua jornada em modo somente-leitura."
      />

      <Card className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft/60 text-rose-deep">
          <Eye className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-lg">Acesso do copiloto</h3>
          <p className="text-sm text-muted-foreground">
            Compartilhe um link seguro para visualização da sua agenda, medicações e fase atual.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card hover:brightness-110">
          <Share2 className="h-4 w-4" /> Compartilhar
        </button>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg">Convites ativos</h3>
          <ul className="mt-3 divide-y divide-border">
            <li className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">Marcos Albuquerque</div>
                <div className="text-xs text-muted-foreground">marcos@email.com · acesso desde 02/03</div>
              </div>
              <button className="text-xs text-rose-deep hover:underline">Revogar</button>
            </li>
          </ul>
        </Card>
        <Card>
          <h3 className="font-display text-lg">Permissões</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {["Ver fase atual da jornada", "Ver agenda de eventos", "Ver lista de medicações", "Receber lembretes"].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-rose-deep" />
                {p}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
