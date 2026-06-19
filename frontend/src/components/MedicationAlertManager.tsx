import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api";

type Med = { id:number; nome: string; dose: string; horarios: string[]; data_inicio: string; data_fim: string | null };

const API_URL = buildApiUrl("/api/tratamento/medicacoes/");

async function fetchMedicacoes() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as medicações.");
  }

  return response.json();
}

export function MedicationAlertManager() {
  const [alertados, setAlertados] =
    useState<string[]>([]);

  const { data: meds = [] } =
    useQuery<Med[]>({
      queryKey: ["medicacoes"],
      queryFn: fetchMedicacoes,
    });

 useEffect(() => {
  verificarMedicacoes();

  const interval = setInterval(() => {
    verificarMedicacoes();
  }, 60000);

  return () => clearInterval(interval);
}, [meds, alertados]);


  function verificarMedicacoes() {
  const agora = new Date();

  const hoje =
    agora.toISOString().split("T")[0];

  const horaAtual =
    agora.getHours().toString().padStart(2, "0") +
    ":" +
    agora.getMinutes().toString().padStart(2, "0");

  meds.forEach((med) => {
    const chave = `${med.id}-${horaAtual}`;

    const dentroDoPeriodo =
      hoje >= med.data_inicio &&
      (
        !med.data_fim ||
        hoje <= med.data_fim
      );

    if (
      dentroDoPeriodo &&
      med.horarios.includes(horaAtual) &&
      !alertados.includes(chave)
    ) {
      alert(
        `Hora de tomar ${med.nome} (${med.dose})`
      );

      setAlertados((prev) => [
        ...prev,
        chave,
      ]);
    }
  });
}


return null;
}