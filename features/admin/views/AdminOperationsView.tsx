import { OperationsSection } from "../sections/OperationsSection";

export function AdminOperationsView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Operasional</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Simulasi waktu dan penanganan pesanan yang melewati batas waktu.
      </p>
      <OperationsSection />
    </main>
  );
}
