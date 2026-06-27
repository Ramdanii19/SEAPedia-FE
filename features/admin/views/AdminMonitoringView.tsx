import { MonitoringSection } from "../sections/MonitoringSection";

export function AdminMonitoringView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Monitoring</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Pantau semua data platform secara real-time.
      </p>
      <MonitoringSection />
    </main>
  );
}
