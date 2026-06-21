"use client";

import { ShoppingCart, Store, Bike, Loader2 } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useSelectRole } from "@/features/auth/hooks/useSelectRole";
import { RoleCard } from "@/features/auth/components/RoleCard";
import { Role } from "@/features/auth/types/auth.types";

const ROLE_META: Record<
  Exclude<Role, "ADMIN">,
  { label: string; description: string; Icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  BUYER: {
    label: "Pembeli",
    description: "Temukan produk unggulan nusantara, nikmati promo eksklusif, dan lacak pesanan Anda dengan mudah.",
    Icon: ShoppingCart,
    iconBg: "#bee5fd",
    iconColor: "#3d6377",
  },
  SELLER: {
    label: "Penjual",
    description: "Kelola toko Anda, pantau inventaris, analisis penjualan, dan jangkau lebih banyak pelanggan di seluruh kepulauan.",
    Icon: Store,
    iconBg: "#89f5e7",
    iconColor: "#00685f",
  },
  DRIVER: {
    label: "Pengemudi",
    description: "Terima tugas pengiriman, akses peta rute tercepat, dan kelola penghasilan harian Anda dengan fleksibel.",
    Icon: Bike,
    iconBg: "#ffdad4",
    iconColor: "#aa2e21",
  },
};

export function RoleSelectionSection() {
  const { selectableRoles, selected, setSelected, confirm, isConfirming, serverError } =
    useSelectRole();

  return (
    <div className="flex flex-col items-center gap-16 w-full max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold text-[#191c1e] mb-3">Selamat Datang Kembali</h2>
        <p className="text-lg text-[#3d4947] leading-relaxed">
          Pilih peran aktif Anda untuk memulai sesi. Fitur dan dasbor akan disesuaikan
          secara otomatis berdasarkan pilihan Anda.
        </p>
      </div>

      {/* Role cards */}
      <div className={`grid gap-6 w-full ${
        selectableRoles.length === 1
          ? "grid-cols-1 max-w-xs mx-auto"
          : selectableRoles.length === 2
          ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
          : "grid-cols-1 md:grid-cols-3"
      }`}>
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
              iconBg={meta.iconBg}
              iconColor={meta.iconColor}
              isSelected={selected === role}
              onSelect={() => setSelected(role)}
            />
          );
        })}
      </div>

      {/* Confirm action */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={confirm}
          disabled={!selected || isConfirming}
          className={`w-full py-4 px-8 rounded-lg font-semibold text-base shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            selected && !isConfirming
              ? "bg-[#008378] text-white hover:bg-[#00685f] hover:shadow-lg active:scale-95 cursor-pointer"
              : "bg-[#e0e3e5] text-[#3d4947] cursor-not-allowed"
          }`}
        >
          {isConfirming ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Menyiapkan Dasbor...
            </>
          ) : (
            "Konfirmasi Peran"
          )}
        </button>
        <p className="text-xs text-[#6d7a77] text-center">
          Anda dapat berganti peran kapan saja melalui menu pengaturan akun.
        </p>
        {serverError && (
          <p className="text-sm text-red-600 text-center">{serverError}</p>
        )}
      </div>
    </div>
  );
}
