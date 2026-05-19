import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Modal, fieldClass, labelClass, submitBtnClass } from "@/components/ui-bits/Modal";
import { Pill, Plus, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/medicacoes")({
  head: () => ({ meta: [{ title: "Necessaire de medicações — STELLA" }] }),
  component: Page,
});

type Med = { name: string; dose: string; times: string[]; from: string; to: string };

const initial: Med[] = [
  { name: "Gonal-F 450 UI", dose: "150 UI", times: ["08:00", "20:00"], from: "01/03", to: "12/03" },
  { name: "Cetrotide 0,25 mg", dose: "1 amp.", times: ["08:30"], from: "08/03", to: "12/03" },
  { name: "Ovidrel 250 mcg", dose: "1 amp.", times: ["22:00"], from: "11/03", to: "11/03" },
  { name: "Utrogestan 200 mg", dose: "1 cápsula", times: ["08:00", "14:00", "22:00"], from: "13/03", to: "—" },
];

function Page() {
  const [meds, setMeds] = useState<Med[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", dose: "", times: "", from: "", to: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const times = form.times
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setMeds([
      {
        name: form.name.trim(),
        dose: form.dose.trim() || "—",
        times: times.length ? times : ["08:00"],
        from: form.from.trim() || "—",
        to: form.to.trim() || "—",
      },
      ...meds,
    ]);
    setForm({ name: "", dose: "", times: "", from: "", to: "" });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Receitas"
        title="Necessaire de medicações"
        description="Organize cronologicamente todas as suas receitas e horários."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Nova medicação
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {meds.map((m, i) => (
          <Card key={i}>
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft/60 text-rose-deep">
                <Pill className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg">{m.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {m.dose} · {m.from} → {m.to}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {m.times.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-ink ring-1 ring-border"
                >
                  <Clock className="h-3 w-3 text-rose-deep" /> {t}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nova medicação">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Medicação</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={fieldClass}
              placeholder="Ex: Gonal-F 450 UI"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Dose</label>
              <input
                value={form.dose}
                onChange={(e) => setForm({ ...form, dose: e.target.value })}
                className={fieldClass}
                placeholder="150 UI"
              />
            </div>
            <div>
              <label className={labelClass}>Horários (separe por vírgula)</label>
              <input
                value={form.times}
                onChange={(e) => setForm({ ...form, times: e.target.value })}
                className={fieldClass}
                placeholder="08:00, 20:00"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Início</label>
              <input
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className={fieldClass}
                placeholder="01/03"
              />
            </div>
            <div>
              <label className={labelClass}>Fim</label>
              <input
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className={fieldClass}
                placeholder="12/03"
              />
            </div>
          </div>
          <button type="submit" className={submitBtnClass}>Salvar medicação</button>
        </form>
      </Modal>
    </div>
  );
}
