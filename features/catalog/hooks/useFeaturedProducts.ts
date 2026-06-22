"use client";

import { useEffect, useState } from "react";
import catalogService from "../service/catalog.service";
import { Product } from "../types/catalog.types";

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    catalogService
      .listProducts({ limit: 4 })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { products, isLoading };
}
