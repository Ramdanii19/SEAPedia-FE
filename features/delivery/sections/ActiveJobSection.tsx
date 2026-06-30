"use client";

import Link from "next/link";
import { Truck, MapPin, Store, ChevronRight, Bike } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { useDriverDashboard } from "../hooks/useDriverDashboard";
import { CompleteJobButton } from "../components/CompleteJobButton";

export function ActiveJobSection() {
  const { data, isLoading, error, reload } = useDriverDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-[#cc4636]">{error}</p>;
  }

  if (!data?.activeJob) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 text-center rounded-xl border border-[#bcc9c6]/40 bg-white">
        <div className="w-16 h-16 rounded-full bg-[#f2f4f6] flex items-center justify-center">
          <Bike size={28} className="text-[#bcc9c6]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#191c1e]">Tidak Ada Job Aktif</p>
          <p className="text-sm text-[#6d7a77] mt-1">
            Anda belum mengambil job pengiriman saat ini.
          </p>
        </div>
        <Link
          href="/driver/jobs"
          className="text-sm font-medium text-[#00685f] hover:underline"
        >
          Cari Job Tersedia
        </Link>
      </div>
    );
  }

  const job = data.activeJob;
  const order = job.order as any;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Status banner */}
      <div className="rounded-xl bg-[#fff3e0] border border-[#e65100]/20 px-5 py-3 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-[#e65100] animate-pulse shrink-0" />
        <p className="text-sm font-semibold text-[#e65100]">Sedang Berjalan</p>
        <span className="ml-auto text-xs text-[#e65100]/70">Job aktif ditemukan</span>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-[#00685f]/30 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#bcc9c6]/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f4f3] flex items-center justify-center shrink-0">
            <Truck size={18} className="text-[#00685f]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#6d7a77]">Job ID</p>
            <p className="text-sm font-semibold text-[#191c1e] font-mono">
              #{(job._id as string).slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-[#6d7a77]">Penghasilan</p>
            <p className="text-base font-bold text-[#00685f]">{formatRupiah(job.earning)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          {/* Toko */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center shrink-0">
              <Store size={14} className="text-[#6d7a77]" />
            </div>
            <div>
              <p className="text-[11px] text-[#6d7a77] uppercase tracking-wide">Toko Asal</p>
              <p className="text-sm font-semibold text-[#191c1e]">
                {order?.store?.storeName ?? "—"}
              </p>
            </div>
          </div>

          {/* Alamat tujuan */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={14} className="text-[#6d7a77]" />
            </div>
            <div>
              <p className="text-[11px] text-[#6d7a77] uppercase tracking-wide">Alamat Pengiriman</p>
              <p className="text-sm text-[#3d4947] mt-0.5 leading-relaxed">
                {order?.shippingAddress ?? "—"}
              </p>
              {order?.shippingRecipientName && (
                <p className="text-xs text-[#6d7a77] mt-1">
                  Penerima: {order.shippingRecipientName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Link ke detail */}
        <Link
          href={`/driver/jobs/${job._id}`}
          className="flex items-center justify-between px-5 py-3 border-t border-[#bcc9c6]/30 hover:bg-[#f8f9fb] transition-colors"
        >
          <span className="text-sm text-[#00685f] font-medium">Lihat Detail Pesanan</span>
          <ChevronRight size={16} className="text-[#bcc9c6]" />
        </Link>
      </div>

      {/* Selesaikan job */}
      <CompleteJobButton jobId={job._id as string} onCompleted={() => reload()} />
    </div>
  );
}
