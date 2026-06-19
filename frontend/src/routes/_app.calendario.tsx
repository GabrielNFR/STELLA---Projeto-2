import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Modal, fieldClass, labelClass, submitBtnClass } from "@/components/ui-bits/Modal";
import { buildApiUrl } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Loader2,
  Plus,
  Stethoscope,
} from "lucide-react";

export const Route = createFileRoute("/_app/calendario")({
  head: () => ({ meta: [{ title: "Calendário inteligente — STELLA" }] }),
  component: Page,
});

type EventType = "consulta" | "exame";

type EventoAgenda = {
  id: number;
  titulo: string;
  tipo: EventType;
  data: string;
  horario: string;
  local: string;
  observacoes: string;
};

type EventoAgendaInput = Omit<EventoAgenda, "id">;

const API_URL = buildApiUrl("/api/tratamento/agenda/");

const iconFor = { consulta: Stethoscope, exame: FlaskConical };

const typeStyles: Record<EventType, string> = {
  consulta: "bg-rose-deep text-primary-foreground",
  exame: "bg-accent text-accent-foreground",
};

const typeLabel: Record<EventType, string> = {
  consulta: "Consulta",
  exame: "Exame",
};

function Page() {
  const queryClient = useQueryClient();
  const todayValue = toDateInputValue();

  const [selectedDate, setSelectedDate] = useState(todayValue);
  const [monthDate, setMonthDate] = useState(() => parseDateInput(todayValue));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EventoAgendaInput>(() => ({
    titulo: "",
    tipo: "consulta",
    data: todayValue,
    horario: "09:00",
    local: "",
    observacoes: "",
  }));

  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useQuery<EventoAgenda[]>({
    queryKey: ["agenda"],
    queryFn: fetchEventosAgenda,
  });

  const createEvento = useMutation({
    mutationFn: createEventoAgenda,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["agenda"] });
      setSelectedDate(created.data);
      setMonthDate(parseDateInput(created.data));
      setForm({
        titulo: "",
        tipo: "consulta",
        data: created.data,
        horario: "09:00",
        local: "",
        observacoes: "",
      });
      setOpen(false);
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const titulo = form.titulo.trim();
    if (!titulo || !form.data || !form.horario) return;
    createEvento.mutate({
      titulo,
      tipo: form.tipo,
      data: form.data,
      horario: form.horario,
      local: form.local.trim(),
      observacoes: form.observacoes.trim(),
    });
  };

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          a.data.localeCompare(b.data) ||
          normalizeTime(a.horario).localeCompare(normalizeTime(b.horario)),
      ),
    [events],
  );
  const eventDays = useMemo(() => new Set(sortedEvents.map((e) => e.data)), [sortedEvents]);
  const selectedEvents = sortedEvents.filter((e) => e.data === selectedDate);
  const upcoming = sortedEvents.filter((e) => e.data > selectedDate).slice(0, 8);
  const grid = useMemo(() => buildMonthGrid(monthDate), [monthDate]);
  const errorMessage = error instanceof Error ? error.message : "Não foi possível carregar a agenda.";

  const openForm = () => {
    setForm((current) => ({ ...current, data: selectedDate }));
    setOpen(true);
  };

  const changeMonth = (offset: number) => {
    setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + offset, 1));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Calendário inteligente"
        description="Consultas e exames reunidos em uma única visão."
        actions={
          <button
            onClick={openForm}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl capitalize">{formatMonth(monthDate)}</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded-full p-2 hover:bg-rose-soft/40"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <Calendar className="h-5 w-5 text-rose-deep" />
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rounded-full p-2 hover:bg-rose-soft/40"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <div key={i} className="py-1">{d}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-2 text-sm">
            {grid.map((day) => {
              const isToday = day.date === todayValue;
              const isSelected = day.date === selectedDate;
              const hasEvent = eventDays.has(day.date);
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day.date);
                    if (!day.inMonth) setMonthDate(parseDateInput(day.date));
                  }}
                  className={[
                    "aspect-square rounded-2xl transition flex flex-col items-center justify-center",
                    !day.inMonth ? "text-muted-foreground/40" : "hover:bg-rose-soft/40",
                    isSelected ? "ring-2 ring-rose-deep" : "",
                    isToday ? "bg-rose-deep text-primary-foreground hover:bg-rose-deep" : "",
                  ].join(" ")}
                >
                  <span>{day.day}</span>
                  {hasEvent && !isToday && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-rose-deep" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-xl">
            {selectedDate === todayValue ? `Hoje, ${formatLongDate(selectedDate)}` : formatLongDate(selectedDate)}
          </h2>

          {isLoading && (
            <div className="flex items-center gap-2 rounded-2xl border border-border p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-rose-deep" />
              Carregando agenda...
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isLoading && !isError && (
            <EventList events={selectedEvents} emptyText="Nenhuma consulta ou exame nesta data." />
          )}

          <h3 className="mt-6 mb-3 font-display text-lg">Próximos dias</h3>
          {!isLoading && !isError && (
            <ul className="space-y-2">
              {upcoming.length === 0 && (
                <li className="rounded-xl px-2 py-2 text-sm text-muted-foreground">
                  Nenhum evento futuro cadastrado.
                </li>
              )}
              {upcoming.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-rose-soft/30">
                  <span className={`h-2 w-2 rounded-full ${typeStyles[e.tipo].split(" ")[0]}`} />
                  <span className="text-xs text-muted-foreground w-12">{formatShortDate(e.data)}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{e.titulo}</span>
                  <span className="text-xs text-muted-foreground">{normalizeTime(e.horario)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo compromisso">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Título</label>
            <input
              autoFocus
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className={fieldClass}
              placeholder="Ex: Consulta Dra Adriana"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as EventType })}
              className={fieldClass}
            >
              <option value="consulta">Consulta</option>
              <option value="exame">Exame</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Data</label>
              <input
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Horário</label>
              <input
                type="time"
                value={form.horario}
                onChange={(e) => setForm({ ...form, horario: e.target.value })}
                className={fieldClass}
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Local</label>
            <input
              value={form.local}
              onChange={(e) => setForm({ ...form, local: e.target.value })}
              className={fieldClass}
              placeholder="Ex: Clínica AMARE"
            />
          </div>
          <div>
            <label className={labelClass}>Observações</label>
            <textarea
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              className={`${fieldClass} min-h-24 resize-none`}
              placeholder="Ex: Levar exames anteriores"
            />
          </div>
          {createEvento.isError && (
            <p className="text-sm text-destructive">
              Não foi possível salvar. Verifique os dados e tente novamente.
            </p>
          )}
          <button type="submit" disabled={createEvento.isPending} className={`${submitBtnClass} disabled:opacity-60`}>
            {createEvento.isPending ? "Salvando..." : "Adicionar à agenda"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function EventList({ events, emptyText }: { events: EventoAgenda[]; emptyText: string }) {
  if (events.length === 0) {
    return <p className="rounded-2xl border border-border p-3 text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="space-y-3">
      {events.map((e) => {
        const Icon = iconFor[e.tipo];
        return (
          <li key={e.id} className="flex items-start gap-3 rounded-2xl border border-border p-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${typeStyles[e.tipo]}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{e.titulo}</div>
              <div className="text-xs text-muted-foreground">
                {typeLabel[e.tipo]} · {normalizeTime(e.horario)}
                {e.local ? ` · ${e.local}` : ""}
              </div>
              {e.observacoes && (
                <p className="mt-1 text-xs text-muted-foreground">{e.observacoes}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

async function fetchEventosAgenda() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Não foi possível carregar a agenda.");
  }
  return response.json() as Promise<EventoAgenda[]>;
}

async function createEventoAgenda(payload: EventoAgendaInput) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Não foi possível salvar o compromisso.");
  }
  return response.json() as Promise<EventoAgenda>;
}

function buildMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date: toDateInputValue(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    };
  });
}

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonth(date: Date) {
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function formatLongDate(value: string) {
  return parseDateInput(value).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });
}

function formatShortDate(value: string) {
  return parseDateInput(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}
