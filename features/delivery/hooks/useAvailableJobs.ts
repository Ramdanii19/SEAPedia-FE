"use client";

import { useCallback, useEffect, useState } from "react";
import deliveryService from "../service/delivery.service";
import { DeliveryJob } from "../types/delivery.types";

export function useAvailableJobs() {
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deliveryService.listAvailable();
      const data = res.data as any;
      setJobs(Array.isArray(data) ? data : data?.jobs ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Gagal memuat daftar job");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { jobs, isLoading, error, reload: load };
}
