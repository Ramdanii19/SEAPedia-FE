"use client";

import { useCallback, useEffect, useState } from "react";
import deliveryService from "../service/delivery.service";
import { DeliveryJob } from "../types/delivery.types";

export function useJobDetail(id: string) {
  const [job, setJob] = useState<DeliveryJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deliveryService.getJob(id);
      const d = (res as any).data ?? res;
      setJob(d?.job ?? d);
    } catch (err: any) {
      setError(err?.message ?? "Gagal memuat detail job");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { job, isLoading, error, reload: load };
}
