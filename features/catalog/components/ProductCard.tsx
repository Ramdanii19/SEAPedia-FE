"use client";

import Link from "next/link";
import { Heart, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/features/auth/types/auth.types";
import { formatRupiah } from "@/utils/formatRupiah";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { Product } from "../types/catalog.types";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { user, activeRole } = useAuth();
  const isBuyer = !!user && (activeRole as unknown as Role) === "BUYER";
  const { ids, toggle } = useWishlist();
  const productId = product._id;
  const isWishlisted = ids.has(productId);

  return (
    <Card className="p-0 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Image */}
      <Link
        href={`/products/${product._id}`}
        className="relative block aspect-square overflow-hidden rounded-t-xl bg-[#f2f4f6]"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-[#bcc9c6]">Tidak ada gambar</span>
          </div>
        )}
        {/* Toko Terverifikasi badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 backdrop-blur-sm">
          <BadgeCheck size={11} className="shrink-0 text-[#00685f]" />
          <span className="text-[10px] font-medium text-[#00685f]">
            Toko Terverifikasi
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Name + wishlist */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product._id}`}
            className="flex-1 text-sm font-semibold leading-snug text-[#191c1e] line-clamp-2 hover:text-[#00685f] transition-colors"
          >
            {product.name}
          </Link>
          {isBuyer && (
            <button
              onClick={(e) => { e.preventDefault(); toggle(productId); }}
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-[#fde8e6] transition-colors"
              title={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
            >
              <Heart
                size={13}
                className={isWishlisted ? "text-[#e53935] fill-[#e53935]" : "text-[#6d7a77]"}
              />
            </button>
          )}
        </div>

        {/* Price */}
        <p className="text-lg font-bold leading-tight text-[#00685f]">
          {formatRupiah(product.price)}
        </p>

        {/* Store — tegaskan multi-toko */}
        <p className="text-xs text-[#6d7a77]">
          Oleh:{" "}
          <span className="font-medium text-[#3d4947]">
            {product.store.storeName}
          </span>
        </p>

        {/* CTA — hanya tampil untuk guest */}
        {!isBuyer && (
          <Link
            href="/login"
            className="mt-auto block rounded-lg border border-[#bcc9c6] pt-2 text-center text-xs font-medium text-[#3d4947] transition-colors hover:bg-[#f2f4f6] py-2"
          >
            Masuk untuk belanja
          </Link>
        )}
      </div>
    </Card>
  );
}
