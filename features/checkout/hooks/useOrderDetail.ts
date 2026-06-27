"use client";

import { useCallback, useEffect, useState } from "react";
import orderService from "../service/order.service";
import { Order } from "../types/order.types";

export function useOrderDetail(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getOrder(id);
      setOrder(res.data);
    } catch (err: any) {
      setError(err?.message ?? "Gagal memuat pesanan");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { order, isLoading, error, reload: load };
}
