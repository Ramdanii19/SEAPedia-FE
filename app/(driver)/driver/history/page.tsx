import { DriverHistorySection } from "@/features/delivery/sections/DriverHistorySection";

export default function DriverHistoryPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Penghasilan Anda</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Pantau performa dan rincian pendapatan harian Anda.
      </p>
      <DriverHistorySection />
    </main>
  );
}
