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
import { SESSION_KEYS, clearStorageSession, getToken, getActiveRole } from "@/lib/session";

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
  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>("/auth/me");
      setUser(res.data?.user ?? res.data);
      if (res.data?.activeRole) {
        setActiveRoleState(res.data.activeRole as Role);
        localStorage.setItem(SESSION_KEYS.ACTIVE_ROLE, res.data.activeRole);
      }
    } catch {
      clearSession();
    }
  }, []);

  function setSession(user: User, token: string) {
    localStorage.setItem(SESSION_KEYS.TOKEN, token);
    localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
    setUser(user);
  }

  function setActiveRole(role: Role) {
    setActiveRoleState(role);
    localStorage.setItem(SESSION_KEYS.ACTIVE_ROLE, role);
  }

  function clearSession() {
    clearStorageSession();
    setUser(null);
    setActiveRoleState(null);
  }

  useEffect(() => {
    const token = getToken();
    if (token) {
      const savedRole = getActiveRole() as Role | null;
      if (savedRole) setActiveRoleState(savedRole);
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
