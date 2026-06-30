"use client";

import Link from "next/link";
import Image from "next/image";
import { Store, Package } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { ORDER_STATUS } from "@/lib/enums";
import { Order } from "../types/order.types";
import { OrderStatusBadge } from "./OrderStatusBadge";

type Props = { order: Order };

function buildInvNumber(order: Order): string {
  const d = new Date(order.createdAt);
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const seq = order._id.slice(-3).toUpperCase();
  return `INV/${ymd}/SEA/${seq}`;
}

function ActionButton({ order }: { order: Order }) {
  if (order.status === ORDER_STATUS.DELIVERING) {
    return (
      <Link
        href={`/orders/${order._id}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#191c1e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2d3330] transition-colors"
      >
        Lacak Paket
      </Link>
    );
  }
  if (order.status === ORDER_STATUS.PACKING || order.status === ORDER_STATUS.WAITING_DELIVERY) {
    return (
      <Link
        href={`/orders/${order._id}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#bcc9c6]/60 px-4 py-2 text-xs font-semibold text-[#3d4947] hover:bg-[#f2f4f6] transition-colors"
      >
        Hubungi Penjual
      </Link>
    );
  }
  return (
    <Link
      href={`/orders/${order._id}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#bcc9c6]/60 px-4 py-2 text-xs font-semibold text-[#3d4947] hover:bg-[#f2f4f6] transition-colors"
    >
      Detail Pesanan
    </Link>
  );
}

export function OrderCard({ order }: Props) {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;
  const invNumber = buildInvNumber(order);

  const orderDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#bcc9c6]/30">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-md bg-[#00685f]/10 flex items-center justify-center shrink-0">
            <Store size={12} className="text-[#00685f]" />
          </div>
          <span className="text-sm font-semibold text-[#191c1e] truncate">
            {order.store?.storeName ?? "Toko"}
          </span>
          <span className="shrink-0 inline-flex items-center rounded-full bg-[#00685f]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00685f]">
            PENJUAL TERVERIFIKASI
          </span>
        </div>
        <span className="shrink-0 text-xs text-[#00685f] font-mono">{invNumber}</span>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Product row */}
      <div className="flex items-center gap-4 px-4 py-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg bg-[#f2f4f6] overflow-hidden shrink-0 flex items-center justify-center">
          {firstItem?.product?.imageUrl ? (
            <Image
              src={firstItem.product.imageUrl}
              alt={firstItem.productName}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <Package size={22} className="text-[#bcc9c6]" />
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#191c1e] truncate">
            {firstItem?.productName ?? "—"}
          </p>
          <p className="text-xs text-[#6d7a77] mt-0.5">
            {firstItem ? `${firstItem.quantity} barang × ${formatRupiah(firstItem.price)}` : ""}
          </p>
          {extraCount > 0 && (
            <p className="text-xs text-[#6d7a77] mt-0.5">+{extraCount} produk lainnya</p>
          )}
          <p className="text-xs text-[#bcc9c6] mt-1">Dipesan pada {orderDate}</p>
        </div>

        {/* Total + action */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-[11px] text-[#6d7a77]">Total Belanja</p>
            <p className="text-base font-bold text-[#00685f]">{formatRupiah(order.finalTotal)}</p>
          </div>
          <ActionButton order={order} />
        </div>
      </div>
    </div>
  );
}
