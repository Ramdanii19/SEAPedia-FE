import { SellerIncomingSection } from "../sections/SellerIncomingSection";

export function SellerOrdersView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Pesanan Masuk</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Daftar pesanan dari pembeli yang perlu diproses.
      </p>
      <SellerIncomingSection />
    </main>
  );
}
