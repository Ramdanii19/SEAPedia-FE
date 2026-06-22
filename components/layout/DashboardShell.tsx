"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RoleBadge } from "@/features/auth/components/RoleBadge";
import { Role } from "@/features/auth/types/auth.types";

export type DashboardMenuItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

type SidebarNavProps = {
  menu: DashboardMenuItem[];
  pathname: string;
  onNavigate?: () => void;
};

function SidebarNav({ menu, pathname, onNavigate }: SidebarNavProps) {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {menu.map(({ label, href, icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href + label}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#00685f] text-white"
                  : "text-[#3d4947] hover:bg-[#f0f5f4] hover:text-[#00685f]"
              }`}
            >
              {icon && (
                <span
                  className={`shrink-0 ${isActive ? "text-white" : "text-[#6d7a77]"}`}
                >
                  {icon}
                </span>
              )}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Help card */}
      <div className="mx-3 mb-4 rounded-xl bg-[#f0f5f4] p-3">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#6d7a77]">
          Pusat Bantuan
        </p>
        <p className="mb-3 text-[11px] leading-relaxed text-[#6d7a77]">
          Butuh bantuan mengelola akun Anda?
        </p>
        <button className="w-full rounded-lg bg-[#00685f] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#005049]">
          Hubungi CS
        </button>
      </div>
    </div>
  );
}

type Props = {
  menu: DashboardMenuItem[];
  children: ReactNode;
};

export function DashboardShell({ menu, children }: Props) {
  const { user, activeRole } = useAuth();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const role = activeRole as unknown as Role | null;
  const displayName = (user as any)?.fullName ?? user?.name ?? "U";
  const initial = displayName[0]?.toUpperCase() ?? "U";

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fb]">
      {/* Dashboard header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-[#bcc9c6]/30 bg-white px-4 shadow-sm md:px-6">
        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 text-[#3d4947] transition-colors hover:bg-[#f2f4f6] md:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo + role badge */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            href="/"
            className="text-lg font-bold tracking-tighter text-[#00685f]"
          >
            SEAPEDIA
          </Link>
          {role && <RoleBadge role={role} active />}
        </div>

        {/* Search — desktop */}
        <div className="mx-4 hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a77]"
            />
            <input
              type="text"
              placeholder="Cari pesanan atau produk..."
              className="w-full rounded-lg border border-transparent bg-[#f2f4f6] py-2 pl-8 pr-4 text-sm transition-colors focus:border-[#00685f]/40 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button className="rounded-lg p-2 text-[#3d4947] transition-colors hover:bg-[#f2f4f6]">
            <Bell size={20} />
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00685f] text-xs font-bold text-white">
            {initial}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop */}
        <aside className="hidden w-56 shrink-0 flex-col overflow-y-auto border-r border-[#bcc9c6]/30 bg-white md:flex">
          <SidebarNav menu={menu} pathname={pathname} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-2xl">
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#bcc9c6]/30 px-4">
                <Link
                  href="/"
                  className="text-lg font-bold tracking-tighter text-[#00685f]"
                  onClick={() => setDrawerOpen(false)}
                >
                  SEAPEDIA
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-[#3d4947] transition-colors hover:bg-[#f2f4f6]"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarNav
                  menu={menu}
                  pathname={pathname}
                  onNavigate={() => setDrawerOpen(false)}
                />
              </div>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
