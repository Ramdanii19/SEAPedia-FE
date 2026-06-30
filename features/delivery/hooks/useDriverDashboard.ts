"use client";

import { useEffect, useState } from "react";
import deliveryService from "../service/delivery.service";
import { DriverDashboard } from "../types/delivery.types";

export function useDriverDashboard() {
  const [data, setData] = useState<DriverDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    deliveryService
      .getDashboard()
      .then((res) => setData((res as any).data ?? res))
      .catch((err) => setError(err?.message ?? "Gagal memuat dashboard"))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
