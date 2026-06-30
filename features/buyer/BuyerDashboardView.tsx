"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Truck,
  Heart,
  Package,
  Clock,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { ORDER_STATUS } from "@/lib/enums";
import { Order } from "@/features/checkout/types/order.types";
import orderService from "@/features/checkout/service/order.service";
import walletService from "@/features/wallet/service/wallet.service";
import cartService from "@/features/cart/service/cart.service";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

export function BuyerDashboardView() {
  const [balance, setBalance] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [walletRes, cartRes, ordersRes] = await Promise.allSettled([
          walletService.getWallet(),
          cartService.getCart(),
          orderService.listMyOrders(),
        ]);

        if (walletRes.status === "fulfilled")
          setBalance(walletRes.value.data.wallet?.balance ?? 0);

        if (cartRes.status === "fulfilled")
          setCartCount(cartRes.value.data.totalItems ?? 0);

        if (ordersRes.status === "fulfilled") {
          const d = ordersRes.value.data as any;
          setOrders(Array.isArray(d) ? d : d?.orders ?? []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const totalOrders = orders.length;
  const delivering = orders.filter((o) => o.status === ORDER_STATUS.DELIVERING).length;
  const completed = orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length;

  return (
    <main className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#191c1e]">Dashboard</h1>
        <p className="text-sm text-[#6d7a77] mt-1">Selamat datang di Seapedia!</p>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/"
          className="rounded-xl bg-[#00685f] p-4 flex flex-col gap-4 hover:bg-[#005049] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Search size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Cari Produk</p>
            <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
              Temukan kebutuhan maritim terbaik
            </p>
          </div>
        </Link>

        <Link
          href="/cart"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <ShoppingCart size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Lihat Keranjang</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">
              {isLoading ? "Memuat..." : `${cartCount} item menunggu pembayaran`}
            </p>
          </div>
        </Link>

        <Link
          href="/orders"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Truck size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Lacak Paket</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">
              Cek status pengiriman Anda
            </p>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Heart size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Wishlist</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">
              Produk favorit Anda
            </p>
          </div>
        </Link>
      </div>

      {/* Wallet + order stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Wallet card */}
        <div className="lg:col-span-1 rounded-xl bg-[#00685f] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
              Saldo Dompet
            </p>
            <Wallet size={16} className="text-white/60" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {isLoading ? "Rp —" : formatRp(balance ?? 0)}
          </p>
          <div className="flex gap-2">
            <Link
              href="/wallet"
              className="flex-1 text-center text-xs font-semibold text-[#00685f] bg-white hover:bg-white/90 rounded-lg px-3 py-2 transition-colors"
            >
              Isi Saldo
            </Link>
            <Link
              href="/wallet"
              className="flex-1 text-center text-xs font-semibold text-white border border-white/40 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
            >
              Riwayat
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#e8f4f3] flex items-center justify-center">
              <Package size={20} className="text-[#00685f]" />
            </div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {isLoading ? "—" : totalOrders}
            </p>
            <p className="text-xs text-[#6d7a77] text-center">Total Pesanan</p>
          </div>

          <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#fde8e6] flex items-center justify-center">
              <Clock size={20} className="text-[#cc4636]" />
            </div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {isLoading ? "—" : delivering}
            </p>
            <p className="text-xs text-[#6d7a77] text-center">Sedang Dikirim</p>
          </div>

          <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#e5f4ec] flex items-center justify-center">
              <CheckCircle2 size={20} className="text-[#2e7d32]" />
            </div>
            <p className="text-2xl font-bold text-[#191c1e]">
              {isLoading ? "—" : completed}
            </p>
            <p className="text-xs text-[#6d7a77] text-center">Selesai</p>
          </div>
        </div>
      </div>
    </main>
  );
}
