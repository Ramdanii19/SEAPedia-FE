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
  isLoading: boolean;
  error: string | null;
};

const INITIAL: TabState = { data: null, isLoading: false, error: null };

const FETCHERS: Record<MonitoringTab, () => Promise<{ data: any }>> = {
  users: adminService.getUsers,
  stores: adminService.getStores,
  products: adminService.getProducts,
  orders: adminService.getOrders,
  vouchers: adminService.getVouchers,
  promos: adminService.getPromos,
  deliveries: adminService.getDeliveryJobs,
  overdue: adminService.getOverdueOrders,
};

export function useMonitoring() {
  const [cache, setCache] = useState<Partial<Record<MonitoringTab, TabState>>>({});

  const load = useCallback(async (tab: MonitoringTab) => {
    setCache((prev) => ({
      ...prev,
      [tab]: { data: null, isLoading: true, error: null },
    }));
    try {
      const res = await FETCHERS[tab]();
      const data = res.data;
      setCache((prev) => ({
        ...prev,
        [tab]: { data: Array.isArray(data) ? data : data?.items ?? data?.data ?? [], isLoading: false, error: null },
      }));
    } catch (err: any) {
      setCache((prev) => ({
        ...prev,
        [tab]: { data: [], isLoading: false, error: err?.message ?? "Gagal memuat data" },
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
