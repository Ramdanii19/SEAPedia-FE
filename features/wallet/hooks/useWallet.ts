"use client";

import { useCallback, useEffect, useState } from "react";
import walletService from "../service/wallet.service";
import { Wallet, WalletTransaction } from "../types/wallet.types";

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTopping, setIsTopping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walletRes, txRes] = await Promise.all([
        walletService.getWallet(),
        walletService.getTransactions(),
      ]);
      setWallet(walletRes.data);
      const txData = txRes.data as any;
      setTransactions(Array.isArray(txData) ? txData : txData?.transactions ?? []);
    } catch {
      setError("Gagal memuat data dompet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function topup(amount: number) {
    setIsTopping(true);
    try {
      await walletService.topUp({ amount });
      await load();
    } finally {
      setIsTopping(false);
    }
  }

  return { wallet, transactions, isLoading, isTopping, error, topup, reload: load };
}
