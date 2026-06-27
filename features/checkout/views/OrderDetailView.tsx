import { OrderDetailSection } from "../sections/OrderDetailSection";

type Props = { id: string };

export function OrderDetailView({ id }: Props) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-6">Detail Pesanan</h1>
      <OrderDetailSection id={id} />
    </main>
  );
}
