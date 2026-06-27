"use client";

import { useCallback, useEffect, useState } from "react";
import orderService from "../service/order.service";
import { Order } from "../types/order.types";

export function useSellerIncoming() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getSellerIncoming();
      const data = res.data as any;
      setOrders(Array.isArray(data) ? data : data?.orders ?? []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { orders, isLoading, reload: load };
}
