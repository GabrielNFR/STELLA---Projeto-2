import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Modal, fieldClass, labelClass, submitBtnClass } from "@/components/ui-bits/Modal";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/notas")({
  head: () => ({ meta: [{ title: "Bloco de notas — STELLA" }] }),
  component: Page,
});

type Note = { date: string; title: string; body: string };

const initial: Note[] = [
  { date: "10/03", title: "Dúvidas para a próxima consulta", body: "Perguntar sobre dose de Gonal-F e efeitos colaterais." },
  { date: "08/03", title: "Como me senti hoje", body: "Inchaço leve no fim da tarde, melhorou após repouso." },
  { date: "06/03", title: "Lembrete farmácia", body: "Cetrotide chega na sexta — confirmar com a clínica." },
];

function todayDM() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function Page() {
  const [notes, setNotes] = useState<Note[]>(initial);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setNotes([{ date: todayDM(), title: title.trim(), body: body.trim() }, ...notes]);
    setTitle("");
    setBody("");
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Bloco de notas"
        title="Suas anotações"
        description="Registre dúvidas, lembretes e observações ao longo do tratamento."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Nova nota
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((n, i) => (
          <Card key={i}>
            <div className="text-xs uppercase tracking-wider text-rose-deep">{n.date}</div>
            <h3 className="mt-1 font-display text-lg">{n.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{n.body}</p>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nova nota">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Título</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldClass}
              placeholder="Ex: Dúvidas para a consulta"
            />
          </div>
          <div>
            <label className={labelClass}>Conteúdo</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`${fieldClass} resize-none`}
              placeholder="Escreva sua nota..."
            />
          </div>
          <button type="submit" className={submitBtnClass}>Salvar nota</button>
        </form>
      </Modal>
    </div>
  );
}
