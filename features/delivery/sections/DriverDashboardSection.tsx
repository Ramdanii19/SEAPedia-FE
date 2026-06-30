"use client";

import Link from "next/link";
import {
  Briefcase,
  BarChart2,
  Truck,
  CheckCircle2,
  Package,
  Wallet,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { useDriverDashboard } from "../hooks/useDriverDashboard";
import { DeliveryJob } from "../types/delivery.types";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Tersedia",
  TAKEN:     "Sedang Berjalan",
  COMPLETED: "Selesai",
};

const STATUS_STYLE: Record<string, string> = {
  TAKEN:     "bg-[#fff3e0] text-[#e65100]",
  COMPLETED: "bg-[#e8f5e9] text-[#2e7d32]",
  AVAILABLE: "bg-[#e3f2fd] text-[#1565c0]",
};

export function DriverDashboardSection() {
  const { data, isLoading, error } = useDriverDashboard();

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
        {error ?? "Gagal memuat dashboard."}
      </p>
    );
  }

  const recent5 = data.jobHistory.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Quick action cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/driver/jobs"
          className="rounded-xl bg-[#00685f] p-4 flex flex-col gap-4 hover:bg-[#005049] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Cari Job</p>
            <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
              Lihat job pengiriman tersedia
            </p>
          </div>
        </Link>

        <Link
          href="/driver/history"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <BarChart2 size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Riwayat</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">
              Penghasilan & riwayat
            </p>
          </div>
        </Link>

        <div className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4">
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Truck size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Job Aktif</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">
              {data.activeJob ? "1 job sedang berjalan" : "Tidak ada job aktif"}
            </p>
          </div>
        </div>

        <Link
          href="/profile"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <MapPin size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Profil</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">
              Data diri Anda
            </p>
          </div>
        </Link>
      </div>

      {/* Wallet + stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Saldo */}
        <div className="lg:col-span-1 rounded-xl bg-[#00685f] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
              Saldo Dompet
            </p>
            <Wallet size={16} className="text-white/60" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {formatRupiah(data.walletBalance ?? 0)}
          </p>
          <Link
            href="/driver/history"
            className="inline-flex items-center justify-center text-xs font-semibold text-[#00685f] bg-white hover:bg-white/90 rounded-lg px-3 py-2 transition-colors"
          >
            Lihat Penghasilan
          </Link>
        </div>

        {/* 3 stat cards */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#e8f4f3] flex items-center justify-center">
              <Package size={20} className="text-[#00685f]" />
            </div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {formatRupiah(data.totalEarning)}
            </p>
            <p className="text-xs text-[#6d7a77] text-center">Total Penghasilan</p>
          </div>

          <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#e5f4ec] flex items-center justify-center">
              <CheckCircle2 size={20} className="text-[#2e7d32]" />
            </div>
            <p className="text-2xl font-bold text-[#191c1e]">{data.completedCount}</p>
            <p className="text-xs text-[#6d7a77] text-center">Job Selesai</p>
          </div>

          <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#fff3e0] flex items-center justify-center">
              <Truck size={20} className="text-[#e65100]" />
            </div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {data.activeJob ? "1" : "0"}
            </p>
            <p className="text-xs text-[#6d7a77] text-center">Job Aktif</p>
          </div>
        </div>
      </div>

      {/* Riwayat Pengiriman */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#bcc9c6]/30">
          <p className="text-sm font-semibold text-[#191c1e]">Riwayat Pengiriman</p>
          <Link
            href="/driver/history"
            className="text-xs font-semibold text-[#00685f] hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        {recent5.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center">
              <Briefcase size={20} className="text-[#bcc9c6]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#191c1e]">Belum Ada Riwayat</p>
              <p className="text-xs text-[#6d7a77] mt-1">Selesaikan job pertama Anda</p>
            </div>
            <Link
              href="/driver/jobs"
              className="text-sm font-medium text-[#00685f] hover:underline"
            >
              Cari Job Sekarang
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fb] border-b border-[#bcc9c6]/30">
                {["Toko / Rute", "Status", "Penghasilan", "Tanggal"].map((h) => (
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
              {recent5.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-[#191c1e]">
                      {(job.order as any)?.store?.storeName ?? "—"}
                    </p>
                    <p className="text-xs text-[#6d7a77] mt-0.5 max-w-50 truncate">
                      {(job.order as any)?.shippingAddress ?? ""}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[job.status] ?? "bg-[#f2f4f6] text-[#6d7a77]"}`}
                    >
                      {STATUS_LABEL[job.status] ?? job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-[#00685f]">
                    {formatRupiah(job.earning)}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#6d7a77]">
                    {job.completedAt ? formatDate(job.completedAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
