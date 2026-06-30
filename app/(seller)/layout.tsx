"use client";

import {
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart2,
  Store,
} from "lucide-react";
import { RouteGuard } from "@/features/auth";
import { DashboardShell, DashboardMenuItem } from "@/components/layout";

const MENU: DashboardMenuItem[] = [
  { label: "Beranda",          href: "/seller",          icon: <LayoutDashboard size={18} />, exact: true },
  { label: "Produk Saya",      href: "/seller/products", icon: <Package size={18} /> },
  { label: "Pesanan",          href: "/seller/orders",   icon: <ClipboardList size={18} /> },
  { label: "Laporan Keuangan", href: "/seller/revenue",  icon: <BarChart2 size={18} /> },
  { label: "Profil Toko",      href: "/seller/store",    icon: <Store size={18} /> },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allow={["SELLER"]}>
      <DashboardShell menu={MENU}>{children}</DashboardShell>
    </RouteGuard>
  );
}
