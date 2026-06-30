import { ActiveJobSection } from "@/features/delivery/sections/ActiveJobSection";

export default function ActiveJobPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Job Aktif Sekarang</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Job pengiriman yang sedang Anda kerjakan.
      </p>
      <ActiveJobSection />
    </main>
  );
}
