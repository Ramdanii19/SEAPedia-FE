"use client";

import { useState, useEffect, useCallback } from "react";
import catalogService from "../service/catalog.service";
import { Product } from "../types/catalog.types";

const LIMIT = 12;

export type ProductFilters = {
  search: string;
  categories: string[];
  minPrice: string;
  maxPrice: string;
  sort: string;
};

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  categories: [],
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Applied filters (triggers fetch)
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  // Pending filters (edited in sidebar, applied on button click)
  const [pending, setPending] = useState<ProductFilters>(DEFAULT_FILTERS);

  const fetchProducts = useCallback(async (f: ProductFilters, p: number) => {
    setIsLoading(true);
    try {
      const res = await catalogService.listProducts({
        search:   f.search || undefined,
        category: f.categories[0] || undefined,
        sort:     f.sort !== "newest" ? f.sort : undefined,
        minPrice: f.minPrice ? Number(f.minPrice) : undefined,
        maxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
        page:     p,
        limit:    LIMIT,
      });
      setProducts(res.data);
      // backend may return total at top-level
      setTotal((res as any).total ?? res.data.length);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters, page);
  }, [filters, page, fetchProducts]);

  function applyFilters() {
    setFilters({ ...pending });
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, total);

  return {
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
  };
}
