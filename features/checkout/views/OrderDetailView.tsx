import { OrderDetailSection } from "../sections/OrderDetailSection";

type Props = { id: string };

export function OrderDetailView({ id }: Props) {
  return (
    <main className="px-4 py-6 max-w-5xl mx-auto">
      <OrderDetailSection id={id} />
    </main>
  );
}
