import Link from "next/link";
import { ChevronRight, Store } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { Order } from "../types/order.types";
import { OrderStatusBadge } from "./OrderStatusBadge";

type Props = { order: Order };

export function OrderCard({ order }: Props) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-xl border border-[#bcc9c6]/40 bg-white p-4 hover:border-[#00685f]/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Store size={14} className="shrink-0 text-[#6d7a77]" />
          <p className="text-sm font-medium text-[#191c1e] truncate">
            {order.store?.storeName ?? "Toko"}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="text-xs text-[#6d7a77] mb-3">{formatDate(order.createdAt)}</p>

      <div className="flex flex-col gap-1 mb-3">
        {order.items.slice(0, 2).map((item, i) => (
          <p key={i} className="text-sm text-[#3d4947] truncate">
            {item.quantity}× {item.productName}
          </p>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-[#6d7a77]">+{order.items.length - 2} produk lainnya</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#191c1e]">
          {formatRupiah(order.finalTotal)}
        </span>
        <ChevronRight size={16} className="text-[#6d7a77]" />
      </div>
    </Link>
  );
}
