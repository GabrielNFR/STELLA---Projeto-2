import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Modal, fieldClass, labelClass, submitBtnClass } from "@/components/ui-bits/Modal";
import { Pill, Plus, Clock } from "lucide-react";
import {useQuery,useMutation,useQueryClient,} from "@tanstack/react-query";


export const Route = createFileRoute("/_app/medicacoes")({
  head: () => ({ meta: [{ title: "Necessaire de medicações — STELLA" }] }),
  component: Page,
});

type Med = { id:number; nome: string; dose: string; horarios: string[]; data_inicio: string; data_fim: string | null };




function Page() {
  const [open, setOpen] = useState(false);
  //const [alertados, setAlertados] =useState<string[]>([]);
  const [form, setForm] = useState({ nome: "", dose: "", horarios: "", data_inicio: "", data_fim: "" });
  const queryClient = useQueryClient();
  const {data: meds = [],isLoading,isError,} = useQuery<Med[]>({queryKey: ["medicacoes"],queryFn: fetchMedicacoes,});
  const createMedicacaoMutation = useMutation({mutationFn: createMedicacao,onSuccess: () => {queryClient.invalidateQueries({queryKey: ["medicacoes"],});
    setOpen(false);

    setForm({
      nome: "",
      dose: "",
      horarios: "",
      data_inicio: "",
      data_fim: "",
    });
  },
  });
  const deleteMedicacaoMutation = useMutation({mutationFn: deleteMedicacao,onSuccess: () => {queryClient.invalidateQueries({queryKey:["medicacoes"],});},});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    const times = form.horarios
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    createMedicacaoMutation.mutate({

      nome: form.nome,
      dose: form.dose,

      data_inicio: form.data_inicio,

      data_fim: form.data_fim || null,

      horarios: times,
  });
    setForm({ nome: "", dose: "", horarios: "", data_inicio: "", data_fim: "" });
    setOpen(false);
  };
  
  //useEffect(() => {
  //verificarMedicacoes();

 // const interval = setInterval(() => {
    //verificarMedicacoes();
  //}, 60000);

  //return () => clearInterval(interval);
//}, [meds, alertados]);

  if (isLoading) {
  return <div>Carregando medicações...</div>;
  }

  if (isError) {
  return <div>Erro ao carregar medicações.</div>;
  }


  //function verificarMedicacoes() {
  //const agora = new Date();

  //const hoje =
    //agora.toISOString().split("T")[0];

  //const horaAtual =
    //agora.getHours().toString().padStart(2, "0") +
    //":" +
    //agora.getMinutes().toString().padStart(2, "0");

  //meds.forEach((med) => {
    //const chave = `${med.id}-${horaAtual}`;

    //const dentroDoPeriodo =
      //hoje >= med.data_inicio &&
      //(
        //!med.data_fim ||
       // hoje <= med.data_fim
     // );

    //if (
      //dentroDoPeriodo &&
      //med.horarios.includes(horaAtual) &&
      //!alertados.includes(chave)
    //) {
      //alert(
       // `Hora de tomar ${med.nome} (${med.dose})`
      //);

      //setAlertados((prev) => [
       // ...prev,
       // chave,
      //]);
    //}
  //});
//}

  return (
    <div>
      <PageHeader
        eyebrow="Receitas"
        title="Necessaire de medicações"
        description="Organize cronologicamente todas as suas receitas e horários."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Nova medicação
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {meds.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start gap-3">

              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft/60 text-rose-deep">
                <Pill className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg">{m.nome}</h3>
                <p className="text-xs text-muted-foreground">
                  {m.dose} · {m.data_inicio} → {m.data_fim}
                </p>
              </div>
             <button
                onClick={() => {
                  if (confirm(`Remover ${m.nome}?`)) {
                    deleteMedicacaoMutation.mutate(m.id);
                    }
                  }}
                  className="rounded-lg border px-2 py-1 text-xs"
                  >
                    Remover
            </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {m.horarios.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-ink ring-1 ring-border"
                >
                  <Clock className="h-3 w-3 text-rose-deep" /> {t}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nova medicação">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Medicação</label>
            <input
              autoFocus
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className={fieldClass}
              placeholder="Ex: Gonal-F 450 UI"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Dose</label>
              <input
                value={form.dose}
                onChange={(e) => setForm({ ...form, dose: e.target.value })}
                className={fieldClass}
                placeholder="150 UI"
              />
            </div>
            <div>
              <label className={labelClass}>Horários (separe por vírgula)</label>
              <input
                value={form.horarios}
                onChange={(e) => setForm({ ...form, horarios: e.target.value })}
                className={fieldClass}
                placeholder="08:00, 20:00"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Início</label>
              <input
                type="date"
                value={form.data_inicio}
                onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                className={fieldClass}
                placeholder="01/03"
              />
            </div>
            <div>
              <label className={labelClass}>Fim</label>
              <input
                type="date"
                value={form.data_fim}
                onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
                className={fieldClass}
                placeholder="12/03"
              />
            </div>
          </div>
          <button type="submit" className={submitBtnClass}>Salvar medicação</button>
        </form>
      </Modal>
    </div>
  );
}


const API_URL = "http://127.0.0.1:8000/api/tratamento/medicacoes/";

async function fetchMedicacoes() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as medicações.");
  }

  return response.json();
}

async function createMedicacao(payload: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar a medicação.");
  }

  return response.json();
}

async function deleteMedicacao(id: number) {
  const response = await fetch(
    `${API_URL}${id}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível remover a medicação."
    );
  }
}
