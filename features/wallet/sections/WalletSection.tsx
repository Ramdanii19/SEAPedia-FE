"use client";

import { useState } from "react";
import { BalanceCard } from "../components/BalanceCard";
import { TopupModal } from "../components/TopupModal";
import { TransactionList } from "../components/TransactionList";
import { useWallet } from "../hooks/useWallet";

export function WalletSection() {
  const { wallet, transactions, isLoading, topup, error } = useWallet();
  const [showTopup, setShowTopup] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error) {
    return <p className="py-8 text-center text-sm text-[#cc4636]">{error}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-6 max-w-lg">
        <BalanceCard
          balance={wallet?.balance ?? 0}
          onTopUp={() => setShowTopup(true)}
        />

        {/* Riwayat Transaksi */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
          <p className="text-sm font-semibold text-[#191c1e] mb-4">
            Riwayat Transaksi
          </p>
          <TransactionList transactions={transactions} />
        </div>
      </div>

      <TopupModal
        open={showTopup}
        onClose={() => setShowTopup(false)}
        onSubmit={async (amount) => {
          await topup(amount);
          setShowTopup(false);
        }}
      />
    </>
  );
}
