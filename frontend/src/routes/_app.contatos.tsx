import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Phone, MapPin, Mail } from "lucide-react";

export const Route = createFileRoute("/_app/contatos")({
  head: () => ({ meta: [{ title: "Contatos úteis — STELLA" }] }),
  component: Page,
});

const contacts = [
  { name: "Clínica AMARE — Recepção", phone: "(81) 3000-0000", email: "contato@amare.com.br", address: "Recife, PE" },
  { name: "Enfermagem AMARE", phone: "(81) 98765-0000", email: "enfermagem@amare.com.br" },
  { name: "Dra. Adriana Lima", phone: "(81) 98765-0001", email: "dra.adriana@amare.com.br" },
  { name: "Laboratório parceiro — Sabin", phone: "(81) 3000-1111", address: "Boa Viagem, Recife" },
  { name: "Farmácia de manipulação", phone: "(81) 3000-2222", address: "Casa Forte, Recife" },
];

function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Rede de apoio"
        title="Contatos úteis"
        description="Telefones e endereços importantes para o seu tratamento."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((c) => (
          <Card key={c.name}>
            <h3 className="font-display text-lg">{c.name}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {c.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-rose-deep" />
                  <a href={`tel:${c.phone.replace(/\D/g, "")}`} className="hover:underline">
                    {c.phone}
                  </a>
                </li>
              )}
              {c.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-rose-deep" />
                  <a href={`mailto:${c.email}`} className="hover:underline">
                    {c.email}
                  </a>
                </li>
              )}
              {c.address && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-deep" />
                  {c.address}
                </li>
              )}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
