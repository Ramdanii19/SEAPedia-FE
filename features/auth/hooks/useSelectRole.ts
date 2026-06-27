"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/features/auth/service/auth.service";
import { roleHome } from "@/utils/roleHome";
import { Role } from "@/features/auth/types/auth.types";

export function useSelectRole() {
  const router = useRouter();
  const { user, setActiveRole } = useAuth();
  const [selected, setSelected] = useState<Role | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const selectableRoles = (user?.roles ?? []).filter(
    (r) => (r as string) !== "admin"
  ) as unknown as Role[];

  async function confirm() {
    if (!selected) return;
    setServerError(null);
    setIsConfirming(true);
    try {
      await authService.selectActiveRole(selected);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setActiveRole(selected as any);
      router.push(roleHome(selected));
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Gagal memilih peran, coba lagi.";
      setServerError(msg);
      setIsConfirming(false);
    }
  }

  return { selectableRoles, selected, setSelected, confirm, isConfirming, serverError };
}
