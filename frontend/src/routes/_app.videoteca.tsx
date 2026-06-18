import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Play, Search } from "lucide-react";

export const Route = createFileRoute("/_app/videoteca")({
  head: () => ({ meta: [{ title: "Videoteca — STELLA" }] }),
  component: Page,
});

const videos = [
  { title: "O que é FIV?", duration: "4:20", category: "Conceitos" },
  { title: "Como aplicar Gonal-F", duration: "3:05", category: "Medicações" },
  { title: "Como aplicar Cetrotide", duration: "2:48", category: "Medicações" },
  { title: "O dia da punção", duration: "5:12", category: "Procedimentos" },
  { title: "Cuidados após a transferência", duration: "3:40", category: "Cuidados" },
  { title: "Bem-estar emocional", duration: "6:00", category: "Apoio" },
];

const categorias = ["Todos", ...Array.from(new Set(videos.map((v) => v.category)))];

function Page() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  const filtrados = videos.filter((v) => {
    const bateCategoria = categoriaAtiva === "Todos" || v.category === categoriaAtiva;
    const bateBusca = v.title.toLowerCase().includes(busca.toLowerCase());
    return bateCategoria && bateBusca;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Videoteca"
        title="Vídeos da equipe AMARE"
        description="Materiais explicativos sobre FIV, medicações e cuidados."
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar vídeos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-9 pr-4 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              categoriaAtiva === cat
                ? "bg-rose-deep text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-rose-deep/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>Nenhum resultado encontrado para "{busca}".</p>
          <p className="mt-1 text-sm">Tente outra busca ou navegue pelas categorias.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((v) => (
            <Card key={v.title} className="!p-0 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-rose-soft to-rose-deep/50">
                <button
                  className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-card/90 text-rose-deep shadow-soft flex items-center justify-center transition hover:scale-105"
                  aria-label={`Reproduzir ${v.title}`}
                >
                  <Play className="h-6 w-6 ml-0.5 fill-current" />
                </button>
                <div className="absolute bottom-2 right-2 rounded-full bg-ink/60 px-2 py-0.5 text-xs text-cream">
                  {v.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs uppercase tracking-wider text-rose-deep">{v.category}</div>
                <h3 className="mt-1 font-display text-lg">{v.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
