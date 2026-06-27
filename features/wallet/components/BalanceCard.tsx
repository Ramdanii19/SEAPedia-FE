"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatRupiah";

type Props = {
  balance: number;
  onTopUp: () => void;
};

export function BalanceCard({ balance, onTopUp }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#00685f] to-[#004d46] p-6 text-white flex flex-col gap-4">
      <div className="flex items-center gap-2 opacity-80">
        <Wallet size={16} />
        <span className="text-sm font-medium">Saldo SEAPEDIA</span>
      </div>
      <p className="text-3xl font-bold tracking-tight">{formatRupiah(balance)}</p>
      <Button
        onClick={onTopUp}
        className="w-fit bg-white text-[#00685f] hover:bg-white/90 font-semibold"
      >
        + Top Up
      </Button>
    </div>
  );
}
