import { SellerReportSection } from "../sections/SellerReportSection";

export function SellerReportView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Laporan Pendapatan</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Ringkasan pendapatan dan statistik pesanan toko Anda.
      </p>
      <SellerReportSection />
    </main>
  );
}
