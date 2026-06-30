"use client";

import { WalletSection } from "../sections/WalletSection";

export function WalletView() {
  return (
    <main className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#191c1e]">Dompet Saya</h1>
        <p className="text-sm text-[#6d7a77] mt-1">
          Kelola saldo dan riwayat transaksi Anda.
        </p>
      </div>

      <WalletSection />
    </main>
  );
}
