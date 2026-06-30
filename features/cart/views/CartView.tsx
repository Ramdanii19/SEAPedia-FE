import { CartSection } from "../sections/CartSection";

export function CartView() {
  return (
    <main className="px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#191c1e] mb-6">Keranjang Belanja</h1>
      <CartSection />
    </main>
  );
}
