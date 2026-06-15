import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { User, Camera, LogOut } from "lucide-react";
import { AvatarPlaceholder } from "@/components/Avatar3D";

const API_BASE_URL = "http://localhost:8000";

interface ProfileDropdownProps {
  userName?: string;
  size?: number;
}

export function ProfileDropdown({ userName = "Helena Albuquerque", size = 36 }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const loadUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/perfil/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("foto_perfil", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tratamento/perfil/foto/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        loadUserData();
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Erro ao atualizar foto:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate({ to: "/login" });
  };

  const fotoUrl = userData?.profile?.foto_perfil
    ? `${API_BASE_URL}${userData.profile.foto_perfil}`
    : undefined;
  const displayName = userData?.first_name || userName;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition hover:opacity-80"
        aria-label="Menu de perfil"
      >
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt={displayName}
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
          />
        ) : (
          <AvatarPlaceholder name={displayName} size={size} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card p-4 shadow-soft animate-in fade-in slide-in-from-top-2 z-50">
          {/* User Info */}
          <div className="mb-4 flex items-center gap-3 pb-4 border-b border-border">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={displayName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <AvatarPlaceholder name={displayName} size={48} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{userData?.email || ""}</p>
            </div>
          </div>

          {/* Dropdown Buttons */}
          <div className="space-y-2">
            {/* Change Photo Button */}
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-ink transition hover:bg-rose-soft/30 active:bg-rose-soft/50"
            >
              <Camera className="h-4 w-4" />
              <span>Mudar foto de perfil</span>
            </button>

            {/* My Profile Button */}
            <button
              onClick={() => {
                navigate({ to: "/perfil" });
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-ink transition hover:bg-rose-soft/30 active:bg-rose-soft/50"
            >
              <User className="h-4 w-4" />
              <span>Meu perfil</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white bg-[#C17E81] transition hover:bg-[#A15663] active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair da conta</span>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
