import { DiscountManagementSection } from "../sections/DiscountManagementSection";

export function DiscountManagementView() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-[#191c1e] mb-1">Manajemen Diskon</h1>
      <p className="text-sm text-[#6d7a77] mb-6">
        Buat dan pantau voucher serta promo yang aktif di platform.
      </p>
      <DiscountManagementSection />
    </main>
  );
}
