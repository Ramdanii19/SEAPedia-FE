"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import cartService from "../service/cart.service";
import { Cart } from "../types/cart.types";

type CartContextValue = {
  cart: Cart | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  add: (productId: number, qty: number) => Promise<void>;
  updateQty: (productId: number, qty: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // one-store conflict state
  const [conflictPending, setConflictPending] = useState<{
    productId: number;
    qty: number;
  } | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data ?? null);
    } catch {
      setCart(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  async function add(productId: number, qty: number) {
    try {
      const res = await cartService.addToCart({ productId, quantity: qty });
      setCart(res.data ?? null);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      // detect "different store" / "beda toko" error from backend
      if (/different store|beda toko|toko lain|store/i.test(msg)) {
        setConflictPending({ productId, qty });
      } else {
        throw err;
      }
    }
  }

  async function updateQty(productId: number, qty: number) {
    const res = await cartService.updateQty(productId, qty);
    setCart(res.data ?? null);
  }

  async function remove(productId: number) {
    const res = await cartService.removeItem(productId);
    setCart(res.data ?? null);
  }

  async function clear() {
    await cartService.clearCart();
    setCart(null);
  }

  async function handleConflictConfirm() {
    if (!conflictPending) return;
    setIsClearing(true);
    try {
      await cartService.clearCart();
      const res = await cartService.addToCart({
        productId: conflictPending.productId,
        quantity: conflictPending.qty,
      });
      setCart(res.data ?? null);
      setConflictPending(null);
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, isLoading, refresh, add, updateQty, remove, clear }}
    >
      {children}

      {/* One-store conflict dialog */}
      <Dialog
        open={!!conflictPending}
        onOpenChange={(v) => !v && setConflictPending(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ganti Toko?</DialogTitle>
            <DialogDescription>
              Keranjang Anda berisi produk dari toko lain. Kosongkan keranjang
              dulu dan tambahkan produk ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConflictPending(null)}
              disabled={isClearing}
            >
              Batal
            </Button>
            <Button
              disabled={isClearing}
              className="bg-[#00685f] hover:bg-[#005049]"
              onClick={handleConflictConfirm}
            >
              {isClearing ? "Memproses..." : "Ya, Kosongkan & Tambahkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function useCartItemCount(): number {
  const { cart } = useCart();
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}
