"use client";

import { LayoutDashboard, Briefcase, BarChart2, User, Settings } from "lucide-react";
import { RouteGuard } from "@/features/auth";
import { DashboardShell, DashboardMenuItem } from "@/components/layout";

const MENU: DashboardMenuItem[] = [
  { label: "Dashboard",            href: "/driver",          icon: <LayoutDashboard size={18} /> },
  { label: "Pekerjaan Tersedia",   href: "/driver/jobs",     icon: <Briefcase size={18} /> },
  { label: "Riwayat & Penghasilan",href: "/driver/history",  icon: <BarChart2 size={18} /> },
  { label: "Profil",               href: "/profile",         icon: <User size={18} /> },
  { label: "Pengaturan",           href: "/driver/settings", icon: <Settings size={18} /> },
];

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allow={["DRIVER"]}>
      <DashboardShell menu={MENU}>{children}</DashboardShell>
    </RouteGuard>
  );
}
