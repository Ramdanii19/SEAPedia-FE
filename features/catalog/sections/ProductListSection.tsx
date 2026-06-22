"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductGrid } from "../components/ProductGrid";
import { useProductList } from "../hooks/useProductList";

const CATEGORIES = ["Elektronik", "Pakaian", "Kerajinan", "Makanan"];

const SORT_OPTIONS = [
  { value: "newest",     label: "Terbaru" },
  { value: "price_asc",  label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "popular",    label: "Terlaris" },
];

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#bcc9c6] text-[#3d4947] transition-colors hover:bg-[#f0f5f4] disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`el-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-[#6d7a77]"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-[#00685f] text-white"
                : "border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f0f5f4]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#bcc9c6] text-[#3d4947] transition-colors hover:bg-[#f0f5f4] disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export function ProductListSection() {
  const {
    products,
    isLoading,
    page,
    setPage,
    total,
    totalPages,
    from,
    to,
    pending,
    setPending,
    applyFilters,
  } = useProductList();

  function toggleCategory(cat: string) {
    setPending((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 flex gap-8">
      {/* Filter sidebar — desktop only */}
      <aside className="hidden md:flex flex-col gap-6 w-52 shrink-0">
        {/* Kategori */}
        <div>
          <p className="text-sm font-semibold text-[#191c1e] mb-3">Kategori</p>
          <div className="flex flex-col gap-2.5">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={pending.categories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                />
                <span className="text-sm text-[#3d4947]">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rentang Harga */}
        <div>
          <p className="text-sm font-semibold text-[#191c1e] mb-3">Rentang Harga</p>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6d7a77]">Rp</span>
              <input
                type="number"
                placeholder="Min"
                value={pending.minPrice}
                onChange={(e) => setPending((p) => ({ ...p, minPrice: e.target.value }))}
                className="w-full rounded-lg border border-[#bcc9c6] py-2 pl-8 pr-3 text-sm focus:border-[#00685f]/40 focus:outline-none"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6d7a77]">Rp</span>
              <input
                type="number"
                placeholder="Maks"
                value={pending.maxPrice}
                onChange={(e) => setPending((p) => ({ ...p, maxPrice: e.target.value }))}
                className="w-full rounded-lg border border-[#bcc9c6] py-2 pl-8 pr-3 text-sm focus:border-[#00685f]/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Urutkan */}
        <div>
          <p className="text-sm font-semibold text-[#191c1e] mb-3">Urutkan</p>
          <select
            value={pending.sort}
            onChange={(e) => setPending((p) => ({ ...p, sort: e.target.value }))}
            className="w-full rounded-lg border border-[#bcc9c6] py-2 px-3 text-sm text-[#3d4947] focus:border-[#00685f]/40 focus:outline-none bg-white"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Apply button */}
        <button
          onClick={applyFilters}
          className="w-full rounded-lg bg-[#00685f] py-2.5 text-sm font-semibold text-white hover:bg-[#005049] transition-colors"
        >
          Terapkan Filter
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#191c1e]">Katalog Produk</h1>
            <p className="text-sm text-[#6d7a77] mt-1">
              Menampilkan produk kerajinan dan komoditas terbaik Nusantara.
            </p>
          </div>
          {total > 0 && !isLoading && (
            <p className="text-sm text-[#6d7a77] shrink-0 mt-1">
              Menampilkan {from}–{to} dari {total}
            </p>
          )}
        </div>

        <ProductGrid products={products} isLoading={isLoading} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
