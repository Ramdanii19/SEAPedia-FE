import { WishlistSection } from "@/features/wishlist/sections/WishlistSection";

export default function WishlistPage() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#191c1e]">Wishlist Saya</h1>
        <p className="text-sm text-[#6d7a77] mt-0.5">Produk yang kamu simpan untuk dibeli nanti.</p>
      </div>
      <WishlistSection />
    </main>
  );
}
