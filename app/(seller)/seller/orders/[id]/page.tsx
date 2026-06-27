import { SellerOrderDetailSection } from "@/features/checkout/sections/SellerOrderDetailSection";

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-6">
      <SellerOrderDetailSection id={id} />
    </main>
  );
}
