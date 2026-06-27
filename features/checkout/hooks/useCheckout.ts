"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart";
import { useAddresses } from "@/features/wallet";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { DeliveryMethod, DELIVERY_METHOD } from "@/lib/enums";
import { Discount, discountService } from "@/features/discount";
import checkoutService from "../service/checkout.service";

const DELIVERY_FEE_ESTIMATE: Record<DeliveryMethod, number> = {
  delivery: 15_000,
  pickup: 0,
};

function calcDiscount(discount: Discount | null, base: number): number {
  if (!discount) return 0;
  if (discount.discountType === "PERCENTAGE") {
    return Math.round(base * (discount.discountValue / 100));
  }
  return discount.discountValue;
}

export function useCheckout() {
  const router = useRouter();
  const { cart, clear } = useCart();
  const { addresses, isLoading: addressLoading } = useAddresses();
  const { wallet, isLoading: walletLoading } = useWallet();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DELIVERY_METHOD.DELIVERY
  );

  const [appliedVoucher, setAppliedVoucher] = useState<Discount | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<Discount | null>(null);
  const [voucherError, setVoucherError] = useState<string>("");
  const [promoError, setPromoError] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FE-side estimates (BE is source of truth on actual checkout)
  const subtotal = cart?.subtotal ?? 0;
  const deliveryFee = DELIVERY_FEE_ESTIMATE[deliveryMethod];
  const voucherDiscount = calcDiscount(appliedVoucher, subtotal);
  const promoDiscount = calcDiscount(appliedPromo, subtotal);
  const discountAmount = voucherDiscount + promoDiscount;
  const ppnAmount = Math.round(subtotal * 0.12);
  const finalTotal = Math.max(0, subtotal + deliveryFee + ppnAmount - discountAmount);

  const balance = wallet?.balance ?? 0;
  const isBalanceSufficient = balance >= finalTotal;

  function normalizeDiscountError(err: any): string {
    const msg: string = err?.message ?? "";
    if (/expired|kedaluwarsa|kadaluarsa/i.test(msg)) return "Kode sudah kedaluwarsa.";
    if (/habis|usage|limit/i.test(msg)) return "Kuota kode sudah habis.";
    if (/tidak ditemukan|not found|invalid/i.test(msg)) return "Kode tidak valid.";
    return msg || "Kode tidak dapat digunakan.";
  }

  async function applyVoucher(code: string) {
    setVoucherError("");
    try {
      const res = await discountService.checkVoucher(code);
      setAppliedVoucher(res.data);
    } catch (err: any) {
      setAppliedVoucher(null);
      setVoucherError(normalizeDiscountError(err));
      throw err;
    }
  }

  async function applyPromo(code: string) {
    setPromoError("");
    try {
      const res = await discountService.checkPromo(code);
      setAppliedPromo(res.data);
    } catch (err: any) {
      setAppliedPromo(null);
      setPromoError(normalizeDiscountError(err));
      throw err;
    }
  }

  function removeVoucher() {
    setAppliedVoucher(null);
    setVoucherError("");
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoError("");
  }

  async function submit() {
    if (!selectedAddressId) {
      setError("Pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await checkoutService.checkout({
        addressId: selectedAddressId,
        deliveryMethod,
        voucherCode: appliedVoucher?.code || undefined,
        promoCode: appliedPromo?.code || undefined,
      });
      await clear();
      router.push(`/orders/${res.data.id}`);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (/saldo|balance|insufficient/i.test(msg)) {
        setError("Saldo dompet Anda tidak cukup. Silakan top up terlebih dahulu.");
      } else {
        setError(msg || "Checkout gagal. Coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    cart,
    addresses,
    wallet,
    selectedAddressId,
    setSelectedAddressId,
    deliveryMethod,
    setDeliveryMethod,
    // discount
    appliedVoucher,
    appliedPromo,
    voucherError,
    promoError,
    applyVoucher,
    applyPromo,
    removeVoucher,
    removePromo,
    // submit
    isSubmitting,
    error,
    isBalanceSufficient,
    balance,
    // price summary
    subtotal,
    deliveryFee,
    discountAmount,
    ppnAmount,
    finalTotal,
    isLoading: addressLoading || walletLoading,
    submit,
  };
}
