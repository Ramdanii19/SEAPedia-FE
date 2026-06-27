"use client";

import { useEffect, useState } from "react";
import reportService from "../service/report.service";
import { BuyerSpending } from "../types/report.types";

export function useBuyerSpending() {
  const [data, setData] = useState<BuyerSpending | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reportService
      .getBuyerSpending()
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.message ?? "Gagal memuat laporan"))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
