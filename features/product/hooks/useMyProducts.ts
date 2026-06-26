"use client";

import { useCallback, useEffect, useState } from "react";
import { Product } from "@/features/catalog/types/catalog.types";
import productService from "../service/product.service";

export function useMyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.listMyProducts();
      setProducts(res.data?.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, isLoading, reload: load };
}
