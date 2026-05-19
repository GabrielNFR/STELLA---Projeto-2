import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";

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

function Page() {
  const [mood, setMood] = useState("Bem");
  const [picks, setPicks] = useState<string[]>([]);
  const [phys, setPhys] = useState<string[]>([]);

  const toggle = (
    list: string[],
    set: (v: string[]) => void,
    item: string,
  ) => set(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  return (
    <div className="space-y-8">
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
                "rounded-full px-4 py-2 text-sm transition",
                mood === m
                  ? "bg-rose-deep text-primary-foreground shadow-card"
                  : "bg-rose-soft/40 text-ink hover:bg-rose-soft/70",
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
                  "rounded-full border px-4 py-2 text-sm transition",
                  on
                    ? "border-rose-deep bg-rose-deep text-primary-foreground"
                    : "border-border bg-card hover:border-rose-deep/50",
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
                  "rounded-full border px-4 py-2 text-sm transition",
                  on
                    ? "border-rose-deep bg-rose-deep text-primary-foreground"
                    : "border-border bg-card hover:border-rose-deep/50",
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
          placeholder="Como foi seu dia?"
          className="w-full resize-none rounded-2xl border border-border bg-background/60 p-4 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
        />
      </Card>

      <div className="flex justify-end">
        <button className="rounded-full bg-rose-deep px-6 py-3 text-sm text-primary-foreground shadow-card transition hover:brightness-110 active:scale-[0.99]">
          Salvar check-in
        </button>
      </div>
    </div>
  );
}
