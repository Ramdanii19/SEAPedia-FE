"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "../hooks/useFeaturedProducts";
import { ProductGrid } from "../components/ProductGrid";

export function FeaturedProductsSection() {
  const { products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#191c1e]">Produk Unggulan</h2>
            <p className="text-sm text-[#6d7a77] mt-1">
              Temukan kurasi produk terbaik dari berbagai pelosok negeri.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-[#00685f] hover:text-[#005049] transition-colors shrink-0"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          gridClassName="sm:grid-cols-2 lg:grid-cols-4"
        />
      </div>
    </section>
  );
}
