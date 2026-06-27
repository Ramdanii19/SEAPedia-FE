"use client";

import Link from "next/link";
import { Bike, PackageCheck } from "lucide-react";
import { StatCard } from "@/features/report/components/StatCard";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { useDriverDashboard } from "../hooks/useDriverDashboard";
import { DeliveryJob } from "../types/delivery.types";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Tersedia",
  TAKEN: "Sedang Berjalan",
  COMPLETED: "Selesai",
};

function JobRow({ job }: { job: DeliveryJob }) {
  return (
    <Link
      href={`/driver/jobs/${job.id}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-[#f8f9fb] transition-colors border-b border-[#bcc9c6]/30 last:border-0"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[#191c1e]">
          {job.order.store?.storeName ?? "—"}
        </span>
        <span className="text-xs text-[#6d7a77]">
          {STATUS_LABEL[job.status] ?? job.status}
          {job.completedAt ? ` · ${formatDate(job.completedAt)}` : ""}
        </span>
      </div>
      <span className="text-sm font-semibold text-[#00685f] shrink-0 ml-4">
        {formatRupiah(job.earning)}
      </span>
    </Link>
  );
}

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

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Penghasilan"
          value={formatRupiah(data.totalEarning)}
          hint="Dari semua pengiriman selesai"
        />
        <StatCard
          label="Job Selesai"
          value={String(data.history.length)}
          hint="Riwayat pengiriman"
        />
        <StatCard
          label="Job Aktif"
          value={data.activeJob ? "1" : "0"}
          hint={data.activeJob ? "Sedang dalam pengiriman" : "Tidak ada job aktif"}
        />
      </div>

      {/* Earning formula info */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-[#f8f9fb] px-4 py-3 text-xs text-[#6d7a77]">
        <span className="font-semibold text-[#191c1e]">Rumus penghasilan: </span>
        Ongkos kirim yang dibayar pembeli dikurangi komisi platform. Nilai final dikonfirmasi server saat job diselesaikan.
      </div>

      {/* Active job */}
      {data.activeJob && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[#191c1e]">Job Aktif</p>
          <div className="rounded-xl border border-[#00685f]/30 bg-white overflow-hidden">
            <JobRow job={data.activeJob} />
          </div>
        </div>
      )}

      {!data.activeJob && (
        <div className="flex flex-col items-center py-10 gap-3 text-center rounded-xl border border-[#bcc9c6]/40 bg-white">
          <Bike size={28} className="text-[#bcc9c6]" />
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">Tidak Ada Job Aktif</p>
            <Link href="/driver/jobs" className="mt-1 block text-sm text-[#00685f] hover:underline">
              Cari job tersedia →
            </Link>
          </div>
        </div>
      )}

      {/* History */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#191c1e]">Riwayat Pengiriman</p>
        {data.history.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2 text-center rounded-xl border border-[#bcc9c6]/40 bg-white">
            <PackageCheck size={24} className="text-[#bcc9c6]" />
            <p className="text-sm text-[#6d7a77]">Belum ada riwayat pengiriman.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
            {data.history.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
