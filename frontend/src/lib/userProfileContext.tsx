import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { buildApiUrl } from "./api";

export interface UserProfileData {
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

interface UserProfileContextValue {
  user: UserProfileData | null;
  loading: boolean;
  error: string | null;
  profileImageVersion: number;
  refreshUser: () => Promise<void>;
  setUser: (user: UserProfileData | null) => void;
  updateProfilePhoto: (foto_perfil: string) => void;
  logout: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserInternal] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImageVersion, setProfileImageVersion] = useState<number>(Date.now());

  const setUser = useCallback((nextUser: UserProfileData | null) => {
    setUserInternal(nextUser);
    if (nextUser) {
      localStorage.setItem("authUser", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(buildApiUrl("/api/tratamento/perfil/"), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setUser(null);
        setError("Sessão expirada. Faça login novamente.");
        return;
      }

      if (!response.ok) {
        throw new Error("Não foi possível carregar o perfil.");
      }

      const data = (await response.json()) as UserProfileData;
      setUser(data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : "Erro ao carregar o perfil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const updateProfilePhoto = useCallback((foto_perfil: string) => {
    setUserInternal((currentUser) => {
      if (!currentUser) return null;
      const updated = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          foto_perfil,
        },
      };
      localStorage.setItem("authUser", JSON.stringify(updated));
      return updated;
    });
    setProfileImageVersion(Date.now());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }, [setUser]);

  return (
    <UserProfileContext.Provider
      value={{
        user,
        loading,
        error,
        profileImageVersion,
        refreshUser,
        setUser,
        updateProfilePhoto,
        logout,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }

  return context;
}
