import { useState } from "react";
import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import {
  Home,
  User,
  Map as MapIcon,
  HeartPulse,
  CalendarDays,
  FlaskConical,
  Pill,
  Eye,
  NotebookPen,
  Video,
  LifeBuoy,
  Phone,
  Menu,
  X,
  Search,
  Bell,
} from "lucide-react";
import { AmareLogo } from "@/components/brand/AmareLogo";
import { StellaLogo } from "@/components/brand/StellaLogo";
import { MedicationAlertManager }from "@/components/MedicationAlertManager";
import { ProfileDropdown } from "@/components/ProfileDropdown";

export const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/perfil", label: "Meu perfil", icon: User },
  { to: "/timeline", label: "Timeline", icon: MapIcon },
  { to: "/como-estou-hoje", label: "Como estou hoje?", icon: HeartPulse },
  { to: "/calendario", label: "Calendário inteligente", icon: CalendarDays },
  { to: "/exames", label: "Hub de exames", icon: FlaskConical },
  { to: "/medicacoes", label: "Necessaire de medicações", icon: Pill },
  { to: "/copiloto", label: "Modo Copiloto", icon: Eye },
  { to: "/notas", label: "Bloco de notas", icon: NotebookPen },
  { to: "/videoteca", label: "Videoteca", icon: Video },
  { to: "/help", label: "Help!", icon: LifeBuoy },
  { to: "/contatos", label: "Contatos úteis", icon: Phone },
] as const;

const bottomNavItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/calendario", label: "Agenda", icon: CalendarDays },
  { to: "/como-estou-hoje", label: "Hoje", icon: HeartPulse },
  { to: "/timeline", label: "Timeline", icon: MapIcon },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

function SidebarLink({ to, label, Icon }: { to: string; label: string; Icon: typeof Home }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = path === to;
  return (
    <Link
      to={to}
      className={[
        "group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm transition-all",
        "hover:bg-rose-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-rose-deep text-primary-foreground shadow-card"
          : "text-ink/80",
      ].join(" ")}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "" : "text-rose-deep"}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div id="app-shell-root" className="flex min-h-screen w-full bg-background app-shell-root">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-72 shrink-0 flex-col border-r border-border bg-sidebar backdrop-blur app-shell-sidebar">
        <div className="px-5 pt-6 pb-4">
          <AmareLogo />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-1">
            {navItems.map((it) => (
              <SidebarLink key={it.to} to={it.to} label={it.label} Icon={it.icon} />
            ))}
          </div>
        </nav>
        <div className="border-t border-border px-5 py-4">
          <StellaLogo />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar p-4 shadow-soft animate-in slide-in-from-left app-shell-mobile-drawer">
            <div className="flex items-center justify-between pb-4">
              <AmareLogo />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 hover:bg-rose-soft/50"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1" onClick={() => setMobileOpen(false)}>
              {navItems.map((it) => (
                <SidebarLink key={it.to} to={it.to} label={it.label} Icon={it.icon} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MedicationAlertManager />
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 hover:bg-rose-soft/50 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <AmareLogo tagline={false} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground w-72">
              <Search className="h-4 w-4" />
              <input
                placeholder="Buscar medicações, exames…"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Link
              to="/notificacoes"
              className="relative rounded-full p-2 hover:bg-rose-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-deep" />
            </Link>
            <ProfileDropdown userName="Helena Albuquerque" size={36} />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-10 lg:py-10 pb-24 lg:pb-10 app-shell-main-content">
          <Outlet />
        </main>

        {/* Bottom nav — mobile */}
        <nav className="fixed bottom-3 left-3 right-3 z-40 lg:hidden">
          <div className="flex items-center justify-around rounded-3xl border border-border bg-card/95 px-2 py-2 shadow-soft backdrop-blur">
            {bottomNavItems.map(({ to, label, icon: Icon }) => (
              <BottomLink key={to} to={to} label={label} Icon={Icon} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function BottomLink({ to, label, Icon }: { to: string; label: string; Icon: typeof Home }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = path === to;
  return (
    <Link
      to={to}
      className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] transition-colors ${
        active ? "text-rose-deep" : "text-ink/60 hover:text-ink"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "stroke-[2.4]" : ""}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}
