import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Calendar, Clock, Heart, MessageCircle } from "lucide-react";
import { StellaLogo } from "@/components/brand/StellaLogo";
import { StakeholdersIllustration } from "@/components/brand/StakeholdersIllustration";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AMARE × STELLA — Sua jornada de FIV centralizada" },
      {
        name: "description",
        content:
          "Plataforma da Clínica AMARE para acompanhamento de FIV: medicações, agenda, exames e bem-estar em um só lugar.",
      },
      { property: "og:title", content: "AMARE × STELLA — Sua jornada de FIV" },
      {
        property: "og:description",
        content: "Centralize medicações, consultas, exames e estado emocional.",
      },
    ],
  }),
  component: Landing,
});

const WHATSAPP_URL =
  "https://wa.me/558130000000?text=Ol%C3%A1%2C+gostaria+de+marcar+uma+consulta+na+Cl%C3%ADnica+AMARE.";

function Landing() {
  const featureItems = [
    { icon: Clock, label: "Gerencie horários de medicações" },
    { icon: Calendar, label: "Centralize agenda de consultas e exames" },
    { icon: Heart, label: "Registre seu estado físico e emocional" },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <header className="flex w-full items-center justify-end px-5 py-5 lg:px-10">
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            search={{ inviteToken: undefined }}
            className="rounded-full border border-rose-deep/30 px-4 py-2 text-sm text-ink transition hover:bg-rose-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
          >
            Acesse sua conta
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Marque sua consulta</span>
            <span className="sm:hidden">Consulta</span>
          </a>
        </nav>
      </header>

      <section className="grid w-full flex-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,44vw)_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-x-0 lg:gap-y-6 lg:px-0 lg:pb-0 lg:pt-4">
        <div className="flex max-w-2xl flex-col justify-center lg:pl-10">
          <img src="/logo-amare.png" alt="AMARE Ginecologia e Reprodução Humana" className="mb-6 h-auto w-64 sm:w-80 lg:w-[26rem]" />
          <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            Sua jornada de <em className="not-italic text-rose-deep">FIV</em>{" "}
            centralizada em um só lugar
          </h1>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-card/70 p-4">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-rose-deep" />
            <p className="text-sm text-ink/80">
              <strong>Paciente nova?</strong> Seu acesso será criado pela equipe
              após sua primeira consulta.{" "}
              <Link to="/recuperar-senha" className="underline underline-offset-4 hover:text-rose-deep">
                Esqueceu a senha?
              </Link>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/login"
              search={{ inviteToken: undefined }}
              className="rounded-full bg-rose-deep px-6 py-3 text-sm text-primary-foreground shadow-card transition hover:brightness-110 active:scale-[0.98]"
            >
              Acesse sua conta
            </Link>
            <a
              href="#como-funciona"
              className="rounded-full border border-rose-deep/40 px-6 py-3 text-sm text-ink transition hover:bg-rose-soft/40"
            >
              Como funciona
            </a>
          </div>
        </div>

        <div className="relative flex items-center lg:justify-end lg:overflow-hidden">
          <StakeholdersIllustration className="aspect-[4/5] w-full max-w-lg ml-0 mr-auto lg:mr-0 lg:ml-auto lg:h-[min(64vh,620px)] lg:w-auto lg:max-w-none" />
        </div>

        <ul
          id="como-funciona"
          className="flex w-full items-center gap-4 overflow-x-auto whitespace-nowrap border-y border-rose-soft/70 bg-card/50 px-5 py-3 lg:col-span-2 lg:px-10 xl:justify-center"
        >
          {featureItems.map(({ icon: Icon, label }, index) => (
            <li key={label} className="flex shrink-0 items-center gap-4">
              {index > 0 ? (
                <img src="/Line%202.png" alt="" aria-hidden="true" className="h-9 w-auto shrink-0 opacity-75" />
              ) : null}
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-soft/60 text-rose-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm text-ink sm:text-base">{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-auto flex w-full items-center justify-end px-5 pb-6 pt-2 lg:px-10">
        <StellaLogo />
      </footer>
    </div>
  );
}
