"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, ShoppingBag, Package } from "lucide-react";
import reportService from "@/features/report/service/report.service";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

type DashboardData = {
  totalRevenue: number;
  incomingCount: number;
  processedCount: number;
};

export default function SellerHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reportService
      .getSellerRevenue()
      .then((res) => {
        const d = res.data as any;
        setData({
          totalRevenue:   d?.totals?.totalRevenue ?? 0,
          incomingCount:  d?.countByStatus?.PACKING ?? 0,
          processedCount: (d?.countByStatus?.WAITING_DELIVERY ?? 0) + (d?.countByStatus?.DELIVERING ?? 0),
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#191c1e]">Dashboard Penjual</h1>
        <p className="text-sm text-[#6d7a77] mt-1">Pantau performa toko Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Pendapatan */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#e8f4f3] flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-[#00685f]" />
            </div>
            <p className="text-sm text-[#6d7a77]">Total Pendapatan</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {isLoading ? "Rp —" : formatRp(data?.totalRevenue ?? 0)}
            </p>
            <p className="text-xs text-[#00685f] mt-1">↑ Dari semua transaksi selesai</p>
          </div>
        </div>

        {/* Pesanan Masuk */}
        <Link
          href="/seller/orders"
          className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-3 hover:border-[#00685f]/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#fde8e6] flex items-center justify-center shrink-0">
              <ShoppingBag size={18} className="text-[#cc4636]" />
            </div>
            <p className="text-sm text-[#6d7a77]">Pesanan Masuk</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {isLoading ? "—" : (data?.incomingCount ?? 0)}
            </p>
            {!isLoading && (data?.incomingCount ?? 0) > 0 ? (
              <span className="inline-block mt-1.5 rounded-sm bg-[#cc4636] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                Perlu Tindakan
              </span>
            ) : (
              !isLoading && <p className="text-xs text-[#6d7a77] mt-1">Tidak ada pesanan baru</p>
            )}
          </div>
        </Link>

        {/* Pesanan Diproses */}
        <Link
          href="/seller/orders"
          className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5 flex flex-col gap-3 hover:border-[#00685f]/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#e8f4f3] flex items-center justify-center shrink-0">
              <Package size={18} className="text-[#00685f]" />
            </div>
            <p className="text-sm text-[#6d7a77]">Pesanan Diproses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {isLoading ? "—" : (data?.processedCount ?? 0)}
            </p>
            <p className="text-xs text-[#6d7a77] mt-1">Sedang dikemas / dikirim</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
