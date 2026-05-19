import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Modal, fieldClass, labelClass, submitBtnClass } from "@/components/ui-bits/Modal";
import { Calendar, Pill, FlaskConical, Stethoscope, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/calendario")({
  head: () => ({ meta: [{ title: "Calendário inteligente — STELLA" }] }),
  component: Page,
});

type EventType = "med" | "exam" | "consult";
type Ev = { day: number; time: string; type: EventType; title: string };

const initial: Ev[] = [
  { day: 12, time: "08:00", type: "med", title: "Medicação X" },
  { day: 12, time: "08:30", type: "med", title: "Medicação Y" },
  { day: 12, time: "14:00", type: "exam", title: "Ultrassom transvaginal" },
  { day: 12, time: "16:30", type: "consult", title: "Consulta Dra Adriana" },
  { day: 14, time: "09:00", type: "exam", title: "Coleta de sangue – Estradiol" },
  { day: 18, time: "10:00", type: "consult", title: "Retorno Dra Adriana" },
];

const iconFor = { med: Pill, exam: FlaskConical, consult: Stethoscope };

const typeStyles: Record<string, string> = {
  med: "bg-rose-soft/60 text-rose-deep",
  exam: "bg-accent text-accent-foreground",
  consult: "bg-rose-deep text-primary-foreground",
};

function Page() {
  const [events, setEvents] = useState<Ev[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ title: string; day: string; time: string; type: EventType }>({
    title: "",
    day: "12",
    time: "09:00",
    type: "consult",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const day = Number(form.day) || 1;
    setEvents([...events, { title: form.title.trim(), day, time: form.time, type: form.type }]);
    setForm({ title: "", day: "12", time: "09:00", type: "consult" });
    setOpen(false);
  };

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const grid = [
    [30, 31, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 1, 2, 3],
  ];
  const today = 12;
  const eventDays = new Set(events.map((e) => e.day));
  const todays = events.filter((e) => e.day === 12).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = events
    .filter((e) => e.day !== 12)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Calendário inteligente"
        description="Consultas, exames e medicações reunidos em uma única visão."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Março 2024</h2>
            <Calendar className="h-5 w-5 text-rose-deep" />
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
            {days.map((d, i) => <div key={i} className="py-1">{d}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-2 text-sm">
            {grid.flat().map((n, i) => {
              const inMonth = i >= 2 && i < 33;
              const isToday = inMonth && n === today;
              const hasEvent = inMonth && eventDays.has(n);
              return (
                <button
                  key={i}
                  className={[
                    "aspect-square rounded-2xl transition flex flex-col items-center justify-center",
                    !inMonth ? "text-muted-foreground/40" : "hover:bg-rose-soft/40",
                    isToday ? "bg-rose-deep text-primary-foreground hover:bg-rose-deep" : "",
                  ].join(" ")}
                >
                  <span>{n}</span>
                  {hasEvent && !isToday && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-rose-deep" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-xl">Hoje, 12 de março</h2>
          <ul className="space-y-3">
            {todays.map((e, i) => {
              const Icon = iconFor[e.type];
              return (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-border p-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${typeStyles[e.type]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.time}</div>
                  </div>
                </li>
              );
            })}
          </ul>

          <h3 className="mt-6 mb-3 font-display text-lg">Próximos dias</h3>
          <ul className="space-y-2">
            {upcoming.map((e, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-rose-soft/30">
                <span className={`h-2 w-2 rounded-full ${typeStyles[e.type].split(" ")[0]}`} />
                <span className="text-xs text-muted-foreground w-10">{`${e.day}/03`}</span>
                <span className="text-sm">{e.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{e.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo compromisso">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Título</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={fieldClass}
              placeholder="Ex: Consulta Dra Adriana"
            />
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
              className={fieldClass}
            >
              <option value="consult">Consulta</option>
              <option value="exam">Exame</option>
              <option value="med">Medicação</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Dia (março)</label>
              <input
                type="number"
                min={1}
                max={31}
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Horário</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>
          <button type="submit" className={submitBtnClass}>Adicionar à agenda</button>
        </form>
      </Modal>
    </div>
  );
}
