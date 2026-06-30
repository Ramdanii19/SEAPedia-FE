"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { roleHome } from "@/utils/roleHome";

export function BuyerOrGuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, activeRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !user || !activeRole) return;

    // SELLER dan DRIVER tidak boleh akses halaman katalog/belanja
    if (activeRole === "SELLER" || activeRole === "DRIVER") {
      router.replace(roleHome(activeRole as any));
    }
  }, [isLoading, user, activeRole, router]);

  // Sedang loading — tunggu
  if (isLoading) return null;

  // Jika login sebagai SELLER/DRIVER, jangan render konten
  if (user && (activeRole === "SELLER" || activeRole === "DRIVER")) return null;

  return <>{children}</>;
}
