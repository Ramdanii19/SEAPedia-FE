"use client";

import Link from "next/link";
import { Heart, PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/utils/formatRupiah";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import apiClient from "@/services/apiClient";

type WishlistProduct = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  stock: number;
  store: { _id: string; storeName: string };
};

export function WishlistSection() {
  const { ids, toggle, isLoading: ctxLoading } = useWishlist();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiClient.get<any>("/wishlist")
      .then((res) => {
        setProducts(res.data?.products ?? []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Sync local list saat toggle (hapus card saat di-unlike)
  const visible = products.filter((p) => ids.has(p._id));

  if (isLoading || ctxLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#fde8e6] flex items-center justify-center">
          <Heart size={28} className="text-[#e53935]" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#191c1e]">Wishlist Masih Kosong</p>
          <p className="text-sm text-[#6d7a77] mt-1">Tap icon ❤ di produk untuk menyimpannya di sini</p>
        </div>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00685f] text-white text-sm font-semibold hover:bg-[#005049] transition-colors"
        >
          <PackageSearch size={16} />
          Jelajahi Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#6d7a77]">{visible.length} produk tersimpan</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((product) => (
          <div
            key={product._id}
            className="rounded-xl border border-[#bcc9c6]/40 bg-white flex flex-col overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <Link href={`/products/${product._id}`} className="relative block aspect-square bg-[#f2f4f6]">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-[#bcc9c6]">Tidak ada gambar</span>
                </div>
              )}
            </Link>

            {/* Content */}
            <div className="flex flex-col gap-1.5 p-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/products/${product._id}`}
                  className="flex-1 text-sm font-semibold text-[#191c1e] line-clamp-2 hover:text-[#00685f] transition-colors leading-snug"
                >
                  {product.name}
                </Link>
                <button
                  onClick={() => toggle(product._id)}
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-[#fde8e6] transition-colors"
                  title="Hapus dari wishlist"
                >
                  <Heart size={13} className="text-[#e53935] fill-[#e53935]" />
                </button>
              </div>

              <p className="text-lg font-bold text-[#00685f] leading-tight">{formatRupiah(product.price)}</p>
              <p className="text-xs text-[#6d7a77]">
                Oleh: <span className="font-medium text-[#3d4947]">{product.store?.storeName ?? "—"}</span>
              </p>

              {product.stock === 0 && (
                <span className="inline-flex w-fit rounded-full bg-[#fde8e6] px-2 py-0.5 text-[10px] font-semibold text-[#cc4636]">
                  Habis
                </span>
              )}

              <Link
                href={`/products/${product._id}`}
                className="mt-auto block rounded-lg border border-[#00685f] py-2 text-center text-xs font-semibold text-[#00685f] hover:bg-[#e8f4f3] transition-colors"
              >
                Lihat Produk
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
