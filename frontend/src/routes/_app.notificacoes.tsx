import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Bell, CalendarDays, FlaskConical, Pill, Megaphone, CheckCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações — STELLA" },
      { name: "description", content: "Notificações enviadas pela clínica." },
    ],
  }),
  component: NotificacoesPage,
});

type Notificacao = {
  id: string;
  tipo: "consulta" | "exame" | "medicacao" | "clinica";
  titulo: string;
  mensagem: string;
  quando: string;
  lida: boolean;
};

const iconByTipo = {
  consulta: CalendarDays,
  exame: FlaskConical,
  medicacao: Pill,
  clinica: Megaphone,
} as const;

const labelByTipo = {
  consulta: "Consulta",
  exame: "Exame",
  medicacao: "Medicação",
  clinica: "Clínica",
} as const;

const initial: Notificacao[] = [
  {
    id: "1",
    tipo: "clinica",
    titulo: "Bem-vinda à clínica Amare",
    mensagem:
      "Sua equipe está pronta para acompanhar sua jornada. Confira os próximos passos no seu calendário.",
    quando: "Hoje, 09:12",
    lida: false,
  },
  {
    id: "2",
    tipo: "consulta",
    titulo: "Consulta confirmada com Dra. Adriana",
    mensagem:
      "Sua consulta foi confirmada para 18/05 às 16h30. Chegue com 15 minutos de antecedência.",
    quando: "Hoje, 08:40",
    lida: false,
  },
  {
    id: "3",
    tipo: "exame",
    titulo: "Resultado de exame disponível",
    mensagem:
      "O resultado do seu hemograma já está no Hub de exames. Toque para visualizar.",
    quando: "Ontem, 18:05",
    lida: false,
  },
  {
    id: "4",
    tipo: "medicacao",
    titulo: "Lembrete de medicação",
    mensagem:
      "Não esqueça de tomar a Medicação Y às 8h30. Marque como concluída na sua Necessaire.",
    quando: "Ontem, 08:25",
    lida: true,
  },
  {
    id: "5",
    tipo: "clinica",
    titulo: "Atualização de protocolo",
    mensagem:
      "Sua equipe ajustou o protocolo da fase de estimulação ovariana. Acesse a Timeline para detalhes.",
    quando: "12/05, 14:10",
    lida: true,
  },
];

function NotificacoesPage() {
  const [items, setItems] = useState<Notificacao[]>(initial);
  const naoLidas = items.filter((i) => !i.lida).length;

  const marcarTodas = () =>
    setItems((prev) => prev.map((i) => ({ ...i, lida: true })));
  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, lida: !i.lida } : i)),
    );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Da clínica para você"
        title="Notificações"
        description="Avisos, lembretes e atualizações enviados pela equipe da clínica."
        actions={
          <button
            onClick={marcarTodas}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-ink hover:bg-rose-soft/50"
          >
            <CheckCheck className="h-4 w-4 text-rose-deep" />
            Marcar todas como lidas
          </button>
        }
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Bell className="h-4 w-4 text-rose-deep" />
        {naoLidas > 0 ? (
          <span>
            Você tem <strong className="text-ink">{naoLidas}</strong>{" "}
            {naoLidas === 1 ? "notificação não lida" : "notificações não lidas"}.
          </span>
        ) : (
          <span>Tudo em dia. Nenhuma notificação pendente.</span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((n) => {
          const Icon = iconByTipo[n.tipo];
          return (
            <Card
              key={n.id}
              className={`!p-4 ${!n.lida ? "ring-1 ring-rose-deep/30" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-soft/60 text-rose-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-rose-deep">
                      {labelByTipo[n.tipo]}
                    </span>
                    {!n.lida && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-rose-deep" />
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {n.quando}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-lg text-ink">
                    {n.titulo}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {n.mensagem}
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => toggle(n.id)}
                      className="text-xs text-rose-deep hover:underline"
                    >
                      {n.lida ? "Marcar como não lida" : "Marcar como lida"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
