"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart";
import { useAddresses } from "@/features/wallet";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { DeliveryMethod, DELIVERY_METHOD } from "@/lib/enums";
import checkoutService from "../service/checkout.service";

const DELIVERY_FEE_ESTIMATE: Record<DeliveryMethod, number> = {
  delivery: 15_000,
  pickup: 0,
};

export function useCheckout() {
  const router = useRouter();
  const { cart, clear } = useCart();
  const { addresses, isLoading: addressLoading } = useAddresses();
  const { wallet, isLoading: walletLoading } = useWallet();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DELIVERY_METHOD.DELIVERY
  );
  const [voucherCode, setVoucherCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FE-side estimate (BE is source of truth on actual checkout)
  const subtotal = cart?.subtotal ?? 0;
  const deliveryFee = DELIVERY_FEE_ESTIMATE[deliveryMethod];
  const discountAmount = 0; // filled in Branch 10
  const ppnAmount = Math.round(subtotal * 0.12);
  const finalTotal = subtotal + deliveryFee + ppnAmount - discountAmount;

  const balance = wallet?.balance ?? 0;
  const isBalanceSufficient = balance >= finalTotal;

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
        voucherCode: voucherCode || undefined,
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
    voucherCode,
    setVoucherCode,
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
