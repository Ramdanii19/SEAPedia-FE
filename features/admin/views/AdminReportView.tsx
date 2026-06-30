import { AdminReportSection } from "../sections/AdminReportSection";

export function AdminReportView() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#191c1e]">Laporan Platform</h1>
        <p className="text-sm text-[#6d7a77] mt-0.5">Statistik dan ringkasan seluruh aktivitas platform.</p>
      </div>
      <AdminReportSection />
    </main>
  );
}
