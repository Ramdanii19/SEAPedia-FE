import { AvailableJobsSection } from "../sections/AvailableJobsSection";

export function JobsView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Job Tersedia</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Pilih pengiriman yang ingin Anda ambil.
      </p>
      <AvailableJobsSection />
    </main>
  );
}
