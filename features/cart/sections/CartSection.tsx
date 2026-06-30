"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { CartItemRow } from "../components/CartItemRow";
import { CartSummary } from "../components/CartSummary";
import { StoreBanner } from "../components/StoreBanner";

export function CartSection() {
  const { cart, isLoading, updateQty, remove } = useCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;
  const subtotal = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f2f4f6] flex items-center justify-center">
          <ShoppingCart size={28} className="text-[#bcc9c6]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#191c1e]">Keranjang Kosong</p>
          <p className="text-sm text-[#6d7a77] mt-1">
            Belum ada produk di keranjang Anda.
          </p>
        </div>
        <a
          href="/products"
          className="text-sm font-medium text-[#00685f] hover:underline"
        >
          Jelajahi Produk
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* Left — items */}
      <div className="flex flex-col gap-4">
        <StoreBanner store={cart.store} />

        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white px-5">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.product._id}
              item={item}
              onQtyChange={updateQty}
              onRemove={remove}
            />
          ))}
        </div>
      </div>

      {/* Right — summary */}
      <div className="sticky top-20">
        <CartSummary
          subtotal={subtotal}
          onCheckout={() => router.push("/checkout")}
        />
      </div>
    </div>
  );
}
