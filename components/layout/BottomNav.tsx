"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, BookOpen, ShoppingCart, ClipboardList, User,
  Package, Store, BarChart2, Briefcase, Shield, Tag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/features/auth/types/auth.types";
import { LucideIcon } from "lucide-react";

type NavItem = { label: string; href: string; Icon: LucideIcon };

const GUEST_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/",         Icon: Home },
  { label: "Katalog", href: "/products", Icon: BookOpen },
  { label: "Masuk",   href: "/login",    Icon: User },
];

const ROLE_ITEMS: Record<Role, NavItem[]> = {
  BUYER: [
    { label: "Beranda",  href: "/",          Icon: Home },
    { label: "Katalog",  href: "/products",  Icon: BookOpen },
    { label: "Keranjang",href: "/cart",      Icon: ShoppingCart },
    { label: "Pesanan",  href: "/orders",    Icon: ClipboardList },
    { label: "Profil",   href: "/profile",   Icon: User },
  ],
  SELLER: [
    { label: "Beranda",  href: "/seller",         Icon: Home },
    { label: "Produk",   href: "/seller/products", Icon: Package },
    { label: "Toko",     href: "/seller/store",    Icon: Store },
    { label: "Laporan",  href: "/seller/revenue",  Icon: BarChart2 },
    { label: "Profil",   href: "/profile",         Icon: User },
  ],
  DRIVER: [
    { label: "Beranda", href: "/driver",      Icon: Home },
    { label: "Jobs",    href: "/driver/jobs", Icon: Briefcase },
    { label: "Profil",  href: "/profile",     Icon: User },
  ],
  ADMIN: [
    { label: "Beranda",  href: "/admin",            Icon: Home },
    { label: "Monitor",  href: "/admin",            Icon: Shield },
    { label: "Diskon",   href: "/admin/discounts",  Icon: Tag },
    { label: "Profil",   href: "/profile",          Icon: User },
  ],
};

export function BottomNav() {
  const { user, activeRole, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return null;

  const role = activeRole as unknown as Role | null;
  const items = user && role ? ROLE_ITEMS[role] : GUEST_ITEMS;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#bcc9c6]/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-stretch">
        {items.map(({ label, href, Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href + label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-[#00685f]" : "text-[#6d7a77]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
