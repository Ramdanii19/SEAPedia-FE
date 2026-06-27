"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { ProcessOrderButton } from "../components/ProcessOrderButton";
import { useSellerIncoming } from "../hooks/useSellerIncoming";

export function SellerIncomingSection() {
  const { orders, isLoading, reload } = useSellerIncoming();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f2f4f6] flex items-center justify-center">
          <ClipboardList size={28} className="text-[#bcc9c6]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#191c1e]">Belum Ada Pesanan Masuk</p>
          <p className="text-sm text-[#6d7a77] mt-1">
            Pesanan dari pembeli akan tampil di sini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#bcc9c6]/30 bg-[#f8f9fb]">
            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
              ID Pesanan
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
              Pembeli
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
              Produk
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
              Total
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
              Tanggal
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide">
              Status
            </th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors"
            >
              <td className="py-3 px-4">
                <Link
                  href={`/seller/orders/${order.id}`}
                  className="text-xs font-mono text-[#00685f] hover:underline"
                >
                  #{order.id.slice(-8).toUpperCase()}
                </Link>
              </td>
              <td className="py-3 px-4 text-sm text-[#3d4947]">
                {/* buyer name not always in payload — fallback */}
                {(order as any).buyerName ?? "—"}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-col gap-0.5">
                  {order.items.slice(0, 2).map((item, i) => (
                    <span key={i} className="text-sm text-[#3d4947] truncate max-w-[180px]">
                      {item.quantity}× {item.productName}
                    </span>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-xs text-[#6d7a77]">
                      +{order.items.length - 2} lainnya
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-sm font-semibold text-[#191c1e]">
                {formatRupiah(order.finalTotal)}
              </td>
              <td className="py-3 px-4 text-xs text-[#6d7a77]">
                {formatDate(order.createdAt)}
              </td>
              <td className="py-3 px-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="py-3 px-4 text-right">
                <ProcessOrderButton
                  orderId={order.id}
                  status={order.status}
                  onProcessed={reload}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
