"use client";

import { useState, useMemo } from "react";
import { Download, Star, Wallet, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { useDriverDashboard } from "../hooks/useDriverDashboard";

const PAGE_SIZE = 10;

const DELIVERY_LABEL: Record<string, string> = {
  INSTANT:  "Kargo Laut Kilat",
  NEXT_DAY: "Logistik Ekspres",
  REGULAR:  "Pengiriman Reguler",
};

function jobOrderId(jobId: string) {
  const a = jobId.slice(-8, -3).toUpperCase();
  const b = jobId.slice(-3).toUpperCase();
  return `#SPD-${a}-${b}`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
  };
}

async function downloadPDF(rows: {
  date: string; id: string; layanan: string; earning: number;
}[], curMonthEarning: number, totalEarning: number) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Header
  doc.setFontSize(16);
  doc.setTextColor(0, 104, 95);
  doc.text("SEAPEDIA", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("Laporan Penghasilan Driver", 14, 25);
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`, 14, 31);

  // Summary box
  doc.setFillColor(0, 104, 95);
  doc.roundedRect(14, 37, 85, 22, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Total Penghasilan Bulan Ini", 19, 44);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(curMonthEarning), 19, 53);

  doc.setFillColor(240, 245, 244);
  doc.roundedRect(104, 37, 92, 22, 3, 3, "F");
  doc.setTextColor(61, 73, 71);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Total Penghasilan Keseluruhan", 109, 44);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 104, 95);
  doc.text(new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalEarning), 109, 53);

  // Table
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(25, 28, 30);
  doc.text("Pekerjaan Selesai", 14, 68);

  autoTable(doc, {
    startY: 72,
    head: [["Tanggal", "ID Pesanan", "Layanan", "Status", "Penghasilan"]],
    body: rows.map((r) => [
      r.date,
      r.id,
      r.layanan,
      "Selesai",
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(r.earning),
    ]),
    headStyles: { fillColor: [0, 104, 95], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [61, 73, 71] },
    columnStyles: { 4: { halign: "right" } },
    alternateRowStyles: { fillColor: [248, 249, 251] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`laporan-penghasilan-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function DriverHistorySection() {
  const { data, isLoading, error } = useDriverDashboard();
  const [page, setPage] = useState(1);

  const completedJobs = useMemo(
    () => (data?.jobHistory ?? []).filter((j) => j.status === "COMPLETED"),
    [data]
  );

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();
  const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
  const prevYear = curMonth === 0 ? curYear - 1 : curYear;

  const curMonthEarning = useMemo(
    () =>
      completedJobs
        .filter((j) => {
          const d = new Date(j.completedAt ?? j.createdAt ?? "");
          return d.getFullYear() === curYear && d.getMonth() === curMonth;
        })
        .reduce((s, j) => s + j.earning, 0),
    [completedJobs, curMonth, curYear]
  );

  const prevMonthEarning = useMemo(
    () =>
      completedJobs
        .filter((j) => {
          const d = new Date(j.completedAt ?? j.createdAt ?? "");
          return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
        })
        .reduce((s, j) => s + j.earning, 0),
    [completedJobs, prevMonth, prevYear]
  );

  const growthPct =
    prevMonthEarning === 0
      ? curMonthEarning > 0 ? 100 : 0
      : Math.round(((curMonthEarning - prevMonthEarning) / prevMonthEarning) * 100);
  const isUp = growthPct >= 0;

  const curMonthCount = useMemo(
    () =>
      completedJobs.filter((j) => {
        const d = new Date(j.completedAt ?? j.createdAt ?? "");
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      }).length,
    [completedJobs, curMonth, curYear]
  );

  const totalPages = Math.max(1, Math.ceil(completedJobs.length / PAGE_SIZE));
  const paginated = completedJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDownload() {
    const rows = completedJobs.map((j) => {
      const dt = formatDateTime(j.completedAt ?? j.createdAt ?? "");
      return {
        date: `${dt.date} ${dt.time}`,
        id: jobOrderId(j._id),
        layanan: DELIVERY_LABEL[(j.order as any)?.deliveryMethod ?? ""] ?? "—",
        earning: j.earning,
      };
    });
    await downloadPDF(rows, curMonthEarning, data?.totalEarning ?? 0);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="py-10 text-center text-sm text-[#cc4636]">{error ?? "Gagal memuat data."}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Download button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00685f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#005049] transition-colors"
        >
          <Download size={15} />
          Unduh Laporan
        </button>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main teal card */}
        <div className="lg:col-span-2 rounded-xl bg-[#00685f] p-6 flex flex-col gap-4">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">
            Total Penghasilan (Bulan Ini)
          </p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatRupiah(curMonthEarning)}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isUp ? "bg-white/20 text-white" : "bg-red-400/20 text-red-200"
              }`}
            >
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isUp ? "+" : ""}{growthPct}% dari bulan lalu
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              {curMonthCount} Pengiriman Selesai
            </span>
          </div>
        </div>

        {/* Right side cards */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8f4f3] flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-[#00685f]" />
            </div>
            <div>
              <p className="text-xs text-[#6d7a77]">Saldo Dompet</p>
              <p className="text-base font-bold text-[#191c1e]">
                {formatRupiah(data.walletBalance ?? 0)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fff8e1] flex items-center justify-center shrink-0">
              <Star size={18} className="text-[#f9a825]" />
            </div>
            <div>
              <p className="text-xs text-[#6d7a77]">Total Job Selesai</p>
              <p className="text-base font-bold text-[#191c1e]">
                {data.completedCount} <span className="text-sm font-normal text-[#6d7a77]">pengiriman</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#bcc9c6]/30">
          <p className="text-sm font-semibold text-[#191c1e]">Pekerjaan Selesai Terbaru</p>
          {completedJobs.length > 0 && (
            <p className="text-xs text-[#6d7a77]">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, completedJobs.length)} dari {completedJobs.length} rincian
            </p>
          )}
        </div>

        {completedJobs.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#9aadaa]">Belum ada pekerjaan selesai.</p>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f9fb] border-b border-[#bcc9c6]/30">
                  {["Tanggal", "ID Pesanan", "Layanan", "Status", "Penghasilan"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((job) => {
                  const dt = formatDateTime(job.completedAt ?? job.createdAt ?? "");
                  const layanan = DELIVERY_LABEL[(job.order as any)?.deliveryMethod ?? ""] ?? "—";
                  return (
                    <tr key={job._id} className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-xs text-[#3d4947]">{dt.date}</p>
                        <p className="text-[10px] text-[#9aadaa]">{dt.time}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono font-semibold text-[#00685f]">
                          {jobOrderId(job._id)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#3d4947]">{layanan}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-xs font-semibold text-[#2e7d32]">
                          Selesai
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-[#191c1e]">
                        {formatRupiah(job.earning)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#bcc9c6]/30">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f0f5f4] disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page ? "bg-[#00685f] text-white" : "border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f0f5f4]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="text-sm text-[#6d7a77] px-1">...</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#bcc9c6] text-sm text-[#3d4947] hover:bg-[#f0f5f4] transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f0f5f4] disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#6d7a77]">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="hover:text-[#00685f] disabled:opacity-40 transition-colors"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="hover:text-[#00685f] disabled:opacity-40 transition-colors"
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
