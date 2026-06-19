import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { MessageCircle, Phone, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/help")({
  head: () => ({ meta: [{ title: "Help! — STELLA" }] }),
  component: Page,
});

const WHATSAPP_URL =
  "https://wa.me/5581998003535?text=Ol%C3%A1%2C+preciso+de+ajuda+da+equipe+AMARE.";

function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Help"
        title="Precisa de ajuda?"
        description="Fale diretamente com a enfermagem ou com sua médica."
      />

      <Card className="border-rose-deep/40 bg-rose-soft/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-deep mt-0.5" />
          <p className="text-sm">
            Em caso de emergência, dirija-se ao pronto-atendimento mais próximo
            ou ligue 192 (SAMU).
          </p>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft/60 text-rose-deep">
            <MessageCircle className="h-5 w-5" />
          </span>
          <h3 className="mt-3 font-display text-lg">Falar com a enfermagem</h3>
          <p className="text-sm text-muted-foreground">
            Atendimento por WhatsApp — segunda a sexta, 8h às 18h.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card hover:brightness-110"
          >
            Abrir WhatsApp
          </a>
        </Card>
        <Card>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft/60 text-rose-deep">
            <Phone className="h-5 w-5" />
          </span>
          <h3 className="mt-3 font-display text-lg">Ligar para a clínica</h3>
          <p className="text-sm text-muted-foreground">
            (81) 3105-5540 — recepção AMARE.
          </p>
          <a
            href="tel:+558131055540"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-deep/40 px-4 py-2 text-sm text-rose-deep hover:bg-rose-soft/40"
          >
            Ligar agora
          </a>
        </Card>
      </div>
    </div>
  );
}
