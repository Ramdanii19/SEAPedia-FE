"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/services/apiClient";

type WishlistContextValue = {
  ids: Set<string>;
  toggle: (productId: string) => Promise<void>;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextValue>({
  ids: new Set(),
  toggle: async () => {},
  isLoading: false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, activeRole } = useAuth();
  const [ids, setIds]           = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const isBuyer = !!user && (activeRole as string) === "BUYER";

  useEffect(() => {
    if (!isBuyer) { setIds(new Set()); return; }
    setIsLoading(true);
    apiClient.get<any>("/wishlist")
      .then((res) => {
        const products: any[] = res.data?.products ?? [];
        setIds(new Set(products.map((p: any) => p._id ?? p.id)));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isBuyer]);

  const toggle = useCallback(async (productId: string) => {
    if (!isBuyer) return;
    // Optimistic update
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId); else next.add(productId);
      return next;
    });
    try {
      await apiClient.post<any>(`/wishlist/${productId}`);
    } catch {
      // Revert on error
      setIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId); else next.add(productId);
        return next;
      });
    }
  }, [isBuyer]);

  return (
    <WishlistContext.Provider value={{ ids, toggle, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
