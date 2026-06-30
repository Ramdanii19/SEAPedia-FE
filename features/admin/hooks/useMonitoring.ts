"use client";

import { useCallback, useState } from "react";
import adminService from "../service/admin.service";

export type MonitoringTab =
  | "users"
  | "stores"
  | "products"
  | "orders"
  | "vouchers"
  | "promos"
  | "deliveries"
  | "overdue";

type TabState = {
  data: any[] | null;
  total: number | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL: TabState = { data: null, total: null, isLoading: false, error: null };

// Key di dalam res.data yang berisi array untuk masing-masing tab
const DATA_KEYS: Record<MonitoringTab, string> = {
  users:      "users",
  stores:     "stores",
  products:   "products",
  orders:     "orders",
  vouchers:   "vouchers",
  promos:     "promos",
  deliveries: "jobs",
  overdue:    "orders",
};

const FETCHERS: Record<MonitoringTab, () => Promise<any>> = {
  users:      adminService.getUsers,
  stores:     adminService.getStores,
  products:   adminService.getProducts,
  orders:     adminService.getOrders,
  vouchers:   adminService.getVouchers,
  promos:     adminService.getPromos,
  deliveries: adminService.getDeliveryJobs,
  overdue:    adminService.getOverdueOrders,
};

export function useMonitoring() {
  const [cache, setCache] = useState<Partial<Record<MonitoringTab, TabState>>>({});

  const load = useCallback(async (tab: MonitoringTab) => {
    setCache((prev) => ({
      ...prev,
      [tab]: { data: null, total: null, isLoading: true, error: null },
    }));
    try {
      const res = await FETCHERS[tab]();
      // res = { success, data: { [key]: [...], pagination: {...} }, message }
      const raw   = res.data ?? res;
      const items = raw?.[DATA_KEYS[tab]] ?? [];
      const total = raw?.pagination?.total ?? items.length;
      setCache((prev) => ({
        ...prev,
        [tab]: { data: items, total, isLoading: false, error: null },
      }));
    } catch (err: any) {
      setCache((prev) => ({
        ...prev,
        [tab]: { data: [], total: 0, isLoading: false, error: err?.message ?? "Gagal memuat data" },
      }));
    }
  }, []);

  function getTab(tab: MonitoringTab): TabState {
    return cache[tab] ?? INITIAL;
  }

  function ensureLoaded(tab: MonitoringTab) {
    if (!cache[tab]) load(tab);
  }

  return { getTab, ensureLoaded, load };
}
