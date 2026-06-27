"use client";

import Link from "next/link";
import { Store, ArrowLeft, RefreshCw } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { DELIVERY_METHOD_LABEL } from "@/lib/labels";
import { PriceSummary } from "../components/PriceSummary";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTimeline } from "../components/OrderTimeline";
import { useOrderDetail } from "../hooks/useOrderDetail";

type Props = {
  id: string;
  backHref?: string;
  backLabel?: string;
  headerSlot?: (order: import("../types/order.types").Order, reload: () => void) => React.ReactNode;
};

export function OrderDetailSection({ id, backHref = "/orders", backLabel = "Kembali", headerSlot }: Props) {
  const { order, isLoading, error, reload } = useOrderDetail(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[#cc4636]">{error ?? "Pesanan tidak ditemukan."}</p>
        <Link href="/orders" className="mt-3 block text-sm text-[#00685f] hover:underline">
          Kembali ke daftar pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Back + optional header action */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-sm text-[#6d7a77] hover:text-[#191c1e]"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </Link>
        {order && headerSlot?.(order, reload)}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#6d7a77] mb-1">Pesanan #{order.id}</p>
          <p className="text-xs text-[#6d7a77]">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Store */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#00685f] flex items-center justify-center shrink-0">
          <Store size={15} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-[#6d7a77]">Toko</p>
          <p className="text-sm font-semibold text-[#191c1e]">
            {order.store?.storeName ?? "—"}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-[#6d7a77]">Metode Kirim</p>
          <p className="text-sm font-medium text-[#191c1e]">
            {DELIVERY_METHOD_LABEL[order.deliveryMethod] ?? order.deliveryMethod}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        <p className="text-sm font-semibold text-[#191c1e] px-4 py-3 border-b border-[#bcc9c6]/30">
          Produk ({order.items.length})
        </p>
        <div className="divide-y divide-[#bcc9c6]/30">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#191c1e] truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-[#6d7a77]">
                  {item.quantity}× {formatRupiah(item.price)}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#191c1e] shrink-0 ml-4">
                {formatRupiah(item.subtotal)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
        <p className="text-sm font-semibold text-[#191c1e] mb-4">Rincian Pembayaran</p>
        <PriceSummary
          subtotal={order.subtotal}
          discountAmount={order.discountAmount}
          deliveryFee={order.deliveryFee}
          ppnAmount={order.ppnAmount}
          finalTotal={order.finalTotal}
        />
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#191c1e]">Riwayat Status</p>
          <button
            onClick={reload}
            className="flex items-center gap-1 text-xs text-[#6d7a77] hover:text-[#00685f] transition-colors"
            title="Segarkan status"
          >
            <RefreshCw size={12} />
            Segarkan
          </button>
        </div>
        <OrderTimeline history={order.statusHistory} />
      </div>
    </div>
  );
}
