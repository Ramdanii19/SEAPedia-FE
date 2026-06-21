"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Role } from "@/lib/enums";
import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/common.types";

// TODO: pindah ke features/auth/types di Branch 1
export type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
};

type AuthContextValue = {
  user: User | null;
  activeRole: Role | null;
  isLoading: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  setActiveRole: (role: Role) => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const res = await apiClient.get<ApiResponse<User>>("/api/auth/me");
      setUser(res.data);
    } catch {
      clearSession();
    }
  }, []);

  function setSession(user: User, token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setActiveRole(null);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshMe().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        isLoading,
        setSession,
        clearSession,
        setActiveRole,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
