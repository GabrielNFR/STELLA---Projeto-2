import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/ui-bits/PageHeader";
import { AvatarPlaceholder } from "@/components/Avatar3D";
import { Mail, Phone, MapPin, Cake, Heart, Stethoscope, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL = "http://localhost:8000";

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: {
    foto_perfil?: string;
    telefone?: string;
    data_nascimento?: string;
    cidade?: string;
    medica_responsavel?: string;
    protocolo?: string;
    data_inicio_tratamento?: string;
  };
}

export const Route = createFileRoute("/_app/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — STELLA" }] }),
  component: Perfil,
});

function Perfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate({ to: "/login" });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/perfil/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        navigate({ to: "/login" });
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar perfil");
      }

      const data = await response.json();
      setUserData(data);
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar perfil");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate({ to: "/login" });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsSaving(true);
    const formDataToSend = new FormData();
    formDataToSend.append("foto_perfil", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/perfil/foto/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar foto");
      }

      const updatedProfile = await response.json();
      if (userData) {
        setUserData({
          ...userData,
          profile: {
            ...userData.profile,
            foto_perfil: updatedProfile.foto_perfil,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar foto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/perfil/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          telefone: formData.profile?.telefone,
          data_nascimento: formData.profile?.data_nascimento,
          cidade: formData.profile?.cidade,
          medica_responsavel: formData.profile?.medica_responsavel,
          protocolo: formData.profile?.protocolo,
          data_inicio_tratamento: formData.profile?.data_inicio_tratamento,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar perfil");
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setFormData(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData) {
    return <div>Carregando...</div>;
  }

  const displayName = userData.first_name || userData.username;
  const fotoUrl = userData.profile?.foto_perfil
    ? `${API_BASE_URL}${userData.profile.foto_perfil}`
    : undefined;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Meu perfil"
        title={displayName}
        description="Gerencie suas informações e preferências"
      />

      {error && <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center text-center">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={displayName}
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <AvatarPlaceholder name={displayName} size={120} />
          )}
          <div className="mt-4 font-display text-xl">{displayName}</div>
          <div className="text-sm text-muted-foreground">
            Membro desde {new Date().toLocaleDateString("pt-BR")}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="mt-4 rounded-full border border-[#C17E81] bg-[#C17E81] px-4 py-2 text-sm text-white transition hover:bg-[#A15663] disabled:opacity-50"
          >
            {isSaving ? "Enviando..." : "Mudar foto"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg">Dados pessoais</h3>
            <button
              onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
              className="rounded-full border border-rose-deep/40 px-4 py-2 text-sm text-rose-deep hover:bg-rose-soft/40"
            >
              {isEditing ? "Cancelar" : "Editar"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase text-muted-foreground">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.first_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-muted-foreground">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={formData.last_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-muted-foreground">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-muted-foreground">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.profile?.telefone || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, telefone: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-muted-foreground">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formData.profile?.data_nascimento || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, data_nascimento: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-muted-foreground">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.profile?.cidade || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, cidade: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full rounded-full bg-[#F3DBDB] px-6 py-3 text-sm text-ink transition hover:bg-[#D3B1AF] active:bg-[#C17E81] active:text-primary-foreground disabled:opacity-50"
              >
                {isSaving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2">
              <Info icon={Mail} label="E-mail" value={formData.email || "—"} />
              <Info
                icon={Phone}
                label="Telefone"
                value={formData.profile?.telefone || "—"}
              />
              <Info
                icon={Cake}
                label="Nascimento"
                value={formData.profile?.data_nascimento || "—"}
              />
              <Info icon={MapPin} label="Cidade" value={formData.profile?.cidade || "—"} />
            </dl>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-display text-lg">Informações do tratamento</h3>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase text-muted-foreground">
                Médica Responsável
              </label>
              <input
                type="text"
                value={formData.profile?.medica_responsavel || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, medica_responsavel: e.target.value },
                  })
                }
                className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase text-muted-foreground">
                Protocolo
              </label>
              <input
                type="text"
                value={formData.profile?.protocolo || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, protocolo: e.target.value },
                  })
                }
                className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase text-muted-foreground">
                Data de Início
              </label>
              <input
                type="date"
                value={formData.profile?.data_inicio_tratamento || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, data_inicio_tratamento: e.target.value },
                  })
                }
                className="mt-1 w-full rounded border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/30"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Info
              icon={Stethoscope}
              label="Médica responsável"
              value={formData.profile?.medica_responsavel || "—"}
            />
            <Info icon={Heart} label="Protocolo" value={formData.profile?.protocolo || "—"} />
            <Info
              icon={Cake}
              label="Início"
              value={formData.profile?.data_inicio_tratamento || "—"}
            />
          </div>
        )}
      </Card>

      <Card>
        <button
          onClick={handleLogout}
          className="w-full rounded-full bg-[#C17E81] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#A15663] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
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
