"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { ProductGrid } from "../components/ProductGrid";
import { useProductList } from "../hooks/useProductList";

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
          <span key={`el-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-[#6d7a77]">
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
    filters,
    setSearch,
  } = useProductList();

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, setSearch]);

  function clearSearch() {
    setInputValue("");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#191c1e]">Katalog Produk</h1>
        <p className="text-sm text-[#6d7a77] mt-1">
          Menampilkan produk kerajinan dan komoditas terbaik Nusantara.
        </p>

        {/* Search bar */}
        <div className="mt-5 max-w-xl">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a77] pointer-events-none"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cari produk..."
              className="w-full rounded-lg border border-[#bcc9c6] py-2.5 pl-9 pr-9 text-sm text-[#191c1e] placeholder:text-[#6d7a77] focus:border-[#00685f] focus:outline-none transition-colors"
            />
            {inputValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7a77] hover:text-[#191c1e] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Result info */}
        {!isLoading && total > 0 && (
          <p className="text-xs text-[#6d7a77] mt-3">
            Menampilkan {from}–{to} dari {total} produk
            {filters.search ? ` untuk "${filters.search}"` : ""}
          </p>
        )}
        {!isLoading && total === 0 && filters.search && (
          <p className="text-xs text-[#6d7a77] mt-3">
            Tidak ada produk yang cocok dengan &ldquo;{filters.search}&rdquo;.
          </p>
        )}
      </div>

      <ProductGrid products={products} isLoading={isLoading} />

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
