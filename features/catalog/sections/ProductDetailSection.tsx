"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, BadgeCheck, ShoppingCart, Heart, Minus, Plus, Info, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/features/auth/types/auth.types";
import { useCart } from "@/features/cart";
import { formatRupiah } from "@/utils/formatRupiah";
import { useProductDetail } from "../hooks/useProductDetail";
import { StoreInfoBlock } from "../components/StoreInfoBlock";

type Props = { id: number };

function Skeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 animate-pulse">
      <div className="h-4 w-64 bg-[#e8eceb] rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-xl bg-[#e8eceb]" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-32 bg-[#e8eceb] rounded" />
          <div className="h-10 bg-[#e8eceb] rounded" />
          <div className="h-8 w-48 bg-[#e8eceb] rounded" />
          <div className="h-24 bg-[#e8eceb] rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSection({ id }: Props) {
  const { product, isLoading, error } = useProductDetail(id);
  const { user, activeRole } = useAuth();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const isBuyer = !!user && (activeRole as unknown as Role) === "BUYER";

  async function handleAddToCart() {
    if (!product) return;
    setIsAdding(true);
    setAddError(null);
    setAddSuccess(false);
    try {
      await add(product.id, qty);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } catch (err: any) {
      setAddError(err?.message ?? "Gagal menambahkan ke keranjang");
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) return <Skeleton />;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <p className="text-lg font-semibold text-[#191c1e]">Produk tidak ditemukan</p>
        <Link href="/products" className="text-sm text-[#00685f] hover:underline">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  const subtotal = product.price * qty;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6d7a77] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#00685f] transition-colors">Beranda</Link>
        <ChevronRight size={13} />
        <Link href="/products" className="hover:text-[#00685f] transition-colors">Katalog Produk</Link>
        <ChevronRight size={13} />
        <span className="text-[#191c1e] line-clamp-1">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left — image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-[#f2f4f6]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[#bcc9c6]">
              Tidak ada gambar
            </div>
          )}
        </div>

        {/* Right — info */}
        <div className="flex flex-col gap-4">
          {/* Verified badge */}
          <div className="flex items-center gap-1.5 w-fit rounded-full bg-[#e8f5f3] px-3 py-1">
            <BadgeCheck size={13} className="text-[#00685f]" />
            <span className="text-xs font-medium text-[#00685f]">Penjual Terverifikasi</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold leading-snug text-[#191c1e]">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-bold text-[#191c1e]">
            {formatRupiah(product.price)}
          </p>

          {/* Description */}
          <div>
            <p className="text-sm font-semibold text-[#191c1e] mb-1.5">Deskripsi Produk</p>
            <p className="text-sm text-[#6d7a77] leading-relaxed">{product.description}</p>
          </div>

          {/* Stock + qty */}
          <div className="border-t border-[#bcc9c6]/30 pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#191c1e]">Atur Jumlah</span>
              <span className="text-[#6d7a77]">
                Stok: <span className="font-medium text-[#191c1e]">{product.stock}</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-[#bcc9c6]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#3d4947] hover:bg-[#f2f4f6] transition-colors rounded-l-lg"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-[#191c1e]">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#3d4947] hover:bg-[#f2f4f6] transition-colors rounded-r-lg"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-sm text-[#6d7a77]">
                Subtotal:{" "}
                <span className="font-semibold text-[#191c1e]">{formatRupiah(subtotal)}</span>
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              {isBuyer ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#cc4636] py-3 text-sm font-semibold text-white hover:bg-[#b33d2f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={16} />
                  {isAdding
                    ? "Menambahkan..."
                    : addSuccess
                    ? <><Check size={15} />Ditambahkan</>
                    : product.stock === 0
                    ? "Stok Habis"
                    : "Tambah ke Keranjang"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#cc4636] py-3 text-sm font-semibold text-white hover:bg-[#b33d2f] transition-colors"
                >
                  <ShoppingCart size={16} />
                  Masuk untuk belanja
                </Link>
              )}
              <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#bcc9c6] text-[#6d7a77] hover:bg-[#f2f4f6] transition-colors">
                <Heart size={18} />
              </button>
            </div>

            {/* One-store note */}
            {isBuyer && (
              <div className="flex items-start gap-1.5 text-xs text-[#6d7a77]">
                <Info size={12} className="shrink-0 mt-0.5" />
                <span>Keranjang hanya mendukung 1 toko per checkout. Menambah produk dari toko berbeda akan menghapus isi keranjang sebelumnya.</span>
              </div>
            )}

            {addError && (
              <p className="text-xs text-[#cc4636]">{addError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Store info */}
      <div className="mt-10">
        <StoreInfoBlock store={product.store} />
      </div>
    </div>
  );
}
