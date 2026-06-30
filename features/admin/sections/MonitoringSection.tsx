"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Package,
  AlertTriangle,
  Tag,
  BarChart2,
  Truck,
  ChevronRight,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { DataTable, Column } from "../components/DataTable";
import { MonitoringTabs } from "../components/MonitoringTabs";
import { MonitoringTab, useMonitoring } from "../hooks/useMonitoring";

const COLUMNS: Record<MonitoringTab, Column[]> = {
  users: [
    { key: "fullName",   header: "Nama" },
    { key: "email",      header: "Email" },
    { key: "roles",      header: "Roles", render: (v) => Array.isArray(v) ? v.join(", ") : v },
    { key: "createdAt",  header: "Dibuat", render: (v) => formatDate(v) },
  ],
  stores: [
    { key: "storeName",  header: "Nama Toko" },
    { key: "seller",     header: "Pemilik", render: (v) => v?.fullName ?? "—" },
    { key: "createdAt",  header: "Dibuat", render: (v) => formatDate(v) },
  ],
  products: [
    { key: "name",       header: "Produk" },
    { key: "store",      header: "Toko", render: (v) => v?.storeName ?? "—" },
    { key: "price",      header: "Harga", render: (v) => formatRupiah(v) },
    { key: "stock",      header: "Stok" },
  ],
  orders: [
    { key: "_id",        header: "ID", render: (v) => `#${String(v).slice(-8).toUpperCase()}` },
    { key: "buyer",      header: "Pembeli", render: (v) => v?.fullName ?? "—" },
    { key: "store",      header: "Toko", render: (v) => v?.storeName ?? "—" },
    { key: "status",     header: "Status" },
    { key: "finalTotal", header: "Total", render: (v) => formatRupiah(v) },
    { key: "createdAt",  header: "Tanggal", render: (v) => formatDate(v) },
  ],
  vouchers: [
    { key: "code",           header: "Kode" },
    { key: "name",           header: "Nama" },
    { key: "discountType",   header: "Tipe" },
    { key: "discountValue",  header: "Nilai", render: (v, row) => row.discountType === "PERCENTAGE" ? `${v}%` : formatRupiah(v) },
    { key: "remainingUsage", header: "Sisa" },
    { key: "expiryDate",     header: "Kedaluwarsa", render: (v) => formatDate(v) },
  ],
  promos: [
    { key: "code",           header: "Kode" },
    { key: "name",           header: "Nama" },
    { key: "discountType",   header: "Tipe" },
    { key: "discountValue",  header: "Nilai", render: (v, row) => row.discountType === "PERCENTAGE" ? `${v}%` : formatRupiah(v) },
    { key: "remainingUsage", header: "Sisa" },
    { key: "expiryDate",     header: "Kedaluwarsa", render: (v) => formatDate(v) },
  ],
  deliveries: [
    { key: "_id",     header: "ID", render: (v) => `#${String(v).slice(-8).toUpperCase()}` },
    { key: "order",   header: "Order ID", render: (v) => v?._id ? `#${String(v._id).slice(-8).toUpperCase()}` : "—" },
    { key: "driver",  header: "Driver", render: (v) => v?.fullName ?? "—" },
    { key: "status",  header: "Status" },
    { key: "earning", header: "Penghasilan", render: (v) => formatRupiah(v) },
    { key: "takenAt", header: "Diambil", render: (v) => v ? formatDate(v) : "—" },
  ],
  overdue: [
    { key: "_id",        header: "ID", render: (v) => `#${String(v).slice(-8).toUpperCase()}` },
    { key: "buyer",      header: "Pembeli", render: (v) => v?.fullName ?? "—" },
    { key: "store",      header: "Toko", render: (v) => v?.storeName ?? "—" },
    { key: "status",     header: "Status" },
    { key: "finalTotal", header: "Total", render: (v) => formatRupiah(v) },
    { key: "createdAt",  header: "Tanggal", render: (v) => formatDate(v) },
  ],
};

const EMPTY_TEXT: Record<MonitoringTab, string> = {
  users: "Belum ada pengguna.",
  stores: "Belum ada toko.",
  products: "Belum ada produk.",
  orders: "Belum ada pesanan.",
  vouchers: "Belum ada voucher.",
  promos: "Belum ada promo.",
  deliveries: "Belum ada job pengiriman.",
  overdue: "Tidak ada pesanan overdue.",
};

export function MonitoringSection() {
  const [activeTab, setActiveTab] = useState<MonitoringTab>("orders");
  const { getTab, ensureLoaded } = useMonitoring();

  useEffect(() => {
    ensureLoaded(activeTab);
  }, [activeTab]);

  useEffect(() => {
    ensureLoaded("users");
    ensureLoaded("orders");
    ensureLoaded("products");
    ensureLoaded("overdue");
  }, []);

  const usersTab   = getTab("users");
  const ordersTab  = getTab("orders");
  const productsTab = getTab("products");
  const overdueTab = getTab("overdue");
  const currentTab = getTab(activeTab);

  return (
    <div className="flex flex-col gap-6">

      {/* Quick action cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/users"
          className="rounded-xl bg-[#00685f] p-4 flex flex-col gap-4 hover:bg-[#005049] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Pengguna</p>
            <p className="text-xs text-white/70 mt-0.5 leading-relaxed">Kelola akun pengguna</p>
          </div>
        </Link>

        <Link
          href="/admin/discounts"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Tag size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Diskon</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">Voucher & promo aktif</p>
          </div>
        </Link>

        <Link
          href="/admin/reports"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <BarChart2 size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Laporan</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">Statistik platform</p>
          </div>
        </Link>

        <Link
          href="/admin/operations"
          className="rounded-xl bg-[#f4f6f5] p-4 flex flex-col gap-4 hover:bg-[#e8edeb] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Truck size={18} className="text-[#6d7a77]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">Operasional</p>
            <p className="text-xs text-[#6d7a77] mt-0.5 leading-relaxed">Pengiriman & operasi</p>
          </div>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
          <div className="w-11 h-11 rounded-full bg-[#bee5fd] flex items-center justify-center">
            <Users size={20} className="text-[#3d6377]" />
          </div>
          <p className="text-2xl font-bold text-[#191c1e]">
            {usersTab.total ?? "—"}
          </p>
          <p className="text-xs text-[#6d7a77] text-center">Total Pengguna</p>
        </div>

        <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
          <div className="w-11 h-11 rounded-full bg-[#e8f4f3] flex items-center justify-center">
            <ShoppingBag size={20} className="text-[#00685f]" />
          </div>
          <p className="text-2xl font-bold text-[#191c1e]">
            {ordersTab.total ?? "—"}
          </p>
          <p className="text-xs text-[#6d7a77] text-center">Total Pesanan</p>
        </div>

        <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
          <div className="w-11 h-11 rounded-full bg-[#89f5e7]/30 flex items-center justify-center">
            <Package size={20} className="text-[#00685f]" />
          </div>
          <p className="text-2xl font-bold text-[#191c1e]">
            {productsTab.total ?? "—"}
          </p>
          <p className="text-xs text-[#6d7a77] text-center">Total Produk</p>
        </div>

        <div className="rounded-xl bg-white border border-[#bcc9c6]/40 p-5 flex flex-col items-center justify-center gap-2">
          <div className="w-11 h-11 rounded-full bg-[#ffdad4] flex items-center justify-center">
            <AlertTriangle size={20} className="text-[#aa2e21]" />
          </div>
          <p className="text-2xl font-bold text-[#191c1e]">
            {overdueTab.total ?? "—"}
          </p>
          <p className="text-xs text-[#6d7a77] text-center">Pesanan Overdue</p>
        </div>
      </div>

      {/* Data table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#191c1e]">Data Platform</p>
          {currentTab.total !== null && (
            <span className="text-xs text-[#6d7a77]">{currentTab.total} entri</span>
          )}
        </div>

        <MonitoringTabs active={activeTab} onChange={setActiveTab} />

        {currentTab.error ? (
          <div className="flex flex-col items-center py-12 gap-3 text-center rounded-xl border border-[#bcc9c6]/40 bg-white">
            <div className="w-12 h-12 rounded-full bg-[#ffdad4] flex items-center justify-center">
              <AlertTriangle size={20} className="text-[#aa2e21]" />
            </div>
            <p className="text-sm text-[#cc4636]">{currentTab.error}</p>
          </div>
        ) : (
          <DataTable
            columns={COLUMNS[activeTab]}
            rows={currentTab.data ?? []}
            isLoading={currentTab.isLoading || currentTab.data === null}
            emptyText={EMPTY_TEXT[activeTab]}
          />
        )}
      </div>
    </div>
  );
}
