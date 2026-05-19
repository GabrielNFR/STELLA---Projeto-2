import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Play } from "lucide-react";

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

function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Videoteca"
        title="Vídeos da equipe AMARE"
        description="Materiais explicativos sobre FIV, medicações e cuidados."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
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
    </div>
  );
}
