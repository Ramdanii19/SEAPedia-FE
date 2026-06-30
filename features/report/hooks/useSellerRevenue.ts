"use client";

import { useEffect, useState } from "react";
import reportService from "../service/report.service";
import { SellerRevenue } from "../types/report.types";

export function useSellerRevenue() {
  const [data, setData] = useState<SellerRevenue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reportService
      .getSellerRevenue()
      .then((res) => setData((res as any).data ?? res))
      .catch((err) => setError(err?.message ?? "Gagal memuat laporan"))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
