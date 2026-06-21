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
  const [loading, setLoading] = useState<Role | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Non-admin roles the user actually has
  const selectableRoles = (user?.roles ?? []).filter(
    (r) => r !== ("admin" as string)
  ) as Role[];

  async function choose(role: Role) {
    setServerError(null);
    setLoading(role);
    try {
      await authService.selectActiveRole(role);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setActiveRole(role as any);
      router.push(roleHome(role));
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Gagal memilih peran, coba lagi.";
      setServerError(msg);
      setLoading(null);
    }
  }

  return { selectableRoles, choose, loading, serverError };
}
