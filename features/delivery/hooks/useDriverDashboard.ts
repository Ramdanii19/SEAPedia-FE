"use client";

import { useCallback, useEffect, useState } from "react";
import deliveryService from "../service/delivery.service";
import { DriverDashboard } from "../types/delivery.types";

export function useDriverDashboard() {
  const [data, setData] = useState<DriverDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await deliveryService.getDashboard();
      setData((res as any).data ?? res);
    } catch (err: any) {
      setError(err?.message ?? "Gagal memuat dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, isLoading, error, reload: load };
}
