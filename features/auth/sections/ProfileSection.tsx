"use client";

import Link from "next/link";
import { User, Mail, RefreshCw } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { RoleBadge } from "@/features/auth/components/RoleBadge";
import { FinancialSummaryCard } from "@/features/auth/components/FinancialSummaryCard";
import { Role } from "@/features/auth/types/auth.types";

export function ProfileSection() {
  const { user, isLoading } = useProfile();
  const { activeRole } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[#00685f] border-t-transparent animate-spin" />
      </div>
    );
  }

  const fullUser = user as unknown as {
    fullName: string;
    email: string;
    roles: Role[];
    walletBalance: number;
    sellerRevenue: number;
    driverEarning: number;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Identity card */}
      <div className="bg-white rounded-xl border border-[#bcc9c6]/30 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#89f5e7] flex items-center justify-center shrink-0">
            <User size={26} className="text-[#00685f]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#191c1e]">
              {fullUser.fullName ?? (user as { name?: string }).name ?? "—"}
            </h2>
            <p className="flex items-center gap-1.5 text-sm text-[#6d7a77] mt-0.5">
              <Mail size={14} />
              {fullUser.email}
            </p>
          </div>
        </div>

        {/* Roles */}
        <div>
          <p className="text-xs font-medium text-[#6d7a77] mb-2">Peran saya</p>
          <div className="flex flex-wrap gap-2">
            {(fullUser.roles ?? []).map((role) => (
              <RoleBadge
                key={role}
                role={role}
                active={role === (activeRole as unknown as Role)}
              />
            ))}
          </div>
        </div>

        {/* Switch role */}
        <Link
          href="/select-role"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#00685f] hover:underline underline-offset-4"
        >
          <RefreshCw size={14} />
          Ganti peran aktif
        </Link>
      </div>

      {/* Financial summary */}
      <div>
        <p className="text-xs font-medium text-[#6d7a77] mb-3 px-1">Ringkasan finansial</p>
        <FinancialSummaryCard
          walletBalance={fullUser.walletBalance ?? 0}
          sellerRevenue={fullUser.sellerRevenue ?? 0}
          driverEarning={fullUser.driverEarning ?? 0}
        />
      </div>
    </div>
  );
}
