import { BuyerReportSection } from "../sections/BuyerReportSection";

export function BuyerReportView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Laporan Pengeluaran</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Ringkasan total belanja dan riwayat pembayaran Anda.
      </p>
      <BuyerReportSection />
    </main>
  );
}
