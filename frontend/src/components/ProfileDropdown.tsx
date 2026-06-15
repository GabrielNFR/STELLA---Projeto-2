import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { User, Camera, LogOut } from "lucide-react";
import { AvatarPlaceholder } from "@/components/Avatar3D";
import { useUserProfile } from "@/lib/userProfileContext";
import { buildApiUrl, buildImageUrl } from "@/lib/api";

interface ProfileDropdownProps {
  userName?: string;
  size?: number;
}

export function ProfileDropdown({ userName = "Helena Albuquerque", size = 36 }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [imageErrored, setImageErrored] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, profileImageVersion, updateProfilePhoto, logout } = useUserProfile();

  useEffect(() => {
    setImageErrored(false);
  }, [user?.profile?.foto_perfil, profileImageVersion]);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("foto_perfil", file);

    try {
      const response = await fetch(buildApiUrl("/api/tratamento/perfil/foto/"), {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar foto de perfil.");
      }

      const updatedProfile = await response.json();
      updateProfilePhoto(updatedProfile.foto_perfil);
      setIsOpen(false);
    } catch (err) {
      console.error("Erro ao atualizar foto:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", search: { inviteToken: undefined } });
  };

  const displayName = user?.first_name || userName;
  const fotoUrl = buildImageUrl(user?.profile?.foto_perfil, profileImageVersion);
  const showImage = Boolean(fotoUrl && !imageErrored);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition hover:opacity-80"
        aria-label="Menu de perfil"
      >
        {showImage ? (
          <img
            src={fotoUrl}
            alt={displayName}
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
            onError={() => setImageErrored(true)}
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
            {showImage ? (
              <img
                src={fotoUrl}
                alt={displayName}
                className="h-12 w-12 rounded-full object-cover"
                onError={() => setImageErrored(true)}
              />
            ) : (
              <AvatarPlaceholder name={displayName} size={48} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
            </div>
          </div>

          {/* Dropdown Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-ink transition hover:bg-rose-soft/30 active:bg-rose-soft/50"
            >
              <Camera className="h-4 w-4" />
              <span>Mudar foto de perfil</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate({ to: "/perfil" });
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-ink transition hover:bg-rose-soft/30 active:bg-rose-soft/50"
            >
              <User className="h-4 w-4" />
              <span>Meu perfil</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white bg-[#C17E81] transition hover:bg-[#A15663] active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair da conta</span>
            </button>
          </div>

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
