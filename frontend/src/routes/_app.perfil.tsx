import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { AvatarPlaceholder } from "@/components/Avatar3D";
import { Mail, Phone, MapPin, Cake, Heart, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/_app/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — STELLA" }] }),
  component: Perfil,
});

function Perfil() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Meu perfil"
        title="Helena Albuquerque"
        description="Gerencie suas informações e preferências"
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center text-center">
          <AvatarPlaceholder name="Helena Albuquerque" size={120} />
          <div className="mt-4 font-display text-xl">Helena Albuquerque</div>
          <div className="text-sm text-muted-foreground">Paciente desde 02/2024</div>
          <button className="mt-4 rounded-full border border-rose-deep/40 px-4 py-2 text-sm text-rose-deep hover:bg-rose-soft/40">
            Editar foto
          </button>
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg">Dados pessoais</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Info icon={Mail} label="E-mail" value="helenaalbuquerque@gmail.com" />
            <Info icon={Phone} label="Telefone" value="(81) 98765-4321" />
            <Info icon={Cake} label="Nascimento" value="12/04/1990 (34 anos)" />
            <Info icon={MapPin} label="Cidade" value="Recife, PE" />
          </dl>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-display text-lg">Informações do tratamento</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Info icon={Stethoscope} label="Médica responsável" value="Dra. Adriana Lima" />
          <Info icon={Heart} label="Protocolo" value="FIV — ciclo 1" />
          <Info icon={Cake} label="Início" value="01/03/2024" />
        </div>
      </Card>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-rose-soft/60 text-rose-deep">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="text-sm text-ink">{value}</dd>
      </div>
    </div>
  );
}
