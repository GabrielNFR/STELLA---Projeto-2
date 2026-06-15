import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui-bits/PageHeader";
import { AvatarPlaceholder } from "@/components/Avatar3D";
import { useUserProfile } from "@/lib/userProfileContext";
import { buildApiUrl, buildImageUrl } from "@/lib/api";
import {
  ChevronRight,
  FlaskConical,
  HeartPulse,
  LifeBuoy,
  NotebookPen,
  Pill,
  Search,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react"; 

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

interface FaseTratamento {
  id: number;
  nome: string;
  ordem_cronologica: number;
  status: 'concluida' | 'atual' | 'pendente';
  descricao: string;
}

function HomePage() {
  const [fases, setFases] = useState<FaseTratamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrored, setImageErrored] = useState(false);
  const { user, profileImageVersion } = useUserProfile();

  useEffect(() => {
    fetch(buildApiUrl("/api/tratamento/fases/"))
      .then((res) => res.json())
      .then((dados) => {
        setFases(dados);
        setLoading(false);
      });
  }, []);

  const total = fases.length;
  const currentFaseObj = fases.find(f => f.status === 'atual');
  const finished = fases.filter(f => f.status === 'concluida').length;
  const progressPercent = total === 0 ? 0 : Math.round((finished / total) * 100);

  const avatarUrl = buildImageUrl(user?.profile?.foto_perfil, profileImageVersion);
  const showAvatar = Boolean(avatarUrl && !imageErrored);
  const name = user?.first_name || "Helena Albuquerque";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        {showAvatar ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-16 w-16 rounded-full object-cover"
            onError={() => setImageErrored(true)}
          />
        ) : (
          <AvatarPlaceholder name={name} size={64} />
        )}
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
            <div className="font-display text-xl text-ink">
              {loading ? "Carregando..." : currentFaseObj ? currentFaseObj.nome : "Aguardando Protocolo"}
            </div>
          </div>
          <Link
            to="/timeline"
            className="inline-flex items-center gap-1 text-sm text-rose-deep hover:underline"
          >
            Ver jornada <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-rose-soft/40">
          <div className="h-full rounded-full bg-rose-deep transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="mt-2 text-right text-xs text-muted-foreground">
          {progressPercent}% completo
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
                <span className={e.done ? "line-through text-muted-foreground" : "text-ink"}>
                  {e.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
            <h2 className="font-display text-xl text-ink">Acessos rápidos</h2>
            <nav className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {shortcuts.map((s) => (
                <Link
                  key={s.label}
                  to={s.to}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-colors hover:bg-rose-soft/20"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-soft/40 text-rose-deep">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-ink">{s.label}</span>
                </Link>
              ))}
            </nav>
        </div>
      </div>
    </div>
  );
}