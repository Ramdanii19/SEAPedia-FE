"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/features/auth/types/auth.types";
import { roleHome } from "@/utils/roleHome";

type Props = {
  allow: Role[];
  children: React.ReactNode;
};

export function RouteGuard({ allow, children }: Props) {
  const router = useRouter();
  const { user, activeRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!activeRole) {
      router.replace("/select-role");
      return;
    }

    const role = activeRole as unknown as Role;
    if (!allow.includes(role)) {
      router.replace(roleHome(role));
    }
  }, [isLoading, user, activeRole, allow, router]);

  if (isLoading || !user || !activeRole) return null;

  const role = activeRole as unknown as Role;
  if (!allow.includes(role)) return null;

  return <>{children}</>;
}
