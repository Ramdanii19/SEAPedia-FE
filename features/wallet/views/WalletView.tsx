"use client";

import { useState } from "react";
import { WalletSection } from "../sections/WalletSection";
import { AddressSection } from "../sections/AddressSection";

const TABS = [
  { key: "wallet", label: "Dompet" },
  { key: "address", label: "Alamat Saya" },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function WalletView() {
  const [activeTab, setActiveTab] = useState<Tab>("wallet");

  return (
    <main className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#191c1e]">Dompet & Alamat</h1>
        <p className="text-sm text-[#6d7a77] mt-1">
          Kelola saldo dan alamat pengiriman Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#bcc9c6]/40">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[#00685f] text-[#00685f]"
                : "border-transparent text-[#6d7a77] hover:text-[#191c1e]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "wallet" ? <WalletSection /> : <AddressSection />}
    </main>
  );
}
