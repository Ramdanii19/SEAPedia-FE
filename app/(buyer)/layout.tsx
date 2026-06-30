"use client";

import { LayoutDashboard, ClipboardList, MapPin, Wallet, Heart, ShoppingCart } from "lucide-react";
import { RouteGuard } from "@/features/auth";
import { DashboardShell, DashboardMenuItem } from "@/components/layout";

const MENU: DashboardMenuItem[] = [
  { label: "Dashboard",    href: "/",          icon: <LayoutDashboard size={18} /> },
  { label: "Keranjang",    href: "/cart",      icon: <ShoppingCart size={18} /> },
  { label: "Pesanan Saya", href: "/orders",    icon: <ClipboardList size={18} /> },
  { label: "Alamat",       href: "/address",   icon: <MapPin size={18} /> },
  { label: "Dompet",       href: "/wallet",    icon: <Wallet size={18} /> },
  { label: "Wishlist",     href: "/wishlist",  icon: <Heart size={18} /> },
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
