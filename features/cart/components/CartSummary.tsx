"use client";

import { Tag, ShieldCheck, ArrowRight } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";

type Props = {
  subtotal: number;
  itemCount: number;
  discount: number;
  onCheckout: () => void;
  disabled?: boolean;
};

export function CartSummary({ subtotal, itemCount, discount, onCheckout, disabled }: Props) {
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-[#bcc9c6]/30">
        <p className="text-base font-bold text-[#191c1e]">Ringkasan Belanja</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        {/* Total harga */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6d7a77]">Total Harga ({itemCount} Barang)</span>
          <span className="font-semibold text-[#191c1e]">{formatRupiah(subtotal)}</span>
        </div>

        {/* Diskon */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6d7a77]">Total Diskon</span>
          <span className={`font-semibold ${discount > 0 ? "text-[#cc4636]" : "text-[#191c1e]"}`}>
            -{formatRupiah(discount)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#bcc9c6]/30 pt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-[#191c1e]">Total Tagihan</span>
          <span className="text-lg font-bold text-[#00685f]">{formatRupiah(total)}</span>
        </div>
      </div>

      {/* Promo row */}
      <button className="w-full flex items-center justify-between gap-2 px-5 py-3 border-t border-[#bcc9c6]/30 hover:bg-[#f8f9fb] transition-colors">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-[#00685f]" />
          <span className="text-sm font-medium text-[#00685f]">Makin hemat dengan promo</span>
        </div>
        <ArrowRight size={14} className="text-[#00685f]" />
      </button>

      {/* Checkout button */}
      <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
        <button
          onClick={onCheckout}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ef5b2b] hover:bg-[#d94e22] text-white font-bold py-3 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut ke Checkout
          <ArrowRight size={16} />
        </button>

        <p className="text-center text-[11px] text-[#6d7a77]">
          Harga belum termasuk biaya pengiriman &amp; asuransi.
        </p>

        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="text-[#00685f]" />
          <span className="text-[11px] text-[#6d7a77]">Transaksi Aman &amp; Terenkripsi</span>
        </div>
      </div>
    </div>
  );
}
