import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/_app/como-estou-hoje")({
  head: () => ({ meta: [{ title: "Como estou hoje? — STELLA" }] }),
  component: Page,
});

const moods = ["Ótima", "Bem", "Neutra", "Cansada", "Ansiosa", "Triste"];
const symptoms = [
  "Dor abdominal",
  "Inchaço",
  "Náusea",
  "Cefaleia",
  "Sensibilidade nos seios",
  "Cólica",
  "Sangramento leve",
  "Tontura",
  "Insônia",
  "Calor",
];
const physiology = ["Sono ruim", "Apetite baixo", "Hidratação ok", "Exercício leve"];

type DiarioRegistro = {
  id: number;
  humor: string;
  sintomas: string[];
  condicoes_fisiologicas: string[];
  notas: string;
  criado_em: string;
};

const toDateKey = (date: Date | string) => {
  const value = typeof date === "string" ? new Date(date) : date;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const dateFromKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

const formatLongDate = (date?: Date) => {
  if (!date) return "Selecione uma data";

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

function Page() {
  const [mood, setMood] = useState("Bem");
  const [picks, setPicks] = useState<string[]>([]);
  const [phys, setPhys] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [diarios, setDiarios] = useState<DiarioRegistro[]>([]);
  const [isLoadingDiarios, setIsLoadingDiarios] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const loadDiarios = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setDiarios([]);
      return;
    }

    setIsLoadingDiarios(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/diario/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setDiarios([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar diário");
      }

      const data = await response.json();
      setDiarios(Array.isArray(data) ? data : data.results || []);
    } catch {
      setDiarios([]);
    } finally {
      setIsLoadingDiarios(false);
    }
  }, []);

  useEffect(() => {
    void loadDiarios();
  }, [loadDiarios]);

  const diasComDiario = useMemo(() => {
    const keys = Array.from(new Set(diarios.map((diario) => toDateKey(diario.criado_em))));
    return keys.map(dateFromKey);
  }, [diarios]);

  const diariosDoDia = useMemo(() => {
    if (!selectedDate) return [];

    const selectedKey = toDateKey(selectedDate);
    return diarios.filter((diario) => toDateKey(diario.criado_em) === selectedKey);
  }, [diarios, selectedDate]);

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setFeedback({
        type: "error",
        text: "Faça login para salvar seu diário.",
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/diario/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          humor: mood,
          sintomas: picks,
          condicoes_fisiologicas: phys,
          notas: notes,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        throw new Error("Sua sessão expirou. Faça login novamente.");
      }

      if (!response.ok) {
        throw new Error("Erro ao salvar diário");
      }

      const savedDiario = await response.json();

      setMood("Bem");
      setPicks([]);
      setPhys([]);
      setNotes("");
      setSelectedDate(savedDiario.criado_em ? new Date(savedDiario.criado_em) : new Date());
      await loadDiarios();
      setFeedback({ type: "success", text: "Diário salvo com sucesso." });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Não foi possível salvar seu diário. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggle = (
    list: string[],
    set: (v: string[]) => void,
    item: string,
  ) => set(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  return (
    <div className="space-y-8 como-estou-hoje-page">
      <PageHeader
        eyebrow="Check-in diário"
        title="Como você está hoje?"
        description="Registre seu humor, sintomas e condições fisiológicas. Suas respostas ajudam a equipe a acompanhar você."
      />

      <Card>
        <h3 className="mb-3 font-display text-lg">Humor</h3>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={[
                "rounded-full px-4 py-2 text-sm transition active:bg-[#C17E81] active:text-primary-foreground",
                mood === m
                  ? "bg-[#C17E81] text-primary-foreground"
                  : "bg-[#F3DBDB] text-ink hover:bg-[#D3B1AF]",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-display text-lg">Sintomas</h3>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((s) => {
            const on = picks.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(picks, setPicks, s)}
                className={[
                  "rounded-full border px-4 py-2 text-sm transition active:bg-[#C17E81] active:text-primary-foreground",
                  on
                    ? "border-[#C17E81] bg-[#C17E81] text-primary-foreground"
                    : "border-border bg-[#F3DBDB] text-ink hover:bg-[#D3B1AF]",
                ].join(" ")}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-display text-lg">Condições fisiológicas</h3>
        <div className="flex flex-wrap gap-2">
          {physiology.map((s) => {
            const on = phys.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(phys, setPhys, s)}
                className={[
                  "rounded-full border px-4 py-2 text-sm transition active:bg-[#C17E81] active:text-primary-foreground",
                  on
                    ? "border-[#C17E81] bg-[#C17E81] text-primary-foreground"
                    : "border-border bg-[#F3DBDB] text-ink hover:bg-[#D3B1AF]",
                ].join(" ")}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-display text-lg">Notas adicionais</h3>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Como foi seu dia?"
          className="w-full resize-none rounded-2xl border border-border bg-background/60 p-4 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
        />
      </Card>

      <div className="flex items-center justify-between gap-4">
        {feedback ? (
          <p
            className={[
              "text-sm",
              feedback.type === "success" ? "text-emerald-600" : "text-rose-deep",
            ].join(" ")}
          >
            {feedback.text}
          </p>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-[#F3DBDB] px-6 py-3 text-sm text-ink transition hover:bg-[#D3B1AF] active:bg-[#C17E81] active:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70 disabled:text-ink/70"
        >
          {isSaving ? "Salvando..." : "Salvar check-in"}
        </button>
      </div>

      <Card>
        <div className="mb-5 flex flex-col gap-1">
          <h3 className="font-display text-lg">Histórico do diário</h3>
          <p className="text-sm text-muted-foreground">
            Selecione um dia no calendário para ver os registros salvos.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[20rem_1fr] lg:items-start">
          <div className="rounded-2xl border border-border bg-background/60 p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ registrado: diasComDiario }}
              modifiersClassNames={{
                registrado: "bg-rose-soft/60 text-ink font-medium rounded-md",
              }}
              className="mx-auto bg-transparent"
            />
          </div>

          <div className="min-h-[18rem] rounded-2xl border border-border bg-background/60 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink/60">
                  Dia selecionado
                </p>
                <h4 className="mt-1 font-display text-xl text-ink capitalize">
                  {formatLongDate(selectedDate)}
                </h4>
              </div>
              <span className="rounded-full bg-rose-soft/50 px-3 py-1 text-xs text-ink/70">
                {diariosDoDia.length} registro{diariosDoDia.length === 1 ? "" : "s"}
              </span>
            </div>

            {isLoadingDiarios ? (
              <p className="text-sm text-muted-foreground">Carregando histórico...</p>
            ) : diarios.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum diário registrado ainda. Salve seu primeiro check-in para acompanhar sua evolução.
              </p>
            ) : diariosDoDia.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro neste dia.</p>
            ) : (
              <div className="space-y-4">
                {diariosDoDia.map((diario) => (
                  <article
                    key={diario.id}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-rose-deep px-3 py-1 text-xs text-primary-foreground">
                        Humor: {diario.humor}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Criado em {formatDateTime(diario.criado_em)}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ink/60">
                          Sintomas
                        </p>
                        {diario.sintomas.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {diario.sintomas.map((sintoma) => (
                              <span
                                key={sintoma}
                                className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-ink"
                              >
                                {sintoma}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Nenhum sintoma registrado.</p>
                        )}
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ink/60">
                          Condições fisiológicas
                        </p>
                        {diario.condicoes_fisiologicas.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {diario.condicoes_fisiologicas.map((condicao) => (
                              <span
                                key={condicao}
                                className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-ink"
                              >
                                {condicao}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Nenhuma condição registrada.</p>
                        )}
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ink/60">
                          Notas adicionais
                        </p>
                        <p className="leading-relaxed text-ink/80">
                          {diario.notas || "Nenhuma nota adicional."}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
