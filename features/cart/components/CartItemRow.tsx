"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { CartItem } from "../types/cart.types";

type Props = {
  item: CartItem;
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
};

export function CartItemRow({ item, onQtyChange, onRemove }: Props) {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-[#bcc9c6]/30 last:border-0">
      {/* Image */}
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-[#f2f4f6]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <p className="text-sm font-medium text-[#191c1e] line-clamp-2">
          {product.name}
        </p>
        <p className="text-sm font-semibold text-[#191c1e]">
          {formatRupiah(product.price)}
        </p>

        {/* Qty stepper + remove */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center rounded-lg border border-[#bcc9c6]">
            <button
              onClick={() => onQtyChange(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-[#3d4947] hover:bg-[#f2f4f6] transition-colors rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-[#191c1e]">
              {quantity}
            </span>
            <button
              onClick={() => onQtyChange(product._id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="w-8 h-8 flex items-center justify-center text-[#3d4947] hover:bg-[#f2f4f6] transition-colors rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#191c1e]">
              {formatRupiah(subtotal)}
            </span>
            <button
              onClick={() => onRemove(product._id)}
              className="text-[#cc4636] hover:text-[#b03a2e] transition-colors"
              title="Hapus"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
