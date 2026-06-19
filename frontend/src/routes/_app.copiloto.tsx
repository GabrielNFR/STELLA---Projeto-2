import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Eye, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { buildApiUrl } from "@/lib/api";

export const Route = createFileRoute("/_app/copiloto")({
  head: () => ({ meta: [{ title: "Modo Copiloto — STELLA" }] }),
  component: Page,
});

function Page() {
  const [nomeIdentificador, setNomeIdentificador] = useState("");
  const [permFase, setPermFase] = useState(true);
  const [permAgenda, setPermAgenda] = useState(true);
  const [permMedicacoes, setPermMedicacoes] = useState(true);
  const [permLembretes, setPermLembretes] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!nomeIdentificador.trim()) {
      alert("Por favor, identifique para quem é o acesso (ex: Meu Marido).");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl("/api/tratamento/copiloto/convidar/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_identificador: nomeIdentificador,
          perm_ver_fase: permFase,
          perm_ver_agenda: permAgenda,
          perm_ver_medicacoes: permMedicacoes,
          perm_receber_lembretes: permLembretes,
        }),
      });

      if (!response.ok) throw new Error("Erro ao gerar link");

      const data = await response.json();
      // Cria a URL baseada no frontend atual + /convite/{token}
      const link = `${window.location.origin}/convite/${data.token}`;
      setGeneratedLink(link);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao gerar o link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Parceiro"
        title="Modo Copiloto"
        description="Permita que seu(sua) parceiro(a) ou familiar acompanhe sua jornada medicamentosa."
      />

      <Card className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft/60 text-rose-deep shrink-0">
            <Eye className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg">Acesso via Link</h3>
            <p className="text-sm text-muted-foreground">
              Gere um link seguro configurando o que a pessoa pode visualizar.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Ex: Minha Mãe" 
            className="rounded-md border border-border px-3 py-2 text-sm max-w-50"
            value={nomeIdentificador}
            onChange={(e) => setNomeIdentificador(e.target.value)}
          />
          <button 
            onClick={handleShare}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card hover:brightness-110 disabled:opacity-50"
          >
            <Share2 className="h-4 w-4" /> {isLoading ? "Gerando..." : "Gerar Link"}
          </button>
        </div>
      </Card>

      {generatedLink && (
        <Card className="mt-4 border-rose-deep/20 bg-rose-soft/10">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-rose-deep">Link de Acesso Gerado!</h4>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={generatedLink} 
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground outline-none"
              />
              <button 
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Envie este link para <strong>{nomeIdentificador}</strong>. O acesso garantirá as permissões definidas abaixo.
            </p>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg">Permissões do próximo link</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <input type="checkbox" checked={permFase} onChange={(e) => setPermFase(e.target.checked)} className="h-4 w-4 accent-rose-deep" />
              Ver fase atual da jornada
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" checked={permAgenda} onChange={(e) => setPermAgenda(e.target.checked)} className="h-4 w-4 accent-rose-deep" />
              Ver agenda de eventos
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" checked={permMedicacoes} onChange={(e) => setPermMedicacoes(e.target.checked)} className="h-4 w-4 accent-rose-deep" />
              Ver lista de medicações
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" checked={permLembretes} onChange={(e) => setPermLembretes(e.target.checked)} className="h-4 w-4 accent-rose-deep" />
              Receber lembretes de medicamento
            </li>
          </ul>
        </Card>
        
        <Card>
          <h3 className="font-display text-lg">Convites ativos</h3>
          <ul className="mt-3 divide-y divide-border">
            <li className="flex items-center justify-between py-3">
              <div className="text-sm text-muted-foreground italic">
                A lista de convites ativos será conectada ao banco em breve.
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
