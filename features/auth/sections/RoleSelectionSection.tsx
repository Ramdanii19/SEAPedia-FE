"use client";

import { ShoppingBag, Store, Car } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useSelectRole } from "@/features/auth/hooks/useSelectRole";
import { RoleCard } from "@/features/auth/components/RoleCard";
import { Role } from "@/features/auth/types/auth.types";

const ROLE_META: Record<
  Exclude<Role, "ADMIN">,
  { label: string; description: string; Icon: LucideIcon }
> = {
  BUYER: {
    label: "Pembeli",
    description: "Belanja produk segar dari penjual terpercaya",
    Icon: ShoppingBag,
  },
  SELLER: {
    label: "Penjual",
    description: "Kelola toko dan produk Anda",
    Icon: Store,
  },
  DRIVER: {
    label: "Driver",
    description: "Ambil dan antar pesanan pembeli",
    Icon: Car,
  },
};

export function RoleSelectionSection() {
  const { selectableRoles, choose, loading, serverError } = useSelectRole();

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-[#00685f]">SEAPEDIA</h1>
        <h2 className="text-2xl font-semibold text-[#191c1e] mt-4">Pilih peran untuk sesi ini</h2>
        <p className="text-[#3d4947] mt-1.5 text-[15px]">
          Anda dapat berganti peran kapan saja dari profil
        </p>
      </div>

      {/* Role grid */}
      <div className={`grid gap-4 w-full ${selectableRoles.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {selectableRoles.map((role) => {
          const meta = ROLE_META[role as Exclude<Role, "ADMIN">];
          if (!meta) return null;
          return (
            <RoleCard
              key={role}
              role={role}
              label={meta.label}
              description={meta.description}
              Icon={meta.Icon}
              isLoading={loading === role}
              onSelect={() => choose(role)}
            />
          );
        })}
      </div>

      {serverError && (
        <p className="text-sm text-red-600">{serverError}</p>
      )}
    </div>
  );
}
