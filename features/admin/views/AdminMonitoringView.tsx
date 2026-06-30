import { MonitoringSection } from "../sections/MonitoringSection";

export function AdminMonitoringView() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#191c1e]">Dashboard Admin</h1>
        <p className="text-sm text-[#6d7a77] mt-0.5">
          Pantau semua data platform secara real-time.
        </p>
      </div>
      <MonitoringSection />
    </main>
  );
}
