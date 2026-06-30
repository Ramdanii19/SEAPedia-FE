"use client";

import { ClipboardList } from "lucide-react";
import { useMyOrders } from "../hooks/useMyOrders";
import { OrderCard } from "../components/OrderCard";

export function OrderListSection() {
  const { orders, isLoading } = useMyOrders();

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
          <p className="text-base font-semibold text-[#191c1e]">Belum Ada Pesanan</p>
          <p className="text-sm text-[#6d7a77] mt-1">
            Pesanan yang Anda buat akan muncul di sini.
          </p>
        </div>
        <a href="/products" className="text-sm font-medium text-[#00685f] hover:underline">
          Mulai Belanja
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
