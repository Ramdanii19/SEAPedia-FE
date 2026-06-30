"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LayoutDashboard, User, RefreshCw, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCartItemCount } from "@/features/cart/contexts/CartContext";
import { RoleBadge } from "@/features/auth/components/RoleBadge";
import { Role } from "@/features/auth/types/auth.types";
import { roleHome } from "@/utils/roleHome";

const NAV_LINKS = [
  { href: "/products", label: "Katalog" },
  { href: "/promo", label: "Promo" },
  { href: "/bantuan", label: "Bantuan" },
];

export function Navbar() {
  const { user, activeRole, isLoading } = useAuth();
  const { logout, isLoggingOut } = useLogout();
  const cartCount = useCartItemCount();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = activeRole as unknown as Role | null;
  const dashboardHref = roleHome(role);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#bcc9c6]/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-[#00685f] shrink-0">
          SEAPEDIA
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-6">
          {/* Dashboard link jika sudah login */}
          {!isLoading && user && (
            <Link
              href={dashboardHref}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#00685f] hover:text-[#005049] transition-colors"
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
          )}
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[#3d4947] hover:text-[#00685f] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions — desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!isLoading && user ? (
            <>
              {/* Keranjang — hanya BUYER */}
              {role === "BUYER" && (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-lg text-[#3d4947] hover:bg-[#f2f4f6] transition-colors"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#cc4636] text-[10px] font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Role badge — display only */}
              {role && <RoleBadge role={role} active />}

              {/* Dropdown profil */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#e8f5f3] hover:bg-[#d0eeea] transition-colors"
                  aria-label="Menu profil"
                >
                  <User size={18} className="text-[#00685f]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#bcc9c6]/30 shadow-lg py-1 z-50">
                    {/* User info */}
                    <div className="px-4 py-2.5 border-b border-[#bcc9c6]/30">
                      <p className="text-xs font-semibold text-[#191c1e] truncate">{user.name}</p>
                      <p className="text-xs text-[#6d7a77] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-[#f2f4f6] transition-colors"
                    >
                      <User size={15} className="text-[#6d7a77]" />
                      Profil Saya
                    </Link>
                    <Link
                      href="/select-role?switch=true"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-[#f2f4f6] transition-colors"
                    >
                      <RefreshCw size={15} className="text-[#6d7a77]" />
                      Ganti Peran
                    </Link>
                    <div className="border-t border-[#bcc9c6]/30 my-1" />
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <LogOut size={15} />
                      {isLoggingOut ? "Keluar..." : "Keluar"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={isLoading ? "invisible flex items-center gap-3" : "flex items-center gap-3"}>
              <Link
                href="/login"
                className="text-sm font-medium text-[#3d4947] hover:text-[#00685f] transition-colors px-3 py-1.5"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-[#00685f] hover:bg-[#005049] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#3d4947] hover:bg-[#f2f4f6] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#bcc9c6]/30 px-4 py-4 flex flex-col gap-3">
          {!isLoading && user && (
            <Link
              href={dashboardHref}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[#00685f]"
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
          )}
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-[#3d4947] py-1"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-[#bcc9c6]/30 pt-3 flex flex-col gap-2">
            {!isLoading && user ? (
              <>
                {role && <RoleBadge role={role} active />}
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-sm text-[#3d4947] py-1 flex items-center gap-2"><User size={14} />Profil Saya</Link>
                <Link href="/select-role?switch=true" onClick={() => setMobileOpen(false)} className="text-sm text-[#3d4947] py-1 flex items-center gap-2"><RefreshCw size={14} />Ganti Peran</Link>
                {role === "BUYER" && (
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className="text-sm text-[#3d4947] py-1 flex items-center gap-2"><ShoppingCart size={14} />Keranjang</Link>
                )}
                <button onClick={() => { setMobileOpen(false); logout(); }} className="text-sm text-red-600 py-1 text-left flex items-center gap-2"><LogOut size={14} />{isLoggingOut ? "Keluar..." : "Keluar"}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-center py-2 border border-[#bcc9c6] rounded-lg text-[#3d4947]">Masuk</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-center py-2 bg-[#00685f] text-white rounded-lg">Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
