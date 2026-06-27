"use client";

import { Home, ShoppingCart, ClipboardList, Bell, User } from "lucide-react";
import { RouteGuard } from "@/features/auth";
import { DashboardShell, DashboardMenuItem } from "@/components/layout";

const MENU: DashboardMenuItem[] = [
  { label: "Beranda",      href: "/",              icon: <Home size={18} /> },
  { label: "Keranjang",    href: "/cart",          icon: <ShoppingCart size={18} /> },
  { label: "Pesanan Saya", href: "/orders",        icon: <ClipboardList size={18} /> },
  { label: "Notifikasi",   href: "/notifications", icon: <Bell size={18} /> },
  { label: "Profil",       href: "/profile",       icon: <User size={18} /> },
];

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allow={["BUYER"]}>
      <DashboardShell menu={MENU}>{children}</DashboardShell>
    </RouteGuard>
  );
}
