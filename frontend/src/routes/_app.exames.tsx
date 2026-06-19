import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { Modal, fieldClass, labelClass, submitBtnClass } from "@/components/ui-bits/Modal";
import { Upload, FileText, Download } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/_app/exames")({
  head: () => ({ meta: [{ title: "Hub de exames — STELLA" }] }),
  component: Page,
});

type Exam = { name: string; date: string; source: string; tag: string; fileUrl?: string };

const initial: Exam[] = [
  { name: "Ultrassom transvaginal", date: "08/03/2024", source: "Clínica AMARE", tag: "Imagem" },
  { name: "Hormônio FSH", date: "05/03/2024", source: "Lab. Sabin", tag: "Sangue" },
  { name: "Hormônio LH", date: "05/03/2024", source: "Lab. Sabin", tag: "Sangue" },
  { name: "Estradiol", date: "05/03/2024", source: "Lab. Sabin", tag: "Sangue" },
  { name: "Ultrassom prévio", date: "20/02/2024", source: "Paciente", tag: "Imagem" },
];

function Page() {
  const [exams, setExams] = useState<Exam[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    date: string;
    source: string;
    tag: string;
    file: File | null;
  }>({
    name: "",
    date: "",
    source: "",
    tag: "Sangue",
    file: null,
  });

  const downloadExam = async (exam: Exam) => {
    if (!exam.fileUrl) return;

    try {
      const response = await fetch(exam.fileUrl);
      if (!response.ok) throw new Error("Falha ao baixar o arquivo");
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const defaultName = `${exam.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      const fileNameFromUrl = exam.fileUrl.split("/").pop()?.split("?")[0];
      link.download = fileNameFromUrl || defaultName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      window.alert("Não foi possível baixar o exame. Verifique a conexão ou o link do arquivo.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.file) return;

    const date = form.date
      ? form.date.split("-").reverse().join("/")
      : new Date().toLocaleDateString("pt-BR");

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("date", date);
    formData.append("source", form.source.trim() || "Paciente");
    formData.append("tag", form.tag);
    formData.append("file", form.file);

    let fileUrl: string | undefined;
    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/exames/`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        fileUrl = result.fileUrl ?? result.file ?? undefined;
      } else {
        console.warn("Upload de exame falhou, usando pré-visualização local", response.status);
      }
    } catch (error) {
      console.warn("Erro no upload do exame:", error);
    }

    setExams([
      {
        name: form.name.trim(),
        date,
        source: form.source.trim() || "Paciente",
        tag: form.tag,
        fileUrl: fileUrl ?? URL.createObjectURL(form.file),
      },
      ...exams,
    ]);

    setForm({ name: "", date: "", source: "", tag: "Sangue", file: null });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Exames"
        title="Hub de exames"
        description="Anexe, catalogue e guarde seus exames em um só lugar."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-4 py-2 text-sm text-primary-foreground shadow-card hover:brightness-110"
          >
            <Upload className="h-4 w-4" /> Anexar exame
          </button>
        }
      />
      <div className="grid gap-3">
        {exams.map((exam, index) => (
          <Card key={index} className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft/60 text-rose-deep">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-display text-lg">{exam.name}</h3>
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs">{exam.tag}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {exam.date} · {exam.source}
              </div>
            </div>
            <button
              type="button"
              onClick={() => exam.fileUrl && downloadExam(exam)}
              disabled={!exam.fileUrl}
              className={`inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm transition ${
                exam.fileUrl ? "hover:bg-rose-soft/40" : "cursor-not-allowed opacity-50"
              }`}
            >
              <Download className="h-4 w-4" /> Baixar
            </button>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Anexar exame">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Nome do exame</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={fieldClass}
              placeholder="Ex: Beta-hCG"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Data</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={fieldClass}
              >
                <option>Sangue</option>
                <option>Imagem</option>
                <option>Genético</option>
                <option>Outro</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Origem</label>
            <input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className={fieldClass}
              placeholder="Ex: Lab. Sabin"
            />
          </div>
          <div>
            <label className={labelClass}>Arquivo PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setForm({ ...form, file: e.currentTarget.files?.[0] ?? null })}
              className={fieldClass}
            />
          </div>
          <button type="submit" className={submitBtnClass}>
            Salvar exame
          </button>
        </form>
      </Modal>
    </div>
  );
}
