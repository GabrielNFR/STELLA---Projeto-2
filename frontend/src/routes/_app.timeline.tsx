import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Check, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/timeline")({
  head: () => ({ meta: [{ title: "Timeline — STELLA" }] }),
  component: Timeline,
});

// A tipagem para o que vem do nosso Django
interface FaseTratamento {
  id: number;
  nome: string;
  ordem_cronologica: number;
  status: 'concluida' | 'atual' | 'pendente';
  descricao: string;
}

function Timeline() {
  const [fases, setFases] = useState<FaseTratamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Aqui buscamos a verdadeira Timeline do seu backend!
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tratamento/fases/')
      .then(resposta => resposta.json())
      .then(dados => {
        setFases(dados);
        setCarregando(false);
      })
      .catch(erro => {
        console.error("Erro ao buscar fases:", erro);
        setCarregando(false);
      });
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Timeline"
        title="Baby is coming…"
        description="Acompanhe cada etapa da sua jornada de FIV real."
      />
      
      {carregando ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-rose-deep" />
        </div>
      ) : (
        <ol className="relative space-y-4 border-l-2 border-rose-soft/60 pl-6">
          {fases.length === 0 && (
            <p className="text-muted-foreground text-sm">Nenhum protocolo cadastrado ainda.</p>
          )}

          {/* Renderiza as fases vindas do Django */}
          {fases.sort((a, b) => a.ordem_cronologica - b.ordem_cronologica).map((fase) => {
            const isDone = fase.status === "concluida";
            const isCurrent = fase.status === "atual";
            const isTodo = fase.status === "pendente";

            return (
              <li key={fase.id}>
                <span
                  className={[
                    "absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full border-2",
                    isDone && "bg-rose-deep border-rose-deep text-primary-foreground",
                    isCurrent && "bg-card border-rose-deep text-rose-deep ring-4 ring-rose-deep/20",
                    isTodo && "bg-card border-border text-muted-foreground",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-current" />}
                </span>
                <Card className={isCurrent ? "border-rose-deep" : ""}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg">{fase.ordem_cronologica}. {fase.nome}</h3>
                    {isCurrent && (
                      <span className="rounded-full bg-rose-soft px-2 py-0.5 text-xs text-rose-deep">
                        Em andamento
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{fase.descricao}</p>
                </Card>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}