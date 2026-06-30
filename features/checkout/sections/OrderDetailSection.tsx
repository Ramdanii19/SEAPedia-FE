"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, MapPin, Truck, Copy, RefreshCw, ChevronRight, MapPinned, FileDown, Loader2 } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { DELIVERY_METHOD_LABEL } from "@/lib/labels";
import { ORDER_STATUS } from "@/lib/enums";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTimeline } from "../components/OrderTimeline";
import { useOrderDetail } from "../hooks/useOrderDetail";
import { generateInvoicePdf } from "@/utils/generateInvoicePdf";

const STATUS_BANNER: Partial<Record<string, { bg: string; text: string; sub: string }>> = {
  [ORDER_STATUS.ON_DELIVERY]: {
    bg: "bg-[#e6f4f2] border border-[#00685f]/20",
    text: "Pesanan Dalam Pengiriman",
    sub: "Kurir sedang menuju lokasi Anda. Pantau posisi kurir secara real-time.",
  },
  [ORDER_STATUS.PREPARING]: {
    bg: "bg-amber-50 border border-amber-200",
    text: "Pesanan Sedang Dikemas",
    sub: "Penjual sedang menyiapkan dan mengemas pesanan Anda.",
  },
  [ORDER_STATUS.READY_FOR_PICKUP]: {
    bg: "bg-purple-50 border border-purple-200",
    text: "Menunggu Kurir",
    sub: "Pesanan siap dan menunggu kurir menjemput.",
  },
  [ORDER_STATUS.DELIVERED]: {
    bg: "bg-teal-50 border border-teal-200",
    text: "Pesanan Telah Dikirim",
    sub: "Pesanan sudah tiba. Segera konfirmasi jika sudah diterima.",
  },
};

type Props = {
  id: string;
  backHref?: string;
  backLabel?: string;
  headerSlot?: (order: import("../types/order.types").Order, reload: () => void) => React.ReactNode;
};

export function OrderDetailSection({ id, backHref = "/orders", backLabel = "Pesanan Saya", headerSlot }: Props) {
  const { order, isLoading, error, reload } = useOrderDetail(id);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    if (!order) return;
    setIsDownloading(true);
    try {
      await generateInvoicePdf(order);
    } finally {
      setIsDownloading(false);
    }
  }

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

  const banner = STATUS_BANNER[order.status];
  const shortId = order._id.slice(-8).toUpperCase();

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6d7a77]">
        <Link href={backHref} className="hover:text-[#191c1e] transition-colors">
          {backLabel}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#191c1e] font-medium">Detail Pesanan #{shortId}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#191c1e]">Detail Pesanan</h1>
          <p className="text-sm text-[#6d7a77] mt-0.5">
            Dipesan pada {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {headerSlot?.(order, reload)}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 rounded-lg bg-[#00685f] px-3 py-2 text-xs font-medium text-white hover:bg-[#005549] transition-colors disabled:opacity-60"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
            {isDownloading ? "Membuat PDF..." : "Unduh Invoice"}
          </button>
        </div>
      </div>

      {/* Status banner */}
      {banner && (
        <div className={`rounded-xl px-4 py-3 flex items-start gap-3 ${banner.bg}`}>
          <Truck size={18} className="text-[#00685f] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">{banner.text}</p>
            <p className="text-xs text-[#6d7a77] mt-0.5">{banner.sub}</p>
          </div>
        </div>
      )}

      {/* 2-column layout */}
      <div className="flex gap-5 items-start flex-col lg:flex-row">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">

          {/* Store card */}
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00685f] flex items-center justify-center shrink-0">
              <Store size={15} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-[#191c1e]">
                  {order.store?.storeName ?? "—"}
                </p>
                <span className="inline-flex items-center rounded-full bg-[#00685f]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00685f]">
                  Penjual Terverifikasi
                </span>
              </div>
            </div>
            <Link
              href={`/products?store=${(order.store as any)?._id ?? ""}`}
              className="shrink-0 text-xs font-medium text-[#00685f] hover:underline"
            >
              Kunjungi Toko
            </Link>
          </div>

          {/* Product items */}
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
            <div className="divide-y divide-[#bcc9c6]/30">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-14 h-14 rounded-lg bg-[#f2f4f6] overflow-hidden shrink-0 flex items-center justify-center">
                    {item.product?.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.productName}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e5eae9]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#191c1e] truncate">{item.productName}</p>
                    <p className="text-xs text-[#6d7a77] mt-0.5">
                      {item.quantity}× {formatRupiah(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#191c1e] shrink-0">
                    {formatRupiah(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Address + Delivery info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-[#00685f]" />
                <p className="text-xs font-semibold text-[#191c1e] uppercase tracking-wide">Alamat Pengiriman</p>
              </div>
              <p className="text-sm font-medium text-[#191c1e]">{order.shippingRecipientName}</p>
              <p className="text-xs text-[#6d7a77] mt-1 leading-relaxed">{order.shippingAddress}</p>
              {order.shippingPhone && (
                <p className="text-xs text-[#6d7a77] mt-1">({order.shippingPhone})</p>
              )}
            </div>

            <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={14} className="text-[#00685f]" />
                <p className="text-xs font-semibold text-[#191c1e] uppercase tracking-wide">Informasi Pengiriman</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-[#6d7a77]">Kurir</span>
                  <span className="text-xs font-medium text-[#191c1e] text-right">
                    {DELIVERY_METHOD_LABEL[order.deliveryMethod] ?? order.deliveryMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#6d7a77]">No. Resi</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-[#191c1e] font-mono">
                      SEA{shortId}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(`SEA${shortId}`)}
                      className="text-[#6d7a77] hover:text-[#00685f] transition-colors"
                      title="Salin no. resi"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment summary */}
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
            <p className="text-sm font-semibold text-[#191c1e] mb-4">Ringkasan Pembayaran</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6d7a77]">Subtotal untuk Produk</span>
                <span className="text-[#191c1e]">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6d7a77]">Total Ongkos Kirim</span>
                <span className="text-[#191c1e]">{formatRupiah(order.deliveryFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6d7a77]">Diskon</span>
                  <span className="text-[#cc4636]">-{formatRupiah(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6d7a77]">PPN 12%</span>
                <span className="text-[#191c1e]">{formatRupiah(order.ppnAmount)}</span>
              </div>
              <div className="border-t border-[#bcc9c6]/40 pt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#191c1e]">Total Pembayaran</span>
                <span className="text-base font-bold text-[#00685f]">{formatRupiah(order.finalTotal)}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-4 pt-4 border-t border-[#bcc9c6]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#f2f4f6] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#6d7a77]">$</span>
                </div>
                <span className="text-xs font-medium text-[#6d7a77]">Metode Pembayaran</span>
              </div>
              <span className="text-xs font-semibold text-[#191c1e]">Saldo Dompet Seapedia</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#191c1e]">Status Pesanan</p>
              <button
                onClick={reload}
                className="flex items-center gap-1 text-xs text-[#6d7a77] hover:text-[#00685f] transition-colors"
                title="Segarkan status"
              >
                <RefreshCw size={12} />
                Segarkan
              </button>
            </div>

            <OrderTimeline history={order.statusHistory} currentStatus={order.status} />

            {order.status === ORDER_STATUS.ON_DELIVERY && (
              <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-[#bcc9c6]/60 bg-[#f8f9fb] py-2.5 text-xs font-medium text-[#3d4947] hover:bg-[#eef1f0] transition-colors">
                <MapPinned size={13} />
                Lacak Lokasi Real-time
              </button>
            )}
          </div>

          {/* Order ID card */}
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6d7a77]">ID Pesanan</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs font-mono text-[#3d4947] mt-2 break-all">{order._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
