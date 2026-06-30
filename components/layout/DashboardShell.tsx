"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { RoleBadge } from "@/features/auth/components/RoleBadge";
import { Role } from "@/features/auth/types/auth.types";

export type DashboardMenuItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  exact?: boolean;
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
        {menu.map(({ label, href, icon, exact }) => {
          const isActive =
            pathname === href ||
            (!exact && href !== "/" && pathname.startsWith(href + "/"));
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

    </div>
  );
}

type Props = {
  menu: DashboardMenuItem[];
  children: ReactNode;
};

export function DashboardShell({ menu, children }: Props) {
  const { user, activeRole } = useAuth();
  const { logout, isLoggingOut } = useLogout();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const role = activeRole as unknown as Role | null;
  const displayName = (user as any)?.fullName ?? user?.name ?? "U";
  const initial = displayName[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Logo */}
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tighter text-[#00685f]">
          SEAPEDIA
        </Link>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2.5">
          {role && <RoleBadge role={role} active />}

          {/* Avatar dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00685f] text-xs font-bold text-white hover:bg-[#005049] transition-colors"
              aria-label="Menu profil"
            >
              {initial}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#bcc9c6]/30 shadow-lg py-1 z-50">
                <div className="px-4 py-2.5 border-b border-[#bcc9c6]/30">
                  <p className="text-xs font-semibold text-[#191c1e] truncate">{displayName}</p>
                  <p className="text-xs text-[#6d7a77] truncate">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-[#f2f4f6] transition-colors"
                >
                  <User size={15} className="text-[#6d7a77]" />
                  Profil Saya
                </Link>
                <Link
                  href="/select-role?switch=true"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-[#f2f4f6] transition-colors"
                >
                  <RefreshCw size={15} className="text-[#6d7a77]" />
                  Ganti Peran
                </Link>
                <div className="border-t border-[#bcc9c6]/30 my-1" />
                <button
                  onClick={() => { setProfileOpen(false); logout(); }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut size={15} />
                  {isLoggingOut ? "Keluar..." : "Keluar"}
                </button>
              </div>
            )}
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
