"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, RefreshCw, Wallet, TrendingUp, Bike } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { RoleBadge } from "@/features/auth/components/RoleBadge";
import { Role } from "@/features/auth/types/auth.types";
import { formatRupiah } from "@/utils/formatRupiah";
import walletService from "@/features/wallet/service/wallet.service";
import reportService from "@/features/report/service/report.service";
import deliveryService from "@/features/delivery/service/delivery.service";

function FinancialCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number | null;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#bcc9c6]/30 bg-white shadow-sm">
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#6d7a77]">{label}</p>
        <p className="text-base font-semibold text-[#191c1e]">
          {value === null ? "Memuat..." : formatRupiah(value)}
        </p>
      </div>
    </div>
  );
}

export function ProfileSection() {
  const { user, isLoading } = useProfile();
  const { activeRole } = useAuth();

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [sellerRevenue, setSellerRevenue] = useState<number | null>(null);
  const [driverEarning, setDriverEarning] = useState<number | null>(null);

  useEffect(() => {
    walletService.getWallet()
      .then((res) => {
        const d = (res as any).data ?? res;
        setWalletBalance(d?.wallet?.balance ?? 0);
      })
      .catch(() => setWalletBalance(0));
  }, []);

  useEffect(() => {
    if (activeRole !== "SELLER") return;
    reportService.getSellerRevenue()
      .then((res) => {
        const d = (res as any).data ?? res;
        setSellerRevenue(d?.totals?.totalRevenue ?? 0);
      })
      .catch(() => setSellerRevenue(0));
  }, [activeRole]);

  useEffect(() => {
    if (activeRole !== "DRIVER") return;
    deliveryService.getDashboard()
      .then((res) => {
        const d = (res as any).data ?? res;
        setDriverEarning(d?.totalEarning ?? 0);
      })
      .catch(() => setDriverEarning(0));
  }, [activeRole]);

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
              {fullUser.fullName ?? "—"}
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

        <Link
          href="/select-role"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#00685f] hover:underline underline-offset-4"
        >
          <RefreshCw size={14} />
          Ganti peran aktif
        </Link>
      </div>

      {/* Financial summary — sesuai role */}
      <div>
        <p className="text-xs font-medium text-[#6d7a77] mb-3 px-1">Ringkasan finansial</p>
        <div className="flex flex-col gap-3">
          <FinancialCard
            label="Saldo Dompet"
            value={walletBalance}
            icon={Wallet}
            iconBg="bg-[#bee5fd]"
            iconColor="text-[#3d6377]"
          />
          {activeRole === "SELLER" && (
            <FinancialCard
              label="Total Pendapatan Toko"
              value={sellerRevenue}
              icon={TrendingUp}
              iconBg="bg-[#89f5e7]"
              iconColor="text-[#00685f]"
            />
          )}
          {activeRole === "DRIVER" && (
            <FinancialCard
              label="Total Penghasilan Driver"
              value={driverEarning}
              icon={Bike}
              iconBg="bg-[#ffdad4]"
              iconColor="text-[#aa2e21]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
