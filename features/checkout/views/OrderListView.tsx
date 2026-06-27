import { OrderListSection } from "../sections/OrderListSection";

export function OrderListView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-6">Pesanan Saya</h1>
      <OrderListSection />
    </main>
  );
}
