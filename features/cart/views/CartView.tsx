import { CartSection } from "../sections/CartSection";

export function CartView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-6">Keranjang Belanja</h1>
      <CartSection />
    </main>
  );
}
