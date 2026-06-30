"use client";

import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { ORDER_STATUS_LABEL } from "@/lib/labels";
import { StatCard } from "../components/StatCard";
import { useSellerRevenue } from "../hooks/useSellerRevenue";

export function SellerReportSection() {
  const { data, isLoading, error } = useSellerRevenue();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="py-10 text-center text-sm text-[#cc4636]">
        {error ?? "Gagal memuat laporan."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Pendapatan"
          value={formatRupiah(data.totalRevenue)}
          hint={`Dari ${data.orders.length} pesanan`}
        />
        <StatCard
          label="Pesanan Masuk"
          value={String(data.incomingCount)}
          hint="Total pesanan diterima"
        />
        <StatCard
          label="Pesanan Diproses"
          value={String(data.processedCount)}
          hint="Berhasil diproses"
        />
      </div>

      {/* Order table */}
      {data.orders.length === 0 ? (
        <p className="text-sm text-[#6d7a77] text-center py-10">
          Belum ada riwayat penjualan.
        </p>
      ) : (
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-[#bcc9c6]/30 bg-[#f8f9fb]">
                {["ID Pesanan", "Tanggal", "Status", "Total"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors"
                >
                  <td className="py-3 px-4 text-xs font-mono text-[#6d7a77]">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#6d7a77]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#3d4947]">
                    {(ORDER_STATUS_LABEL as Record<string, string>)[order.status] ?? order.status}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-[#191c1e]">
                    {formatRupiah(order.finalTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
