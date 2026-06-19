import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Calendar, Clock, Heart } from "lucide-react";
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
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background">
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24rem] bg-gradient-to-b from-transparent via-rose-soft/20 to-rose-soft/55" />

        <section className="relative z-10 mx-auto mt-6 grid w-full max-w-[1440px] gap-8 px-5 pb-8 pt-8 lg:mt-12 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] lg:items-center lg:gap-10 lg:px-10 lg:pb-4 lg:pt-10">
          <div className="flex max-w-[620px] flex-col justify-center lg:pt-8">
            <img
              src="/logo-amare.png"
              alt="AMARE Ginecologia e Reprodução Humana"
              className="mb-3 h-auto w-64 sm:w-72 lg:w-[22rem]"
            />
            <h1 className="max-w-[620px] font-display text-[clamp(2.45rem,3.35vw,4rem)] leading-[1.05] tracking-[-0.025em] text-ink">
              Sua jornada de <em className="not-italic text-rose-deep">FIV</em>
              <br />
              centralizada em um só lugar
            </h1>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card/75 p-4 shadow-[0_8px_24px_rgba(111,64,59,0.08)] backdrop-blur-sm lg:max-w-[36rem]">
              <img
                src="/retangulo-rosa-notificacao-home.png"
                alt=""
                aria-hidden="true"
                className="h-12 w-auto shrink-0"
              />
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-rose-deep" />
              <p className="text-sm text-ink/80">
                <strong>Paciente nova?</strong> Seu acesso será criado pela equipe após sua primeira consulta.{" "}
                <Link to="/recuperar-senha" className="underline underline-offset-4 hover:text-rose-deep">
                  Esqueceu a senha?
                </Link>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/login"
                search={{ inviteToken: undefined }}
                className="rounded-full bg-rose-deep px-6 py-3 text-sm text-primary-foreground shadow-card transition hover:brightness-110 active:scale-[0.98]"
              >
                Acesse sua conta
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-rose-deep/40 px-6 py-3 text-sm text-ink transition hover:bg-rose-soft/40"
              >
                Marque sua consulta
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end lg:pt-2">
            <div className="absolute inset-y-8 left-[12%] right-0 rounded-[999px] bg-rose-soft/35 blur-3xl" />
            <StakeholdersIllustration className="relative z-10 aspect-[1.28/1] w-full max-w-[820px] translate-x-2 lg:-translate-x-4 lg:w-full" />
          </div>

          <div className="relative z-20 lg:col-span-2 lg:mt-[33px]">
            <div className="mx-auto max-w-[1180px] rounded-[30px] border border-white/70 bg-[#fbf4ea]/95 shadow-[0_20px_60px_rgba(111,64,59,0.12)] ring-1 ring-rose-soft/20 backdrop-blur-sm">
              <ul
                id="como-funciona"
                className="grid overflow-hidden sm:grid-cols-3"
              >
                {featureItems.map(({ icon: Icon, label }, index) => (
                  <li key={label} className="relative flex items-center gap-3 px-5 py-4 sm:px-6 lg:px-8 lg:py-5">
                    {index > 0 ? (
                      <img
                        src="/Line%202.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 hidden h-14 w-auto -translate-y-1/2 sm:block"
                      />
                    ) : null}
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-soft/60 text-rose-deep">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-base text-ink lg:text-[1.05rem]">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-[1440px] px-5 pb-6 pt-2 sm:px-6 lg:px-10">
        <StellaLogo className="ml-auto origin-bottom-right" />
      </footer>
    </div>
  );
}
