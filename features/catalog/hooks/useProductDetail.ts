"use client";

import { useEffect, useState } from "react";
import catalogService from "../service/catalog.service";
import { Product } from "../types/catalog.types";

export function useProductDetail(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    catalogService
      .getProduct(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { product, isLoading, error };
}
