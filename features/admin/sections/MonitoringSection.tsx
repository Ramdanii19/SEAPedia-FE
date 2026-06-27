"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/features/report/components/StatCard";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatDate } from "@/utils/formatDate";
import { DataTable, Column } from "../components/DataTable";
import { MonitoringTabs } from "../components/MonitoringTabs";
import { MonitoringTab, useMonitoring } from "../hooks/useMonitoring";

const COLUMNS: Record<MonitoringTab, Column[]> = {
  users: [
    { key: "name", header: "Nama" },
    { key: "email", header: "Email" },
    { key: "roles", header: "Roles", render: (v) => Array.isArray(v) ? v.join(", ") : v },
    { key: "createdAt", header: "Dibuat", render: (v) => formatDate(v) },
  ],
  stores: [
    { key: "storeName", header: "Nama Toko" },
    { key: "ownerName", header: "Pemilik" },
    { key: "createdAt", header: "Dibuat", render: (v) => formatDate(v) },
  ],
  products: [
    { key: "name", header: "Produk" },
    { key: "storeName", header: "Toko" },
    { key: "price", header: "Harga", render: (v) => formatRupiah(v) },
    { key: "stock", header: "Stok" },
  ],
  orders: [
    { key: "id", header: "ID", render: (v) => `#${String(v).slice(-8).toUpperCase()}` },
    { key: "buyerName", header: "Pembeli" },
    { key: "storeName", header: "Toko" },
    { key: "status", header: "Status" },
    { key: "finalTotal", header: "Total", render: (v) => formatRupiah(v) },
    { key: "createdAt", header: "Tanggal", render: (v) => formatDate(v) },
  ],
  vouchers: [
    { key: "code", header: "Kode" },
    { key: "name", header: "Nama" },
    { key: "discountType", header: "Tipe" },
    { key: "discountValue", header: "Nilai", render: (v, row) => row.discountType === "PERCENTAGE" ? `${v}%` : formatRupiah(v) },
    { key: "remainingUsage", header: "Sisa" },
    { key: "expiryDate", header: "Kedaluwarsa", render: (v) => formatDate(v) },
  ],
  promos: [
    { key: "code", header: "Kode" },
    { key: "name", header: "Nama" },
    { key: "discountType", header: "Tipe" },
    { key: "discountValue", header: "Nilai", render: (v, row) => row.discountType === "PERCENTAGE" ? `${v}%` : formatRupiah(v) },
    { key: "remainingUsage", header: "Sisa" },
    { key: "expiryDate", header: "Kedaluwarsa", render: (v) => formatDate(v) },
  ],
  deliveries: [
    { key: "id", header: "ID", render: (v) => `#${String(v).slice(-8).toUpperCase()}` },
    { key: "orderId", header: "Order ID", render: (v) => `#${String(v).slice(-8).toUpperCase()}` },
    { key: "driverName", header: "Driver" },
    { key: "status", header: "Status" },
    { key: "earning", header: "Penghasilan", render: (v) => formatRupiah(v) },
    { key: "takenAt", header: "Diambil", render: (v) => v ? formatDate(v) : "—" },
  ],
  overdue: [
    { key: "id", header: "ID", render: (v) => `#${String(v).slice(-8).toUpperCase()}` },
    { key: "buyerName", header: "Pembeli" },
    { key: "storeName", header: "Toko" },
    { key: "status", header: "Status" },
    { key: "finalTotal", header: "Total", render: (v) => formatRupiah(v) },
    { key: "createdAt", header: "Tanggal", render: (v) => formatDate(v) },
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
  const [activeTab, setActiveTab] = useState<MonitoringTab>("users");
  const { getTab, ensureLoaded } = useMonitoring();

  useEffect(() => {
    ensureLoaded(activeTab);
  }, [activeTab]);

  // Load users tab on mount for summary stats
  useEffect(() => {
    ensureLoaded("users");
    ensureLoaded("orders");
  }, []);

  const usersTab = getTab("users");
  const ordersTab = getTab("orders");
  const currentTab = getTab(activeTab);

  function handleTabChange(tab: MonitoringTab) {
    setActiveTab(tab);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={usersTab.data ? String(usersTab.data.length) : "—"}
          hint="Semua pengguna terdaftar"
        />
        <StatCard
          label="Total Orders"
          value={ordersTab.data ? String(ordersTab.data.length) : "—"}
          hint="Semua pesanan"
        />
        <StatCard
          label="Tab Aktif"
          value={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          hint={currentTab.data ? `${currentTab.data.length} entri` : "Memuat..."}
        />
        <StatCard
          label="Overdue"
          value={getTab("overdue").data ? String(getTab("overdue").data!.length) : "—"}
          hint="Pesanan terlambat"
        />
      </div>

      {/* Tabs */}
      <MonitoringTabs active={activeTab} onChange={handleTabChange} />

      {/* Table */}
      {currentTab.error ? (
        <p className="text-sm text-[#cc4636] text-center py-4">{currentTab.error}</p>
      ) : (
        <DataTable
          columns={COLUMNS[activeTab]}
          rows={currentTab.data ?? []}
          isLoading={currentTab.isLoading || currentTab.data === null}
          emptyText={EMPTY_TEXT[activeTab]}
        />
      )}
    </div>
  );
}
