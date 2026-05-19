import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { AvatarPlaceholder } from "@/components/Avatar3D";
import {
  Calendar,
  ChevronRight,
  FlaskConical,
  HeartPulse,
  LifeBuoy,
  NotebookPen,
  Pill,
  Search,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/_app/home")({
  head: () => ({ meta: [{ title: "Home — STELLA" }] }),
  component: HomePage,
});

const events = [
  { time: "8h", label: "Medicação X", done: true },
  { time: "8h30", label: "Medicação Y", done: false },
  { time: "14h", label: "Ultrassom", done: false },
  { time: "16h30", label: "Consulta Dra Adriana", done: false },
];

const shortcuts = [
  { to: "/exames", label: "Hub de exames", icon: FlaskConical },
  { to: "/medicacoes", label: "Necessaire de medicações", icon: Pill },
  { to: "/videoteca", label: "Videoteca", icon: Video },
  { to: "/notas", label: "Bloco de notas", icon: NotebookPen },
  { to: "/help", label: "Help!", icon: LifeBuoy },
  { to: "/como-estou-hoje", label: "Como estou hoje?", icon: HeartPulse },
] as const;

function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <AvatarPlaceholder name="Helena Albuquerque" size={64} />
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-ink">Oi, Helena!</h1>
          <p className="text-sm text-muted-foreground">
            Aqui está um resumo da sua jornada durante o tratamento.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-card">
        <Search className="h-4 w-4" />
        <input
          placeholder="Buscar medicações, exames, consultas…"
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-rose-deep">
              Fase atual
            </div>
            <div className="font-display text-xl text-ink">Estimulação ovariana</div>
          </div>
          <Link
            to="/timeline"
            className="inline-flex items-center gap-1 text-sm text-rose-deep hover:underline"
          >
            Ver jornada <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-rose-soft/40">
          <div className="h-full w-[10%] rounded-full bg-rose-deep" />
        </div>
        <div className="mt-2 text-right text-xs text-muted-foreground">
          10% completo
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Próximos eventos e lembretes</h2>
            <Link to="/calendario" className="text-sm text-rose-deep hover:underline">
              Calendário
            </Link>
          </div>
          <ul className="space-y-2">
            {events.map((e) => (
              <li
                key={e.label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={e.done}
                  className="h-4 w-4 accent-rose-deep"
                />
                <span className="font-display text-rose-deep w-14">{e.time}</span>
                <span className={e.done ? "line-through text-muted-foreground" : ""}>
                  {e.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">March 2024</h2>
            <Calendar className="h-5 w-5 text-rose-deep" />
          </div>
          <MiniCalendar />
        </Card>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl text-ink">Atalhos</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {shortcuts.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-soft/60 text-rose-deep group-hover:bg-rose-deep group-hover:text-primary-foreground transition">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-ink">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCalendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const grid = [
    [30, 31, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 1, 2, 3],
  ];
  const today = 12;
  const eventDays = new Set([5, 12, 18, 23]);
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {days.map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
        {grid.flat().map((n, i) => {
          const inMonth = (i >= 2 && i < 33);
          const isToday = inMonth && n === today;
          const hasEvent = inMonth && eventDays.has(n);
          return (
            <button
              key={i}
              className={[
                "aspect-square rounded-full transition",
                !inMonth ? "text-muted-foreground/40" : "text-ink hover:bg-rose-soft/40",
                isToday ? "bg-rose-deep text-primary-foreground hover:bg-rose-deep" : "",
              ].join(" ")}
            >
              <span className="relative">
                {n}
                {hasEvent && !isToday && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-rose-deep" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { PageHeader };
