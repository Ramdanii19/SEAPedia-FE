"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Info } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { CartItemRow } from "../components/CartItemRow";
import { CartSummary } from "../components/CartSummary";
import { StoreBanner } from "../components/StoreBanner";

export function CartSection() {
  const { cart, isLoading, updateQty, remove } = useCart();
  const router = useRouter();

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // Auto-select all when cart loads
  useEffect(() => {
    if (cart?.items) {
      setCheckedIds(new Set(cart.items.map((i) => i.product._id)));
    }
  }, [cart]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f2f4f6] flex items-center justify-center">
          <ShoppingCart size={28} className="text-[#bcc9c6]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#191c1e]">Keranjang Kosong</p>
          <p className="text-sm text-[#6d7a77] mt-1">Belum ada produk di keranjang Anda.</p>
        </div>
        <a href="/products" className="text-sm font-medium text-[#00685f] hover:underline">
          Jelajahi Produk
        </a>
      </div>
    );
  }

  const allChecked = cart.items.every((i) => checkedIds.has(i.product._id));

  function toggleAll(checked: boolean) {
    setCheckedIds(checked ? new Set(cart!.items.map((i) => i.product._id)) : new Set());
  }

  function toggleItem(productId: string, checked: boolean) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }

  const checkedItems = cart.items.filter((i) => checkedIds.has(i.product._id));
  const subtotal = checkedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalQty = checkedItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* Left */}
      <div className="flex flex-col gap-3">
        {/* Info banner */}
        <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
          <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Satu keranjang hanya untuk produk dari satu toko. Selesaikan pesanan ini untuk berbelanja dari toko lain.
          </p>
        </div>

        {/* Cart card */}
        <div className="rounded-xl border border-[#bcc9c6]/40 bg-white px-4">
          <StoreBanner
            store={cart.store}
            checked={allChecked}
            onCheck={toggleAll}
          />
          {cart.items.map((item) => (
            <CartItemRow
              key={item.product._id}
              item={item}
              checked={checkedIds.has(item.product._id)}
              onCheck={toggleItem}
              onQtyChange={updateQty}
              onRemove={remove}
            />
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="sticky top-20">
        <CartSummary
          subtotal={subtotal}
          itemCount={totalQty}
          discount={0}
          onCheckout={() => router.push("/checkout")}
          disabled={checkedIds.size === 0}
        />
      </div>
    </div>
  );
}
