"use client";

import { useCallback, useEffect, useState } from "react";
import adminService from "../service/admin.service";
import { AdminOrder } from "../types/admin.types";

export function useTimeSimulation() {
  const [overdueOrders, setOverdueOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOverdue, setIsLoadingOverdue] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateMessage, setSimulateMessage] = useState<string | null>(null);
  const [processMessage, setProcessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOverdue = useCallback(async () => {
    setIsLoadingOverdue(true);
    try {
      const res = await adminService.getOverdueOrders();
      const data = res.data as any;
      setOverdueOrders(Array.isArray(data) ? data : data?.orders ?? []);
    } catch {
      setOverdueOrders([]);
    } finally {
      setIsLoadingOverdue(false);
    }
  }, []);

  useEffect(() => {
    loadOverdue();
  }, [loadOverdue]);

  async function simulateNextDay() {
    setIsSimulating(true);
    setError(null);
    setSimulateMessage(null);
    try {
      const res = await adminService.simulateNextDay();
      setSimulateMessage((res.data as any)?.message ?? "Waktu dimajukan 1 hari.");
      await loadOverdue();
    } catch (err: any) {
      setError(err?.message ?? "Gagal memajukan waktu.");
    } finally {
      setIsSimulating(false);
    }
  }

  async function processLateOrders() {
    setIsProcessing(true);
    setError(null);
    setProcessMessage(null);
    try {
      const res = await adminService.processLateOrders();
      setProcessMessage((res.data as any)?.message ?? "Order telat berhasil diproses.");
      await loadOverdue();
    } catch (err: any) {
      setError(err?.message ?? "Gagal memproses order telat.");
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    overdueOrders,
    isLoadingOverdue,
    isSimulating,
    isProcessing,
    simulateMessage,
    processMessage,
    error,
    simulateNextDay,
    processLateOrders,
    reloadOverdue: loadOverdue,
  };
}
