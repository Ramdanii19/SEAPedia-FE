"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { CartItem } from "../types/cart.types";

type Props = {
  item: CartItem;
  checked: boolean;
  onCheck: (productId: string, checked: boolean) => void;
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
};

export function CartItemRow({ item, checked, onCheck, onQtyChange, onRemove }: Props) {
  const { product, quantity } = item;

  return (
    <div
      className={`flex items-start gap-3 py-4 border-b border-[#bcc9c6]/30 last:border-0 transition-colors rounded-lg px-1 ${
        checked ? "bg-white" : "bg-white opacity-60"
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheck(product._id, e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#00685f] cursor-pointer"
      />

      {/* Image */}
      <div className="w-18 h-18 shrink-0 rounded-xl overflow-hidden bg-[#f2f4f6]">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#e5eae9]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#191c1e] line-clamp-2 leading-snug">
              {product.name}
            </p>
          </div>
          <button
            onClick={() => onRemove(product._id)}
            className="shrink-0 text-[#bcc9c6] hover:text-[#cc4636] transition-colors mt-0.5"
            title="Hapus"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <p className="text-sm font-bold text-[#191c1e] mt-1.5">{formatRupiah(product.price)}</p>

        {/* Qty stepper */}
        <div className="flex items-center gap-1 mt-2.5">
          <button
            onClick={() => onQtyChange(product._id, quantity - 1)}
            disabled={quantity <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f4f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus size={11} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-[#191c1e]">
            {quantity}
          </span>
          <button
            onClick={() => onQtyChange(product._id, quantity + 1)}
            disabled={quantity >= product.stock}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f4f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
