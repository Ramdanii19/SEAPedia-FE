import { DriverDashboardSection } from "../sections/DriverDashboardSection";

export function DriverDashboardView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Dashboard Driver</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Pantau penghasilan dan status pengiriman Anda.
      </p>
      <DriverDashboardSection />
    </main>
  );
}
