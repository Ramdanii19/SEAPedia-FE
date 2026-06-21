"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/features/auth/service/auth.service";

export function useLogout() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // Tetap lanjutkan logout meski request gagal
    } finally {
      clearSession();
      router.push("/");
    }
  }

  return { logout, isLoggingOut };
}
