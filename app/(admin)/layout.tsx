"use client";

import { LayoutDashboard, Users, Tag, BarChart2, Settings } from "lucide-react";
import { RouteGuard } from "@/features/auth";
import { DashboardShell, DashboardMenuItem } from "@/components/layout";

const MENU: DashboardMenuItem[] = [
  { label: "Dashboard",  href: "/admin",           icon: <LayoutDashboard size={18} /> },
  { label: "Pengguna",   href: "/admin/users",     icon: <Users size={18} /> },
  { label: "Diskon",     href: "/admin/discounts", icon: <Tag size={18} /> },
  { label: "Laporan",    href: "/admin/reports",   icon: <BarChart2 size={18} /> },
  { label: "Pengaturan", href: "/admin/settings",  icon: <Settings size={18} /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allow={["ADMIN"]}>
      <DashboardShell menu={MENU}>{children}</DashboardShell>
    </RouteGuard>
  );
}
